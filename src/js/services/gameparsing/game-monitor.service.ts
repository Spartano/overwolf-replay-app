import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { GameEvent } from '../../hs-integration/models/game-event';
import { DeckParserService } from '../../hs-integration/services/deck-parser.service';
import { GameEventsEmitterService } from '../../hs-integration/services/game-events-emitter.service';
import { OverwolfService } from '../../hs-integration/services/overwolf.service';
import { Game } from '../../models/game';
import { EndGameUploaderService } from '../endgame/end-game-uploader.service';
import { Events } from '../events.service';
import { FileUploadService } from '../file-upload.service';
import { GameDbService } from '../game-db.service';

@Injectable()
export class GameMonitorService {
	private currentGameId: string;
	private currentDeckstring: string;
	private currentDeckname: string;
	private currentBuildNumber: number;
	private currentScenarioId: string;
	// This is only set by Firestone integration
	private currentReviewId: string;

	constructor(
		private gameEvents: GameEventsEmitterService,
		private logger: NGXLogger,
		private deckService: DeckParserService,
		private endGameUploader: EndGameUploaderService,
		private events: Events,
		private fileUpload: FileUploadService,
		private gameDb: GameDbService,
		private ow: OverwolfService,
	) {
		this.gameEvents.allEvents.subscribe((gameEvent: GameEvent) => {
			this.handleEvent(gameEvent);
		});
		this.events.on(Events.NEW_GAME_ID).subscribe(async event => {
			this.logger.debug('Received new game id event', event);
			this.currentGameId = event.data[0];
		});
		this.ow.registerInfo(OverwolfService.FIRESTONE_ID, async result => {
			this.logger.debug('[manastorm-bridge] received firestone info update', result);
			const info = result && result.info ? JSON.parse(result.info) : undefined;
			if (info && info.type === 'new-review') {
				const game: Game = info.game;
				await this.gameDb.save(game);
				this.logger.debug('game saved in db', game.id);
			} else if (info && info.type === 'new-empty-review') {
				this.currentReviewId = info.reviewId;
			}
		});
	}

	private async handleEvent(gameEvent: GameEvent) {
		switch (gameEvent.type) {
			case GameEvent.GAME_START:
				// This is here only during the transition period, when Firestone still has the old version
				// and manastorm is updated
				this.logger.warn('[manastorm-bridge] Creating empty review, should be removed once firestone is updated');
				const currentReviewId = await this.fileUpload.createEmptyReview();
				const info = {
					type: 'new-empty-review',
					reviewId: currentReviewId,
					replayUrl: undefined,
				};
				this.ow.setExtensionInfo(JSON.stringify(info));
			case GameEvent.LOCAL_PLAYER:
				this.currentDeckstring = this.deckService.currentDeck.deckstring;
				this.currentDeckname = this.deckService.currentDeck.name;
				break;
			case GameEvent.MATCH_METADATA:
				this.currentBuildNumber = gameEvent.additionalData.metaData.BuildNumber;
				this.currentScenarioId = gameEvent.additionalData.metaData.ScenarioID;
				break;
			case GameEvent.GAME_END:
				try {
					const isFirestoneRunning = await this.ow.isFirestoneRunning();
					// The goal here is to still have things work properly if Manastorm is updated but not firetosne
					// If we update manastom first, then it will continue to upload replays. It won't send
					// infos to Firestone anymore
					if (isFirestoneRunning && this.currentReviewId) {
						// Upload is handled by manastorm
						this.logger.debug('[manastorm-bridge] Firestone is running and initialized a review, no need to upload a review');
						return;
					}
					console.log('game-monitor, game_ned', gameEvent, this.deckService);
					const currentReviewId = await this.fileUpload.createEmptyReview();
					const game = await this.endGameUploader.upload(
						gameEvent,
						currentReviewId,
						this.currentGameId,
						this.currentDeckstring,
						this.currentDeckname,
						this.currentBuildNumber,
						this.currentScenarioId,
					);
					this.deckService.reset();
					this.currentDeckstring = undefined;
					this.currentDeckname = undefined;
					this.currentBuildNumber = undefined;
					this.currentReviewId = undefined;
					console.log('broadcasting end of game', game.player, game.opponent, game.gameFormat, game.gameMode, game.deckstring);
					this.events.broadcast(Events.REPLAY_CREATED, JSON.stringify(game));
					break;
				} catch (e) {
					console.log('exception while trying to handle GAME_END event', e);
					this.deckService.reset();
				}
			default:
				break;
		}
	}
}

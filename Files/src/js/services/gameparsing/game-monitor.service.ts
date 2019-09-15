import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { GameEvent } from '../../hs-integration/models/game-event';
import { DeckParserService } from '../../hs-integration/services/deck-parser.service';
import { GameEventsEmitterService } from '../../hs-integration/services/game-events-emitter.service';
import { EndGameUploaderService } from '../endgame/end-game-uploader.service';
import { Events } from '../events.service';

@Injectable()
export class GameMonitorService {
	private currentGameId: string;
	private currentDeckstring: string;
	private currentDeckname: string;
	private currentBuildNumber: number;
	private currentScenarioId: string;

	constructor(
		private gameEvents: GameEventsEmitterService,
		private logger: NGXLogger,
		private deckService: DeckParserService,
		private endGameUploader: EndGameUploaderService,
		private events: Events,
	) {
		this.gameEvents.allEvents.subscribe((gameEvent: GameEvent) => {
			this.handleEvent(gameEvent);
		});
		this.events.on(Events.NEW_GAME_ID).subscribe(event => {
			this.logger.debug('Received new game id event', event);
			this.currentGameId = event.data[0];
		});
	}

	private async handleEvent(gameEvent: GameEvent) {
		switch (gameEvent.type) {
			case 'LOCAL_PLAYER':
				this.currentDeckstring = this.deckService.currentDeck.deckstring;
				this.currentDeckname = this.deckService.currentDeck.name;
				break;
			case 'MATCH_METADATA':
				this.currentBuildNumber = gameEvent.additionalData.metaData.BuildNumber;
				this.currentScenarioId = gameEvent.additionalData.metaData.ScenarioID;
				break;
			case 'GAME_END':
				try {
					console.log('game-monitor, game_ned', gameEvent, this.deckService);
					const game = await this.endGameUploader.upload(
						gameEvent,
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

import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { GameEvent } from '../../models/game-event';
import { DeckParserService } from '../deck/deck-parser.service';
import { EndGameUploaderService } from '../endgame/end-game-uploader.service';
import { Events } from '../events.service';
import { GameEvents } from '../game-events.service';

@Injectable()
export class GameMonitorService {
	private currentGameId: string;

	constructor(
		private gameEvents: GameEvents,
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
			case 'GAME_END':
				try {
					const game = await this.endGameUploader.upload(gameEvent, this.currentGameId, this.deckService.currentDeck.deckstring);
					this.deckService.reset();
					console.log('broadcasting end of game', game.player, game.opponent, game.gameFormat, game.gameMode);
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

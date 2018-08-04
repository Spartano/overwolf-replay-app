import { Injectable } from '@angular/core';

import { Game } from '../../models/game';
import { GameEvent } from '../../models/game-event';

import { GameHelper } from './game-helper.service';
import { GameParserService } from '../game-parser.service';
import { GameEvents } from '../game-events.service';
import { Events } from '../events.service';

@Injectable()
export class GameMonitorService {

	constructor(
		private gameHelper: GameHelper,
		private gameParserService: GameParserService,
		private gameEvents: GameEvents,
		private events: Events) {

		this.gameEvents.allEvents.subscribe(
			(gameEvent: GameEvent) => {
				this.handleEvent(gameEvent);
			}
		);
	}

	private handleEvent(gameEvent: GameEvent) {
		switch (gameEvent.type) {
			case 'GAME_END':
				// console.log('handling game end event', gameEvent);
				const gameResult = gameEvent.data[0];
				const replayXml = gameEvent.data[1];
				if (!replayXml) {
					console.warn('could not convert replay');
				}
				const game: Game = Game.createEmptyGame();
				game.gameFormat = this.toFormatType(gameResult.FormatType);
				game.gameMode = this.toGameType(gameResult.GameType);
				this.gameHelper.setXmlReplay(game, replayXml);
				this.gameParserService.extractMatchup(game);
				this.gameParserService.extractDuration(game);
				console.log('broadcasting end of game', game.player, game.opponent, game.gameFormat, game.gameMode);
				this.events.broadcast(Events.REPLAY_CREATED, JSON.stringify(game));
				break;
			default:
				break;
		}
	}

	private toFormatType(formatType: number) {
		switch (formatType) {
			case 0:
				return 'unknown';
			case 1:
				return 'wild';
			case 2:
				return 'standard';
			default:
				console.error('unsupported format type', formatType);
				return 'unknown';
		}
	}

	private toGameType(gameType: number) {
		switch (gameType) {
			case 0:
				return 'unknown';
			case 1:
				return 'practice';
			case 2:
				return 'friendly';
			case 4:
				return 'tutorial';
			case 5:
				return 'arena';
			case 7:
				return 'ranked';
			case 8:
				return 'casual';
			case 16:
			case 17:
			case 18:
			case 19:
			case 20:
			case 21:
			case 22:
				return 'tavernbrawl';
			case 23:
				return 'tournament';
			default:
				console.log('unsupported game type', gameType);
				return 'unknown';
		}
	}
}

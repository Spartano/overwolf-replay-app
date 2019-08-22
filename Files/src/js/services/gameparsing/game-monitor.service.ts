import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Game } from '../../models/game';
import { GameEvent } from '../../models/game-event';
import { DeckParserService } from '../deck/deck-parser.service';
import { Events } from '../events.service';
import { GameEvents } from '../game-events.service';
import { GameParserService } from '../game-parser.service';
import { GameHelper } from './game-helper.service';

@Injectable()
export class GameMonitorService {
	private readonly supportedModesDeckRetrieve = ['practice', 'friendly', 'ranked', 'casual', 'arena', 'tavernbrawl'];

	private currentGameId: string;

	constructor(
		private gameHelper: GameHelper,
		private gameParserService: GameParserService,
		private gameEvents: GameEvents,
		private logger: NGXLogger,
		private deckService: DeckParserService,
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

	private handleEvent(gameEvent: GameEvent) {
		switch (gameEvent.type) {
			case 'GAME_END':
				try {
					const gameResult = gameEvent.data[0];
					const replayXml = gameEvent.data[1];
					if (!replayXml) {
						console.warn('could not convert replay');
					}
					this.logger.debug('Creating new game', this.currentGameId);
					const game: Game = Game.createEmptyGame(this.currentGameId);
					game.gameFormat = this.toFormatType(gameResult.FormatType);
					game.gameMode = this.toGameType(gameResult.GameType);
					if (this.supportedModesDeckRetrieve.indexOf(game.gameMode) !== -1) {
						game.deckstring = this.deckService.currentDeck.deckstring;
					}
					this.gameHelper.setXmlReplay(game, replayXml);
					game.uncompressedXmlReplay = replayXml;
					this.gameParserService.extractMatchup(game);
					this.gameParserService.extractDuration(game);
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

import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Game } from '../../models/game';
import { GameEvent } from '../../models/game-event';
import { GameParserService } from '../game-parser.service';
import { GameHelper } from '../gameparsing/game-helper.service';

@Injectable()
export class EndGameUploaderService {
	private readonly supportedModesDeckRetrieve = ['practice', 'friendly', 'ranked', 'casual', 'arena', 'tavernbrawl'];

	constructor(private logger: NGXLogger, private gameHelper: GameHelper, private gameParserService: GameParserService) {}

	public async upload(gameEvent: GameEvent, currentGameId: string, deckstring: any): Promise<Game> {
		const gameResult = gameEvent.data[0];
		const replayXml = gameEvent.data[1];
		if (!replayXml) {
			console.warn('could not convert replay');
		}
		this.logger.debug('Creating new game', currentGameId);
		const game: Game = Game.createEmptyGame(currentGameId);
		game.gameFormat = this.toFormatType(gameResult.FormatType);
		game.gameMode = this.toGameType(gameResult.GameType);
		if (this.supportedModesDeckRetrieve.indexOf(game.gameMode) !== -1) {
			game.deckstring = deckstring;
		}
		this.gameHelper.setXmlReplay(game, replayXml);
		game.uncompressedXmlReplay = replayXml;
		this.gameParserService.extractMatchup(game);
		this.gameParserService.extractDuration(game);
		return game;
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

import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { GameEvent } from '../../hs-integration/models/game-event';
import { PlayersInfoService } from '../../hs-integration/services/players-info.service';
import { Game } from '../../models/game';
import { GameParserService } from '../game-parser.service';
import { GameHelper } from '../gameparsing/game-helper.service';

@Injectable()
export class EndGameUploaderService {
	private readonly supportedModesDeckRetrieve = ['practice', 'friendly', 'ranked', 'casual', 'arena', 'tavernbrawl'];

	constructor(
		private logger: NGXLogger,
		private gameHelper: GameHelper,
		private gameParserService: GameParserService,
		private playersInfo: PlayersInfoService,
	) {}

	public async upload(
		gameEvent: GameEvent,
		currentReviewId: string,
		currentGameId: string,
		deckstring: string,
		deckName: string,
		buildNumber: number,
		scenarioId: string,
	): Promise<Game> {
		const gameResult = gameEvent.additionalData.game;
		const replayXml = gameEvent.additionalData.replayXml;
		if (!replayXml) {
			console.warn('could not convert replay');
		}
		this.logger.debug('Creating new game', currentGameId);
		const game: Game = Game.createEmptyGame(currentGameId);
		game.reviewId = currentReviewId;
		game.gameFormat = this.toFormatType(gameResult.FormatType);
		game.gameMode = this.toGameType(gameResult.GameType);
		game.buildNumber = buildNumber;
		game.scenarioId = scenarioId;
		if (this.supportedModesDeckRetrieve.indexOf(game.gameMode) !== -1) {
			game.deckstring = deckstring;
			game.deckName = deckName;
		}
		this.gameHelper.setXmlReplay(game, replayXml);
		game.uncompressedXmlReplay = replayXml;
		this.gameParserService.extractMatchup(game);
		this.gameParserService.extractDuration(game);
		const [playerInfo, opponentInfo] = await Promise.all([this.playersInfo.getPlayerInfo(), this.playersInfo.getOpponentInfo()]);
		console.log('player infos', playerInfo, opponentInfo);
		let playerRank;
		if (playerInfo && game.gameFormat === 'standard') {
			if (playerInfo.standardLegendRank > 0) {
				playerRank = `legend-${playerInfo.standardLegendRank}`;
			} else {
				playerRank = playerInfo.standardRank;
			}
		} else if (playerInfo && game.gameFormat === 'wild') {
			if (playerInfo.wildLegendRank > 0) {
				playerRank = `legend-${playerInfo.wildLegendRank}`;
			} else {
				playerRank = playerInfo.wildRank;
			}
		}
		let opponentRank;
		if (opponentInfo && game.gameFormat === 'standard') {
			if (opponentInfo.standardLegendRank > 0) {
				opponentRank = `legend-${opponentInfo.standardLegendRank}`;
			} else {
				opponentRank = opponentInfo.standardRank;
			}
		} else if (opponentInfo && game.gameFormat === 'wild') {
			if (opponentInfo.wildLegendRank > 0) {
				opponentRank = `legend-${opponentInfo.wildLegendRank}`;
			} else {
				opponentRank = opponentInfo.wildRank;
			}
		}
		game.opponentRank = opponentRank;
		game.playerRank = playerRank;
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
				return 'tavern-brawl';
			case 23:
				return 'battlegrounds';
			default:
				console.log('unsupported game type', gameType);
				return 'unknown';
		}
	}
}

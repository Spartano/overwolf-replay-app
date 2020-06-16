import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { GameEvent } from '../../hs-integration/models/game-event';
import { MemoryInspectionService } from '../../hs-integration/services/memory-inspection.service';
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
		private memoryInspection: MemoryInspectionService,
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
		console.log('Creating new game', currentGameId);
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
		try {
			this.gameParserService.extractMatchup(game);
			this.gameParserService.extractDuration(game);
		} catch (e) {
			console.error('Could not extract match info', e);
		}
		const [playerInfo, opponentInfo] = await Promise.all([this.playersInfo.getPlayerInfo(), this.playersInfo.getOpponentInfo()]);
		console.log('player infos', playerInfo, opponentInfo);
		let playerRank;
		if (game.gameMode === 'battlegrounds') {
			const battlegroundsInfo = await this.memoryInspection.getBattlegroundsRating();
			playerRank = battlegroundsInfo;
			console.log('updated player rank for battlegrounds', playerRank);
		} else if (playerInfo && game.gameFormat === 'standard') {
			if (playerInfo.standardLegendRank > 0) {
				playerRank = `legend-${playerInfo.standardLegendRank}`;
			} else {
				playerRank = this.parseRank(playerInfo.standardRank);
			}
		} else if (playerInfo && game.gameFormat === 'wild') {
			if (playerInfo.wildLegendRank > 0) {
				playerRank = `legend-${playerInfo.wildLegendRank}`;
			} else {
				playerRank = this.parseRank(playerInfo.wildRank);
			}
		}
		console.log('parsed player rank', playerRank);
		let opponentRank;
		if (game.gameMode !== 'battlegrounds') {
			if (opponentInfo && game.gameFormat === 'standard') {
				if (opponentInfo.standardLegendRank > 0) {
					opponentRank = `legend-${opponentInfo.standardLegendRank}`;
				} else {
					opponentRank = this.parseRank(opponentInfo.standardRank);
				}
			} else if (opponentInfo && game.gameFormat === 'wild') {
				if (opponentInfo.wildLegendRank > 0) {
					opponentRank = `legend-${opponentInfo.wildLegendRank}`;
				} else {
					opponentRank = this.parseRank(opponentInfo.wildRank);
				}
			}
		}
		console.log('parsed opponent rank', opponentRank);
		game.opponentRank = opponentRank;
		game.playerRank = playerRank;
		return game;
	}

	private parseRank(initialRank: string): string {
		if (initialRank && initialRank.indexOf && initialRank.indexOf(' ') !== -1) {
			const leagueName = initialRank.split(' ')[0];
			const leagueId = this.leagueNameToId(leagueName);
			let rank = parseInt(initialRank.split(' ')[1]);
			rank = isNaN(rank) ? -1 : rank;
			return leagueId + '-' + rank;
		}
		return initialRank;
	}

	private leagueNameToId(leagueName: string): number {
		switch (leagueName) {
			case 'Bronze':
				return 5;
			case 'Silver':
				return 4;
			case 'Gold':
				return 3;
			case 'Platinum':
				return 2;
			case 'Diamond':
				return 1;
		}
		return -1;
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

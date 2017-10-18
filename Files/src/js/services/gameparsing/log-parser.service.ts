import { Injectable } from '@angular/core';

// import * as Raven from 'raven-js';

import { Game } from '../../models/game';
import { GameParserService } from '../game-parser.service';
import { DeckParserService } from '../deck/deck-parser.service';
import { GameModeParser } from '../gameparsing/game-mode-parser.service';
import { MemoryInspectionService } from '../plugins/memory-inspection.service';

declare var OverwolfPlugin: any;
declare var overwolf: any;

@Injectable()
export class LogParserService {
	plugin: any;

	// The start / end spectating can be set outside of game start / end, so we need to keep it separate
	spectating: boolean;

	game: Game;

	constructor(
		private gameParserService: GameParserService,
		private deckParserService: DeckParserService,
		private memoryInspectionService: MemoryInspectionService,
		private gameModeParser: GameModeParser) {
	}

	public receiveLogLine(data: string) {
		// Don't use the PowerTaskList
		if (data.indexOf('PowerTaskList') !== -1 || data.indexOf('PowerProcessor') !== -1) {
			return;
		}

		if (data.indexOf('Begin Spectating') !== -1) {
			this.spectating = true;
		}
		if (data.indexOf('End Spectator Mode') !== -1) {
			this.spectating = false;
		}

		// New game
		if (data.indexOf('CREATE_GAME') !== -1) {
			console.log('reinit game', data);
			this.game = Game.createEmptyGame();
			this.game.fullLogs = '';
			this.game.deckstring = this.deckParserService.activeDeckstring;

			this.parseMatchInfo();
			this.parseArenaInfo();
			this.parseGameType();
			this.parseGameFormat();
		}

		if (!this.game) {
			return;
		}

		this.game.fullLogs += data + '\n';

		// that's how we know a game is finished
		if (data.indexOf('GOLD_REWARD_STATE') !== -1 && this.game) {
			console.log('game ended', data);
			this.game.spectating = this.spectating;
			this.game.extractMatchInfoData();
			this.gameParserService.convertLogsToXml(this.game.fullLogs, this.game);
			this.game = undefined;
		}
	}

	private parseMatchInfo() {
		if (this.game && !this.game.matchInfo) {
			this.memoryInspectionService.getMatchInfo((matchInfo) => {
				console.log('received matchinfo callback', matchInfo);
				this.game.matchInfo = matchInfo;
			});
		}
	}

	private parseArenaInfo() {
		if (this.game && this.game.gameMode === 'Arena' && !this.game.arenaInfo) {
			this.memoryInspectionService.getArenaInfo((arenaInfo) => {
				console.log('received arenaInfo callback', arenaInfo);
				this.game.arenaInfo = arenaInfo;
			});
		}
	}

	private parseGameFormat() {
		if (this.game && !this.game.gameFormat) {
			this.memoryInspectionService.getGameFormat((gameFormat) => {
				console.log('received gameFormat callback', gameFormat);
				this.game.gameFormat = gameFormat;
			});
		}
	}

	private parseGameType() {
		if (this.game && !this.game.gameMode) {
			this.memoryInspectionService.getGameMode((gameMode) => {
				console.log('received gameMode callback', gameMode);
				this.game.gameMode = gameMode;
			});
		}
	}
}

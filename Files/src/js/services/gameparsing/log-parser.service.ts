import { Injectable } from '@angular/core';

// import * as Raven from 'raven-js';

import { GameHelper } from './game-helper.service';
import { Game } from '../../models/game';
import { GameParserService } from '../game-parser.service';
import { DeckParserService } from '../deck/deck-parser.service';
import { Events } from '../events.service';
import { GameModeParser } from '../gameparsing/game-mode-parser.service';
import { MemoryInspectionService } from '../plugins/memory-inspection.service';

declare var OverwolfPlugin: any;
declare var overwolf: any;

@Injectable()
export class LogParserService {
	plugin: any;

	// The start / end spectating can be set outside of game start / end, so we need to keep it separate
	private spectating: boolean;

	private game: Game;

	constructor(
		private gameParserService: GameParserService,
		private deckParserService: DeckParserService,
		private memoryInspectionService: MemoryInspectionService,
		private events: Events,
		private gameHelper: GameHelper,
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
		if (data.indexOf('GOLD_REWARD_STATE') !== -1 && this.game && !this.game.ended) {
			console.log('game ended', data);
			this.game.ended = true;
			this.game.deckstring = this.deckParserService.activeDeckstring;
			this.game.spectating = this.spectating;
			this.game.extractMatchInfoData();
			this.gameParserService.convertLogsToXml(this.game.fullLogs, (replayXml) => {
				console.log('received conversion response');
				if (this.game) {
					if (!replayXml) {
						console.warn('could not convert replay');
						// Raven.captureMessage('Could not convert replay', { extra: {
						// 	game: game,
						// 	stringLogs: stringLogs
						// }});
					}
					this.gameHelper.setXmlReplay(this.game, replayXml);
					this.gameParserService.extractMatchup(this.game);
					this.gameParserService.extractDuration(this.game);

					this.events.broadcast(Events.REPLAY_CREATED, JSON.stringify(this.game));
				}
				this.game = null;
				delete this.game;
			});
		}
	}

	private parseMatchInfo() {
		if (this.game && !this.game.matchInfo) {
			this.memoryInspectionService.getMatchInfo((matchInfo) => {
				this.game.matchInfo = matchInfo;
			});
		}
	}

	private parseArenaInfo() {
		if (this.game && this.game.gameMode === 'Arena' && !this.game.arenaInfo) {
			this.memoryInspectionService.getArenaInfo((arenaInfo) => {
				this.game.arenaInfo = arenaInfo;
			});
		}
	}

	private parseGameFormat() {
		if (this.game && !this.game.gameFormat) {
			this.memoryInspectionService.getGameFormat((gameFormat) => {
				this.game.gameFormat = gameFormat;
			});
		}
	}

	private parseGameType() {
		if (this.game && !this.game.gameMode) {
			this.memoryInspectionService.getGameMode((gameMode) => {
				this.game.gameMode = gameMode;
			});
		}
	}
}

import { Injectable } from '@angular/core';

import * as Raven from 'raven-js';

import { Game } from '../../models/game';
import { GameParserService } from '../game-parser.service';
import { GameModeParser } from '../gameparsing/game-mode-parser.service';

declare var OverwolfPlugin: any;
declare var overwolf: any;

@Injectable()
export class LogParserService {
	plugin: any;
	mindvisionPlugin: any;

	// The start / end spectating can be set outside of game start / end, so we need to keep it separate
	spectating: boolean;

	game: Game;
	// gameStarted: boolean;
	// gameMode: string;
	// fullLogs: string;
	// matchInfo: any;
	// gameFormat: any;

	// Events
	// gameCompleteListeners: Function[] = [];

	constructor(
		private gameParserService: GameParserService,
		private gameModeParser: GameModeParser) {

		console.log("loading mindvision");
		this.mindvisionPlugin = new OverwolfPlugin("mindvision", true);
		this.mindvisionPlugin.initialize((status: boolean) => {
			if (status === false) {
				console.warn("Plugin mindvision couldn't be loaded");
				Raven.captureMessage('mindvision plugin could not be loaded');
				return;
			}
			console.log("Plugin " + this.mindvisionPlugin.get()._PluginName_ + " was loaded!", this.mindvisionPlugin.get());
			this.mindvisionPlugin.get().onGlobalEvent.addListener(function(first, second) {
				console.log('received global event mindvision', first, second);
			});
		});
	}

	// addGameCompleteListener(listener: Function): void {
	// 	this.gameCompleteListeners.push(listener);
	// }

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
			// this.gameStarted = true;
			// this.gamegameMode = undefined;
			// this.gameFormat = undefined;
			// this.matchInfo = undefined;
		}

		if (!this.game) {
			return;
		}

		this.game.fullLogs += data + '\n';

		this.parseMatchInfo();
		this.parseArenaInfo();
		this.parseGameType();
		this.parseGameFormat();

		// that's how we know a game is finished
		if (data.indexOf('GOLD_REWARD_STATE') !== -1 && this.game) {
			console.log('game ended', data);
			// this.gameStarted = false;

			this.game.spectating = this.spectating;
			// this.game.gameMode = this.gameMode;
			// game.gameFormat = this.gameFormat;

			this.game.extractMatchInfoData();

			this.gameParserService.convertLogsToXml(this.game.fullLogs, this.game);

			this.game = undefined;
		}
	}

	private parseMatchInfo() {
		if (this.game && !this.game.matchInfo) {
			this.mindvisionPlugin.get().getMatchInfo((matchInfo) => {
				console.log('received matchinfo callback', matchInfo);
				this.game.matchInfo = matchInfo;
			});
		}
	}

	private parseArenaInfo() {
		if (this.game && this.game.gameMode === 'Arena' && !this.game.arenaInfo) {
			this.mindvisionPlugin.get().getArenaInfo((arenaInfo) => {
				console.log('received arenaInfo callback', arenaInfo);
				this.game.arenaInfo = arenaInfo;
			});
		}
	}

	private parseGameFormat() {
		if (this.game && !this.game.gameFormat) {
			this.mindvisionPlugin.get().getGameFormat((gameFormat) => {
				console.log('received gameFormat callback', gameFormat);
				this.game.gameFormat = gameFormat;
			});
		}
	}

	private parseGameType() {
		if (this.game && !this.game.gameMode) {
			this.mindvisionPlugin.get().getGameMode((gameMode) => {
				console.log('received gameMode callback', gameMode);
				this.game.gameMode = gameMode;
			});
		}
	}
}

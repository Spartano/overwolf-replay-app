import { Injectable } from '@angular/core';
import { Game } from '../models/game';
import { GameParserService } from './game-parser.service';
import { GameModeParser } from './gameparsing/game-mode-parser.service';

declare var OverwolfPlugin: any;
declare var overwolf: any;

const HEARTHSTONE_GAME_ID = 9898;

@Injectable()
export class LogListenerService {
	monitoring: boolean;
	fileInitiallyPresent: boolean;
	fullLogs: string;
	gameStarted: boolean;
	spectating: boolean;
	gameMode: string;
	logsLocation: string;
	plugin: any;

	// Events
	gameCompleteListeners: Function[] = [];

	constructor(private gameParserService: GameParserService, private gameModeParser: GameModeParser) {
		// console.log('in LogListener constructor');
		this.init();
	}

	init(): void {
		console.log('initializing LogListenerService', this.plugin);
		this.monitoring = false;
		this.gameStarted = false;
		this.fullLogs = '';
		this.fileInitiallyPresent = true;
		// this.logsLocation = 'F:\\Games\\Hearthstone\\Logs\\Power.log';

		let plugin = this.plugin = new OverwolfPlugin("simple-io-plugin-zip", true);
		console.log('plugin', plugin);
		// let that = this;

		plugin.initialize((status: boolean) => {
			if (status === false) {
				console.error("Plugin couldn't be loaded??");
				return;
			}
			console.log("Plugin " + plugin.get()._PluginName_ + " was loaded!");
			this.configureLogListeners();
		});
	}

	configureLogListeners(): void {
		// Registering game listener
		overwolf.games.onGameInfoUpdated.addListener((res: any) => {
			console.log("onGameInfoUpdated: " + JSON.stringify(res));
			if (this.gameLaunched(res)) {
				// registerEvents()
				this.logsLocation = res.gameInfo.executionPath.split('Hearthstone.exe')[0] + 'Logs\\Power.log';
				console.log('getting logs from', this.logsLocation);
				this.registerLogMonitor();
			}
			else if (this.exitGame(res)) {
				this.closeWindow();
			}
		});

		overwolf.games.getRunningGameInfo((res: any) => {
			console.log("getRunningGameInfo: " + JSON.stringify(res));
			if (res && res.isRunning && res.id && Math.floor(res.id / 10) === HEARTHSTONE_GAME_ID) {
				console.log('running!', res);
				this.logsLocation = res.executionPath.split('Hearthstone.exe')[0] + 'Logs\\Power.log';
				console.log('getting logs from', this.logsLocation);
				// registerEvents()
				this.registerLogMonitor();
			}
		});
	}

	// This whole game running info mechanism should be externalized to another script
	closeWindow() {
		overwolf.windows.getCurrentWindow((result) => {
			if (result.status === "success") {
				console.log('closing');
				overwolf.windows.close(result.window.id);
			}
		});
	}

	addGameCompleteListener(listener: Function): void {
		this.gameCompleteListeners.push(listener);
	}

	// addInitCompleteListener(listener: Function): void {
	// 	this.initCompleteListeners.push(listener);
	// }

	registerLogMonitor() {
		console.log('registering hooks?', this.plugin.get(), this.monitoring, this);
		console.log('listeners', this.plugin.get().onFileListenerChanged);
		if (this.monitoring) {
			console.log('log hooks already registered, returning');
			return;
		}

		// let logItemIndex = 0;
		this.listenOnFile(this.logsLocation);

		this.monitoring = true;

		// We have no way today to know when the initial game log has been parsed,
		// since parsing is asynchronous
		// We might be able to do a first read on the file to know how many games are 
		// in it, then remove these games, but we'd still have to know when all the games
		// are parsed
		// Here we take a pretty safe assumption that:
		// - games are parsed in less than 10s
		// - no game is completed 10s after HS is initially launched
		// setTimeout(() => {
		// 	for (let initListener of this.initCompleteListeners) {
		// 		initListener();
		// 	}
		// }, 10000);
	}

	listenOnFile(logsLocation: string): void {
		this.listenOnFileCreation(logsLocation);
	}

	listenOnFileCreation(logsLocation: string): void {
		console.log('starting to listen on file', logsLocation);
		// let that = this;

		this.plugin.get().fileExists(logsLocation, (status: boolean) => {
			if (status === true) {
				this.listenOnFileUpdate(logsLocation);
			}
			else {
				this.fileInitiallyPresent = false;
				setTimeout( () => { this.listenOnFileCreation(logsLocation); }, 1000);
			}
		});
	}

	listenOnFileUpdate(logsLocation: string): void {
		let fileIdentifier = "hs-logs-file";
		console.log('listening on file update', logsLocation);

		// Register file listener
		let handler = (id: any, status: any, data: string) => {

			if (!status) {
				if (data === 'truncated') {
					this.plugin.get().stopFileListen(fileIdentifier);
					this.plugin.get().onFileListenerChanged.removeListener(handler);
					this.fileInitiallyPresent = false;
					console.log('truncated log file - HS probably just overwrote the file. Retrying', status, data);
					this.listenOnFileUpdate(logsLocation);
				}
				else {
					console.error("received an error on file: " + id + ": " + data);
				}
				return;
			}

			if (id === fileIdentifier) {
				// Don't use the PowerTaskList
				if (data.indexOf('PowerTaskList') !== -1 || data.indexOf('PowerProcessor') !== -1) {
					// if (data.indexOf('CREATE_GAME') !== -1) {
					// 	console.debug('Received unsupported start', data);
					// }
					// if (data.indexOf('GOLD_REWARD_STATE') !== -1) {
					// 	console.debug('Received unsupported end', data);
					// }
					return;
				}

				if (data.indexOf('Begin Spectating') !== -1) {
					this.spectating = true;
				}
				if (data.indexOf('End Spectator Mode') !== -1) {
					this.spectating = false;
				}

				this.gameMode = this.gameModeParser.inferGameMode(this.gameMode, data);
				// console.log('file changed', data, id, fileIdentifier, status);
				// console.log('file listening callback', fieldId, status, data)
				// New game
				if (data.indexOf('CREATE_GAME') !== -1) {
					console.debug('reinit game', data);
					this.fullLogs = '';
					this.gameStarted = true;
					this.gameMode = undefined;
				}
				this.fullLogs += data + '\n';

				// that's how we know a game is finished
				if (data.indexOf('GOLD_REWARD_STATE') !== -1 && this.gameStarted) {
					console.debug('game ended', data);
					let game = Game.createEmptyGame();
					this.gameStarted = false;

					game.spectating = this.spectating;
					game.gameMode = this.gameMode;

					this.gameParserService.convertLogsToXml(this.fullLogs, game, this.gameCompleteListeners);

					this.fullLogs = '';
					// this.spectating = false;
				}
			}
			else {
				console.error('could not listen to file callback');
			}
		};
		this.plugin.get().onFileListenerChanged.addListener(handler);

		this.plugin.get().listenOnFile(fileIdentifier, logsLocation, this.fileInitiallyPresent, (id: string, status: boolean, initData: any) => {
		// this.plugin.get().listenOnFile(fileIdentifier, logsLocation, false, (id: string, status: boolean, initData: any) => {
			if (id === fileIdentifier) {
				if (status) {
					console.log("[" + id + "] now streaming...", this.fileInitiallyPresent);
				}
				else {
					console.log("something bad happened with: " + id);
				}
			}
		});
	}

	exitGame(gameInfoResult: any): boolean {
		return (!gameInfoResult || !gameInfoResult.gameInfo || !gameInfoResult.gameInfo.isRunning);
	}

	gameLaunched(gameInfoResult: any): boolean {
		if (!gameInfoResult) {
			console.log('No gameInfoResult, returning');
			return false;
		}

		if (!gameInfoResult.gameInfo) {
			console.log('No gameInfoResult.gameInfo, returning');
			return false;
		}

		// if (!gameInfoResult.runningChanged && !gameInfoResult.gameChanged) {
		// 	console.log('Running didnt change, returning');
		// 	return false;
		// }

		if (!gameInfoResult.gameInfo.isRunning) {
			console.log('Game not running, returning');
			return false;
		}

		// NOTE: we divide by 10 to get the game class id without it's sequence number
		if (Math.floor(gameInfoResult.gameInfo.id / 10) !== HEARTHSTONE_GAME_ID) {
			console.log('Not HS, returning');
			return false;
		}

		console.log("HS Launched");
		return true;
	}

	gameRunning(gameInfo: any): boolean {

		if (!gameInfo) {
			return false;
		}

		if (!gameInfo.isRunning) {
			return false;
		}

		// NOTE: we divide by 10 to get the game class id without it's sequence number
		if (Math.floor(gameInfo.id / 10) !== HEARTHSTONE_GAME_ID) {
			return false;
		}

		console.log("HS running");
		return true;
	}
}

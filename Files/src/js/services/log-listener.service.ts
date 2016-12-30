import { Injectable } from '@angular/core';
import { Game } from '../models/game';
import { GameParserService } from './game-parser.service';

declare var OverwolfPlugin: any;
declare var overwolf: any;

const HEARTHSTONE_GAME_ID = 9898;

@Injectable()
export class LogListenerService {
	monitoring: boolean;
	fullLogs: string;
	gameStarted: boolean;
	// gameStartDate: Date;
	// games: Game[] = [];
	gameCompleteListeners: Function[] = [];
	// TODO: deduce this from the game's running path
	logsLocation: string;
	plugin: any;

	constructor(private gameParserService: GameParserService) {
		// console.log('in LogListener constructor');
		this.init();
	}

	init(): void {
		console.log('initializing LogListenerService', this.plugin);
		this.monitoring = false;
		this.gameStarted = false;
		this.fullLogs = '';
		// this.logsLocation = 'F:\\Games\\Hearthstone\\Logs\\Power.log';

		let plugin = this.plugin = new OverwolfPlugin("simple-io-plugin", true);
		console.log('plugin', plugin);
		let that = this;

		plugin.initialize((status: boolean) => {
			if (status === false) {
				console.error("Plugin couldn't be loaded??");
				return;
			}
			console.log("Plugin " + plugin.get()._PluginName_ + " was loaded!");

			// Registering game listener
			overwolf.games.onGameInfoUpdated.addListener((res: any) => {
				console.log("onGameInfoUpdated: " + JSON.stringify(res));
				if (that.gameLaunched(res)) {
					// registerEvents()
					that.logsLocation = res.gameInfo.executionPath.split('Hearthstone.exe')[0] + 'Logs\\Power.log';
					console.log('getting logs from', that.logsLocation);
					that.registerLogMonitor();
				}
				else if (this.exitGame(res)) {
					this.closeWindow(); 
				}
			});

			overwolf.games.getRunningGameInfo(function (res: any) {
				console.log("getRunningGameInfo: " + JSON.stringify(res));
				if (res && res.isRunning && res.id && Math.floor(res.id / 10) === HEARTHSTONE_GAME_ID) {
					console.log('running!', res);
					that.logsLocation = res.executionPath.split('Hearthstone.exe')[0] + 'Logs\\Power.log';
					console.log('getting logs from', that.logsLocation);
					// registerEvents()
					that.registerLogMonitor();
				}
			});
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

	registerLogMonitor(): void {
		if (this.monitoring) {
			console.log('log hooks already registered, returning');
			return;
		}
		console.log('registering hooks');

		// let logItemIndex = 0;
		this.listenOnFile(this.logsLocation);

		this.monitoring = true;
	}

	listenOnFile(logsLocation: string): void {
		console.log('starting to listen on file', logsLocation);

		this.listenOnFileCreation(logsLocation);
	}

	listenOnFileCreation(logsLocation: string): void {
		let that = this;

		this.plugin.get().fileExists(logsLocation, function(status: boolean) {
			if (status === true) {
				that.listenOnFileUpdate(logsLocation);
			}
			else {
				setTimeout( function() { that.listenOnFileCreation(logsLocation); }, 1000);
			}
		});
	}

	listenOnFileUpdate(logsLocation: string): void {
		let fileIdentifier = "hs-logs-file";
		let that = this;

		// Register file listener
		this.plugin.get().onFileListenerChanged.addListener(function(id: any, status: any, data: string) {

			if (!status) {
				console.error("received an error on file: " + id + ": " + data);
				return;
			}

			if (id === fileIdentifier) {
				// Don't use the PowerTaskList
				if (data.indexOf('PowerTaskList') !== -1 || data.indexOf('PowerProcessor') !== -1) {
					return;
				}
				// console.log('file listening callback', fieldId, status, data)
				// New game
				if (data.indexOf('CREATE_GAME') !== -1) {
					console.log('reinit game');
					that.fullLogs = '';
					that.gameStarted = true;
				}
				that.fullLogs += data + '\n';

				// that's how we know a game is finished
				if (data.indexOf('GOLD_REWARD_STATE') !== -1 && that.gameStarted) {
					console.log('game ended');
					that.gameStarted = false;

					let game = new Game();
					// Will be synchronous later on
					that.gameParserService.convertLogsToXml(that.fullLogs, game, that.gameCompleteListeners);

					that.fullLogs = '';
				}
			}
			else {
				console.error('could not listen to file callback');
			}
		});

		this.plugin.get().listenOnFile(fileIdentifier, logsLocation, false, function(id: string, status: boolean, initData: any) {
			if (id === fileIdentifier) {
				if (status) {
					console.log("[" + id + "] now streaming...");
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
			return false;
		}

		if (!gameInfoResult.gameInfo) {
			return false;
		}

		if (!gameInfoResult.runningChanged && !gameInfoResult.gameChanged) {
			return false;
		}

		if (!gameInfoResult.gameInfo.isRunning) {
			return false;
		}

		// NOTE: we divide by 10 to get the game class id without it's sequence number
		if (Math.floor(gameInfoResult.gameInfo.id / 10) !== HEARTHSTONE_GAME_ID) {
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

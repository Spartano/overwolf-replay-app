import { Injectable } from '@angular/core';

// import * as Raven from 'raven-js';

import { Game } from '../models/game';
import { SimpleIOService } from './plugins/simple-io.service';
import { GameEvents } from './game-events.service';
import { GameModeParser } from './gameparsing/game-mode-parser.service';

declare var OverwolfPlugin: any;
declare var overwolf: any;

const HEARTHSTONE_GAME_ID = 9898;

const LOG_FILE = "Power.log";
const prod = true;

@Injectable()
export class LogListenerService {
	monitoring: boolean;
	fileInitiallyPresent = true;
	logsLocation: string;
	startTime: number;

	constructor(
		private gameModeParser: GameModeParser,
		private gameEvents: GameEvents,
		private plugin: SimpleIOService) {

		this.monitoring = false;
		// this.fileInitiallyPresent = true;
		this.startTime = Date.now();
		this.configureLogListeners();
	}

	configureLogListeners(): void {
		// Registering game listener
		overwolf.games.onGameInfoUpdated.addListener((res: any) => {
			// console.log("onGameInfoUpdated: " + JSON.stringify(res));
			if (this.gameLaunched(res)) {
				this.logsLocation = res.gameInfo.executionPath.split('Hearthstone.exe')[0] + 'Logs\\' + LOG_FILE;
				this.registerLogMonitor();
			}
			else if (this.exitGame(res)) {
				this.closeWindow();
			}
		});

		overwolf.games.getRunningGameInfo((res: any) => {
			if (res && res.isRunning && res.id && Math.floor(res.id / 10) === HEARTHSTONE_GAME_ID) {
				// console.log('Game is running!', JSON.stringify(res));
				this.logsLocation = res.executionPath.split('Hearthstone.exe')[0] + 'Logs\\' + LOG_FILE;
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

	registerLogMonitor() {
		if (this.monitoring) {
			// console.log('\tlog hooks already registered, returning');
			return;
		}
		console.log('registering hooks');
		this.monitoring = true;

		console.log('getting logs from', this.logsLocation);
		this.listenOnFile(this.logsLocation);
	}

	listenOnFile(logsLocation: string): void {
		// Sentry raises a stack trace too big without this
		setTimeout(() => {
			console.log('starting to listen on file', logsLocation);
			this.listenOnFileCreation(logsLocation);
		}, 1000)
	}

	listenOnFileCreation(logsLocation: string): void {
		this.plugin.get().fileExists(logsLocation, (status: boolean, message: string) => {
			if (status === true) {
				console.log('Power.log file exists', status, message);
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
					console.info('truncated Power.log file - HS probably just overwrote the file. Going forward');
				}
				else {
					console.error("received an error on file: " + id + ": " + data);
				}
				return;
			}

			if (id === fileIdentifier) {
				this.gameEvents.receiveLogLine(data);
			}
			else {
				// This happens frequently when listening to several files at the same time, don't do anything about it
			}
		};
		this.plugin.get().onFileListenerChanged.addListener(handler);

		this.plugin.get().listenOnFile(fileIdentifier, logsLocation, this.fileInitiallyPresent, (id: string, status: boolean, initData: any) => {
			if (id === fileIdentifier) {
				if (status) {
					console.log("[" + id + "] now streaming...");
				}
				else {
					console.error("something bad happened with: " + id);
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

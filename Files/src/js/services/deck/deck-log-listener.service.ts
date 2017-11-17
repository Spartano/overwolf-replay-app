import { Injectable } from '@angular/core';

// import * as Raven from 'raven-js';

import {DeckParserService} from './deck-parser.service'

declare var OverwolfPlugin: any;
declare var overwolf: any;

const HEARTHSTONE_GAME_ID = 9898;

@Injectable()
export class DeckLogListenerService {
	plugin: any;

	monitoring: boolean;
	logsLocation: string;

	constructor(private deckParserService: DeckParserService) {
		this.init();
	}

	init(): void {
		console.log('initializing DeckLogListenerService', this.plugin);
		this.monitoring = false;

		let plugin = this.plugin = new OverwolfPlugin("simple-io-plugin-zip", true);
		console.log('plugin', plugin);

		plugin.initialize((status: boolean) => {
			if (status === false) {
				console.warn("Plugin couldn't be loaded??", status);
				// Raven.captureMessage('simple-io-plugin could not be loaded');
				return;
			}
			console.log("Plugin " + plugin.get()._PluginName_ + " was loaded!");
			this.configureLogListeners();
		});
	}

	configureLogListeners(): void {
		// Registering game listener
		overwolf.games.onGameInfoUpdated.addListener((res: any) => {
			// console.log("onGameInfoUpdated: " + JSON.stringify(res));
			if (this.gameLaunched(res)) {
				this.logsLocation = res.gameInfo.executionPath.split('Hearthstone.exe')[0] + 'Logs\\FullScreenFX.log';
				this.registerLogMonitor();
			}
		});

		overwolf.games.getRunningGameInfo((res: any) => {
			if (res && res.isRunning && res.id && Math.floor(res.id / 10) === HEARTHSTONE_GAME_ID) {
				console.log('Game is running!', JSON.stringify(res));
				this.logsLocation = res.executionPath.split('Hearthstone.exe')[0] + 'Logs\\FullScreenFX.log';
				this.registerLogMonitor();
			}
		});
	}

	registerLogMonitor() {
		console.log('registering hooks?', this.monitoring);
		if (this.monitoring) {
			console.log('\tlog hooks already registered, returning');
			return;
		}
		this.monitoring = true;

		console.log('getting logs from', this.logsLocation);
		this.listenOnFile(this.logsLocation);
	}

	listenOnFile(logsLocation: string): void {
		// Sentry raises a stack trace too big exception without this
		setTimeout(() => {
			this.listenOnFileCreation(logsLocation);
		}, 1000)
	}

	listenOnFileCreation(logsLocation: string): void {
		console.log('starting to listen on file', logsLocation);

		this.plugin.get().fileExists(logsLocation, (status: boolean, message: string) => {
			console.log('fileExists?', status, message);
			if (status === true) {
				this.listenOnFileUpdate(logsLocation);
			}
			else {
				setTimeout( () => { this.listenOnFileCreation(logsLocation); }, 1000);
			}
		});
	}

	listenOnFileUpdate(logsLocation: string): void {
		let fileIdentifier = "hs-fullscreenfx-file";
		console.log('listening on file update', logsLocation);

		// Register file listener
		let handler = (id: any, status: any, data: string) => {

			if (!status) {
				if (data === 'truncated') {
					this.plugin.get().stopFileListen(fileIdentifier);
					this.plugin.get().onFileListenerChanged.removeListener(handler);
					console.log('truncated log file - HS probably just overwrote the file. Retrying', status, data);
					this.listenOnFileUpdate(logsLocation);
				}
				else {
					console.warn("received an error on file: " + id + ": " + data);
					// Raven.captureMessage('Error while trying to read log file', { extra: {
					// 	id: id,
					// 	data: data,
					// 	status: status,
					// 	path: logsLocation
					// }});
				}
				return;
			}

			if (id === fileIdentifier) {
				// We don't really care what the content of the log is. An update to the log file just tells us
				// that we're going to or leaving from the deck selection screen, which means we can try and
				// detect the selected deck
				console.log('Received line in DeckLogListener: ', data)
				this.deckParserService.detectActiveDeck();
			}
			else {
				// This happens frequently when listening to several files at the same time, don't do anything about it
			}
		};
		this.plugin.get().onFileListenerChanged.addListener(handler);

		this.plugin.get().listenOnFile(fileIdentifier, logsLocation, true, (id: string, status: boolean, initData: any) => {
		// this.plugin.get().listenOnFile(fileIdentifier, logsLocation, false, (id: string, status: boolean, initData: any) => {
			if (id === fileIdentifier) {
				if (status) {
					console.log("[" + id + "] now streaming...");
				}
				else {
					console.warn("something bad happened with: " + id);
					// Raven.captureMessage('listenOnFile returned wrong id', { extra: {
					// 	id: id,
					// 	fileIdentifier: fileIdentifier,
					// 	initData: initData,
					// 	path: logsLocation
					// }});
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
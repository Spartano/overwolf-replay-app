import { Injectable } from '@angular/core';

// import * as Raven from 'raven-js';

import { Game } from '../models/game';
import { Events } from './events.service';
import { GameStorageService } from './game-storage.service';

declare var OverwolfPlugin: any;
declare var overwolf: any;
declare var JSZip: any;
declare var saveAs: any;

@Injectable()
export class ReplayManager {

	plugin: any;

	constructor(private events: Events, private gameStorage: GameStorageService) {
		this.init();
	}

	public saveLocally(game: Game) {
		let directory = this.plugin.get().LOCALAPPDATA + '/Overwolf/ZeroToHeroes/Replays/';
		let fileName = game.player.name + '(' + game.player.class + ')_vs_' + game.opponent.name + '(' + game.opponent.class + ')_' + new Date().getTime() + '.hszip';
		console.log('saving locally', directory + fileName);
		this.plugin.get().writeLocalAppDataZipFile(directory + fileName, "replay.xml", game.replay, (status, message) => {
			console.log('local zip file saved', status, message);
			game.path = directory + fileName;

			this.plugin.get().getBinaryFile(game.path, -1, (status, data) => {
				console.log('reading binary file before storing it in localstorage', game.path, status);
				let split = data.split(',');
				let bytes = [];
				for (let i = 0; i < split.length; i++) {
					bytes[i] = parseInt(split[i]);
				}
				// console.log('built byte array', bytes);

				game.replayBytes = bytes;

				overwolf.games.getRunningGameInfo((res: any) => {
					console.log("getRunningGameInfo to save game: " + JSON.stringify(res));
					if (res && res.sessionId) {
						console.log('adding replay');
						game.fullLogs = null;
						this.gameStorage.addGame(res.sessionId, game);
						this.events.broadcast(Events.REPLAY_SAVED, directory + fileName, game);
						console.log('replay saved');
					}
				});
			});

		});
	}

	private init() {
		this.plugin = new OverwolfPlugin("simple-io-plugin-zip", true);

		this.plugin.initialize((status: boolean) => {
			if (status === false) {
				console.warn("Plugin couldn't be loaded??");
				// Raven.captureMessage('simple-io-plugin could not be loaded');
				return;
			}
			console.log("Plugin " + this.plugin.get()._PluginName_ + " was loaded!", this.plugin.get());

			this.plugin.get().onOutputDebugString.addListener(function(first, second, third) {
				console.log('received global event', first, second, third);
			});
		});
	}
}

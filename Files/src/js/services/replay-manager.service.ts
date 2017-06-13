import { Injectable } from '@angular/core';
import { Game } from '../models/game';
import { Events } from './events.service';

declare var OverwolfPlugin: any;
declare var overwolf: any;
declare var JSZip: any;
declare var saveAs: any;

@Injectable()
export class ReplayManager {

	plugin: any;

	constructor(private events: Events) {
		this.init();
	}

	public saveLocally(game: Game) {
		let directory = this.plugin.get().LOCALAPPDATA + '/Overwolf/ZeroToHeroes/Replays/';
		let fileName = game.player.name + '(' + game.player.class + ')_vs_' + game.opponent.name + '(' + game.opponent.class + ')_' + new Date().getTime() + '.hszip';
		console.log('saving locally', directory + fileName);
		this.plugin.get().writeLocalAppDataZipFile(directory + fileName, "replay.xml", game.replay, (status, message) => {
			console.log('local zip file saved', status, message);
			// this.events.broadcast(Events.REPLAY_SAVED, directory + fileName, game);
		});
	}

	private init() {
		this.plugin = new OverwolfPlugin("simple-io-plugin-zip", true);

		this.plugin.initialize((status: boolean) => {
			if (status === false) {
				console.error("Plugin couldn't be loaded??");
				return;
			}
			console.log("Plugin " + this.plugin.get()._PluginName_ + " was loaded!", this.plugin.get());

			this.plugin.get().onOutputDebugString.addListener(function(first, second, third) {
				console.log('received global event', first, second, third);
			});
		});
	}
}

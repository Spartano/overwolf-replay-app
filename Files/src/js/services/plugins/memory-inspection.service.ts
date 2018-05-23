import { Injectable } from '@angular/core';

// import * as Raven from 'raven-js';

import { encode } from 'deckstrings';

import { Deck, Card } from '../../models/deck';

declare var OverwolfPlugin: any;
declare var overwolf: any;
declare var parseCardsText: any;

@Injectable()
export class MemoryInspectionService {
	mindvisionPlugin: any;

	constructor() {
		console.log("loading mindvision");
		// this.mindvisionPlugin = new OverwolfPlugin("mindvision", true);
		// this.mindvisionPlugin.initialize((status: boolean) => {
		// 	if (status === false) {
		// 		console.warn("Plugin mindvision couldn't be loaded");
		// 		// Raven.captureMessage('mindvision plugin could not be loaded');
		// 		return;
		// 	}
		// 	console.log("Plugin " + this.mindvisionPlugin.get()._PluginName_ + " was loaded!");
		// 	this.mindvisionPlugin.get().onGlobalEvent.addListener(function(first, second) {
		// 		console.log('received global event mindvision', first, second);
		// 	});
		// });
	}

	public getActiveDeck(callback) {
		console.log('Getting active deck from memory - no-op');
		// this.mindvisionPlugin.get().getActiveDeck((activeDeck) => {
		// 	console.log('activeDeck', activeDeck);
		// 	callback(activeDeck);
		// });
	}

	public getMatchInfo(callback) {
		console.log('Getting match info from memory - no-op');
		// this.mindvisionPlugin.get().getMatchInfo((matchInfo) => {
		// 	console.log('received matchinfo callback', matchInfo);
		// 	callback(matchInfo);
		// });
	}

	public getArenaInfo(callback) {
		console.log('Getting arena info from memory - no-op');
		// this.mindvisionPlugin.get().getArenaInfo((arenaInfo) => {
		// 	console.log('received arenaInfo callback', arenaInfo);
		// 	let jsonArenaInfo = arenaInfo ? JSON.parse(arenaInfo) : arenaInfo;
		// 	callback(jsonArenaInfo);
		// });
	}

	public getGameFormat(callback) {
		console.log('Getting game format from memory - no-op');
		// this.mindvisionPlugin.get().getGameFormat((gameFormat) => {
		// 	console.log('received gameFormat callback', gameFormat);
		// 	callback(gameFormat);
		// });
	}

	public getGameMode(callback) {
		console.log('Getting game mode from memory - no-op');
		// this.mindvisionPlugin.get().getGameMode((gameMode) => {
		// 	console.log('received gameMode callback', gameMode);
		// 	this.mindvisionPlugin.get().getMatchInfo((matchInfo) => {
		// 		if (matchInfo
		// 				&& matchInfo.OpposingPlayer
		// 				&& matchInfo.OpposingPlayer.CardId
		// 				&& matchInfo.OpposingPlayer.CardId.startsWith('LOOTA_BOSS')) {
		// 			console.log('overriding with dungeon-run');
		// 			callback('dungeon-run');
		// 		}
		// 		else {
		// 			console.log('setting match info to ', gameMode);
		// 			callback(gameMode);
		// 		}
		// 	});
		// });
	}
}

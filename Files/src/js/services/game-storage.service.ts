import { Injectable } from '@angular/core';

import { StorageHelperService } from '../services/storage-helper.service';

import { Session } from '../models/storage';
import { Game } from '../models/game';
import { Events } from './events.service';

@Injectable()
export class GameStorageService {

	constructor(
		private events: Events,
		private storageHelper: StorageHelperService) {
	}

	addGame(sessionId: string, game: Game): void {
		// Get the games from the local storage
		let session = this.storageHelper.getSession(sessionId);
		console.log('retrieved session', session);
		let games = session.games;

		games.push(game);
		console.log('added game', games);
		this.storageHelper.update(session);
		console.log('game added');
	}

	updateGame(sessionId: string, game: Game) {
		console.log('starting game update', game);
		let session = this.storageHelper.getSession(sessionId);
		let games = session.games;

		let newGames: Game[] = [];
		for (let currentGame of games) {
			if (currentGame.id === game.id) {
				newGames.push(game);
			}
			else {
				newGames.push(currentGame);
			}
		}
		session.games = newGames;
		this.storageHelper.update(session);
		console.log('updated games', newGames);
	}
}

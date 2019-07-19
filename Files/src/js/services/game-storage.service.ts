import { Injectable } from '@angular/core';

import { StorageHelperService } from '../services/storage-helper.service';

import { Game } from '../models/game';

@Injectable()
export class GameStorageService {

	constructor(private storageHelper: StorageHelperService) {
		console.log('starting debug service');
	}


	addGame(sessionId: string, game: Game, callback: Function) {
		// Get the games from the local storage
		this.storageHelper.getSession(sessionId, (session) => {
			const games = session.games;
			console.log('retrieved session', session.id, session.games.length);

			games.push(game);
			this.storageHelper.update(session, (updated) => {
				callback(updated);
			});
		});
	}

	updateGame(sessionId: string, game: Game) {
		console.log('starting game update');
		this.storageHelper.getSession(sessionId, (session) => {
			const games = session.games;

			const newGames: Game[] = [];
			for (const currentGame of games) {
				if (currentGame.id === game.id) {
					newGames.push(game);
				} else {
					newGames.push(currentGame);
				}
			}
			session.games = newGames;
			this.storageHelper.update(session, (updated) => {
				console.log('updated games', updated.id, updated.games.length);
			});
		});
	}
}

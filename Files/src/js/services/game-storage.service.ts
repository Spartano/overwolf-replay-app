import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

import { Game } from '../models/game';
import { Events } from './events.service';

@Injectable()
export class GameStorageService {

	constructor(private events: Events, private localStorageService: LocalStorageService) {
		this.init();
	}

	init(): void {
		// this.events.on(Events.REPLAY_CREATED)
		// 	.subscribe(event => {
		// 		this.addGame(event.data[0]);
		// 	});
	}

	public resetGames(): void {
		// Get the games from the local storage
		console.log('resetting games');
		this.localStorageService.set('games', <Game[]>[]);
	}

	addGame(game: Game): void {
		// Get the games from the local storage
		// console.log('adding game to local storage', game);
		let games: Game[] = this.localStorageService.get<Game[]>('games') || [];
		games.push(game);
		this.localStorageService.set('games', games);
		console.log('after adding game', this.localStorageService.get<Game[]>('games'));
	}

	updateGame(game: Game) {
		console.log('starting game update', game);
		let games: Game[] = this.localStorageService.get<Game[]>('games') || [];
		let newGames: Game[] = [];
		for (let currentGame of games) {
			if (currentGame.id === game.id) {
				newGames.push(game);
			}
			else {
				newGames.push(currentGame);
			}
		}
		this.localStorageService.set('games', newGames);
		console.log('updated games', newGames);
	}
}

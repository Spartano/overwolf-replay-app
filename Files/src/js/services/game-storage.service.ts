import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

import { Game } from '../models/game';
import { LogListenerService } from './log-listener.service';

@Injectable()
export class GameStorageService {

	// games: Game[] = [];
	// subject:Subject<Game> = new Subject<Game>();

	constructor(private logListenerService: LogListenerService, private localStorageService: LocalStorageService) {
		// console.log('in GameStorageService constructor');
		this.init();
	}

	init(): void {
		// console.log('init gameservice', this.localStorageService.get<Game[]>('games'));
		this.localStorageService.clearAll('.*');
		// console.log('after init', this.localStorageService.get<Game[]>('games'));

		this.logListenerService.addGameCompleteListener((game: Game) => {
			// console.log('game complete', game);
			this.addGame(game);
			// this.games.push(game);
		});

		// this.logListenerService.addInitCompleteListener(() => {
		// 	this.resetGames();
		// });
	}

	resetGames(): void {
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
		// console.log('after adding game', this.localStorageService.get<Game[]>('games'));
		// this.subject.next(game);
	}

	// getGames():Observable<Game> {
	// 	return this.subject.asObservable();
	// }

	// getGames():Game[] {
	// 	return this.localStorageService.get<Game[]>('games') || [];
	// }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { Game } from '../model/game';

@Injectable()
export class GameService {

	// @Input()
	games: Game[] = [];

	subject:Subject<Game> = new Subject<Game>();

	constructor() {
		console.log('in mock GameService constructor');
		this.init();
	}

	init():void {
		setTimeout(() => {
			for (let i = 0; i < 11; i++) {
				let game = new Game();
				game.result = i % 2 == 0 ? "won" : "lost";
				game.player.name = "Player";
				game.player.class = "warrior";
				game.player.hero = "HERO_01";
				game.opponent.name = "Opponent";
				game.opponent.class = "mage";
				game.opponent.hero = "HERO_08a";
				game.title = game.player.name + i + " Vs. " + game.opponent.name;
				this.games.push(game);
				this.subject.next(game);
			}
		}, 2000);
	}

	getGames():Observable<Game> {
		return this.subject.asObservable();
	}

	// getGames():Game[] {
	// 	return this.games;
	// }
}
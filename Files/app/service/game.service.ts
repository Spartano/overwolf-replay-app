import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { Game } from '../model/game';
import { LogListenerService } from './log-listener.service';

@Injectable()
export class GameService {

	// @Input()
	games: Game[] = [];

	subject:Subject<Game> = new Subject<Game>();

	constructor(private logListenerService:LogListenerService) {
		// console.log('in GameService constructor');
		this.init();
	}

	init():void {
		// console.log('init gameservice')
		this.logListenerService.addGameCompleteListener((game:Game) => {
			// console.log('game complete', game);
			this.games.push(game);
			this.subject.next(game);
		})
	}

	getGames():Observable<Game> {
		return this.subject.asObservable();
	}

	// getGames():Game[] {
	// 	return this.games;
	// }
}
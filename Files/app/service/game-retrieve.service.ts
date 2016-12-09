import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from 'angular-2-local-storage'; 

import { Game } from '../model/game';
// import { LogListenerService } from './log-listener.service';

@Injectable()
export class GameRetrieveService {

	// games: Game[] = [];
	// subject:Subject<Game> = new Subject<Game>();

	constructor(private localStorageService:LocalStorageService) {
		console.log('in GameRetrieveService constructor');
	}

	// getGames():Observable<Game> {
	// 	return this.subject.asObservable();
	// }

	getGames():Game[] {
		return this.localStorageService.get<Game[]>('games') || [];
	}
}
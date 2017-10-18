import { Injectable } from '@angular/core';

import { StorageHelperService } from './storage-helper.service';

import { Session } from '../models/storage';
import { Game } from '../models/game';

declare var overwolf: any;

@Injectable()
export class GameRetrieveService {

	constructor(private storageHelper: StorageHelperService) {
	}

	getGames(sessionId: string, callback: Function) {
		if (!sessionId) {
			sessionId = this.storageHelper.getLatestSessionId();
		}
		console.log('retrieving games from session', sessionId);
		let session = this.storageHelper.getSession(sessionId, (session) => {
			callback(session.games);
		});
	}
}

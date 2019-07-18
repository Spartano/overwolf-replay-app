import { Injectable } from '@angular/core';

import { StorageHelperService } from './storage-helper.service';
import { Game } from '../models/game';

@Injectable()
export class GameRetrieveService {

	constructor(private storageHelper: StorageHelperService) {
	}

	async getGames(sessionId: string): Promise<Game[]> {
		return new Promise<Game[]>((resolve) => {
            if (!sessionId) {
                sessionId = this.storageHelper.getLatestSessionId();
            }
            console.log('retrieving games from session', sessionId);
            this.storageHelper.getSession(sessionId, (session) => {
                resolve(session.games);
            });
        });
	}
}

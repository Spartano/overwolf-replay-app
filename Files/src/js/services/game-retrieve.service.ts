import { Injectable } from '@angular/core';

import { StorageHelperService } from './storage-helper.service';

import { Session } from '../models/storage';
import { Game } from '../models/game';

declare var overwolf: any;

@Injectable()
export class GameRetrieveService {

	constructor(private storageHelper: StorageHelperService) {
	}

	getGames(sessionId: string): Game[] {
		let session = this.storageHelper.getSession(sessionId);
		return session.games;
	}
}

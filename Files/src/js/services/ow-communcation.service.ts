import { Injectable } from '@angular/core';
import { Events } from './events.service';
import { Game } from '../models/game';

import { StorageHelperService } from '../services/storage-helper.service';
import { FileUploadService } from './file-upload.service';
import { UserPreferences } from './user-preferences.service';

declare var overwolf: any;

@Injectable()
export class OwCommunicationService {

	constructor(
		private events: Events,
		private storageHelper: StorageHelperService) {

		this.init();
	}

	private init() {
		this.events.on(Events.REPLAY_SAVED)
			.subscribe(event => {
				this.sendMatchCountInfo();
			});

		// We need to send a first info for the EGS to be displayed the first time
		// this.sendMatchCountInfo();
	}

	private sendMatchCountInfo() {
		overwolf.games.getRunningGameInfo((res: any) => {
			console.log("getRunningGameInfo to send matchcount info: " + JSON.stringify(res));
			if (res && res.sessionId) {
				this.storageHelper.getSession(res.sessionId, (currentSession) => {
					let info = { matchCount: currentSession.games.length, sessionId: currentSession.id };
					console.log('setting info', info);
					overwolf.extensions.setInfo(info);
				});
			}
		});

	}
}

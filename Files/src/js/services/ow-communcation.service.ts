import { Injectable } from '@angular/core';
import { Events } from './events.service';

import { StorageHelperService } from '../services/storage-helper.service';
import { OverwolfService } from './overwolf.service';

@Injectable()
export class OwCommunicationService {

	constructor(private events: Events, private storageHelper: StorageHelperService, private ow: OverwolfService) {
		console.log('starting ow communication service');
		this.init();
	}

	private init() {
		this.events.on(Events.REPLAY_CREATED).subscribe(event => this.sendMatchCountInfo());
		this.ow.addSessionInfoChangedLisetner((data) => console.warn('session info changed', data));
	}

	private async sendMatchCountInfo() {
		// const sessionId = await this.ow.getCurrentSessionId();
		const res = await this.ow.getRunningGameInfo();
		// console.log("getRunningGameInfo to send matchcount info: " + JSON.stringify(res));
		if (res && res.sessionId) {
			this.storageHelper.getSession(res.sessionId, (currentSession) => {
				const info = { matchCount: currentSession.games.length + 1, sessionId: currentSession.id };
				console.log('setting info', info);
				this.ow.setExtensionInfo(info);
			});
		}
	}
}

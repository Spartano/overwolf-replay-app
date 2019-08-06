import { Injectable } from '@angular/core';
import { Events } from './events.service';

import { OverwolfService } from './overwolf.service';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class OwCommunicationService {
	constructor(private events: Events, private logger: NGXLogger, private ow: OverwolfService) {
		console.log('starting ow communication service');
		this.init();
	}

	private init() {
		this.events.on(Events.REPLAY_CREATED).subscribe(event => this.sendMatchCountInfo());
		this.ow.addSessionInfoChangedLisetner(data => console.warn('session info changed', data));
	}

	private async sendMatchCountInfo() {
		this.logger.error('This method will be deprecated with the new GS API, and should never be called in prod');
		const res = await this.ow.getRunningGameInfo();
		if (res && res.sessionId) {
			const info = { matchCount: 1, sessionId: res.sessionId };
			this.ow.setExtensionInfo(info);
		}
	}
}

import { Injectable } from '@angular/core';

import { Events } from '../events.service';
import { OverwolfService } from '../overwolf.service';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class MemoryInspectionService {
	readonly g_interestedInFeatures = ['match', 'scene_state'];

	constructor(private events: Events, private ow: OverwolfService, private logger: NGXLogger) {
		this.init();
	}

	private async init() {
		this.ow.addGameInfoUpdatedListener(res => {
			if (this.ow.gameLaunched(res)) {
				this.registerEvents();
				setTimeout(() => this.setFeatures(), 1000);
			}
		});
		const gameInfo = await this.ow.getRunningGameInfo();
		if (this.ow.gameRunning(gameInfo)) {
			this.registerEvents();
			setTimeout(() => this.setFeatures(), 1000);
		}
	}

	private registerEvents() {
		// general events errors
		this.ow.addGameEventsErrorListener(info => console.log('[memory service] Error: ', info));

		// "static" data changed
		// This will also be triggered the first time we register
		// for events and will contain all the current information
		this.ow.addGameEventInfoUpdates2Listener(info => this.handleInfoUpdate(info));

		// an event triggerd
		this.ow.addGameEventsListener(info => console.log('[memory service] EVENT FIRED: ', info));
	}

	private handleInfoUpdate(info) {
		// console.log('[memory service] INFO UPDATE: ', info);
		if (info.feature === 'match') {
			this.logger.warn('[memory-service] Sending fake game ID, as official way is not supported yet');
			this.events.broadcast(Events.NEW_GAME_ID, 'game' + new Date().getDate());
			// this.events.broadcast(Events.NEW_GAME_ID, info);
		}
	}

	private async setFeatures() {
		const info = await this.ow.setGameEventsRequiredFeatures(this.g_interestedInFeatures);
		if (info.status === 'error') {
			window.setTimeout(() => this.setFeatures(), 2000);
			return;
		}
		console.log('[memory service] Set required features:', this.g_interestedInFeatures);
		console.log('[memory service] ', info);
	}
}

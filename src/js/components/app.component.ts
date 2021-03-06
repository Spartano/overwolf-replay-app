import { Component } from '@angular/core';
import { MemoryInspectionService } from '../hs-integration/services/memory-inspection.service';
import { OverwolfService } from '../hs-integration/services/overwolf.service';
import { Game } from '../models/game';
import { AllCardsService } from '../services/all-cards.service';
import { DebugService } from '../services/debug.service';
import { Events } from '../services/events.service';
import { GameDbService } from '../services/game-db.service';
import { GameMonitorService } from '../services/gameparsing/game-monitor.service';
import { LogListenerService } from '../services/log-listener.service';
import { LogRegisterService } from '../services/log-register.service';
import { ReplayManager } from '../services/replay-manager.service';
import { ReplayUploader } from '../services/replay-uploader.service';

@Component({
	selector: 'zh-app',
	styleUrls: [`../../css/component/app.component.scss`],
	template: `
		<div></div>
	`,
})
export class AppComponent {
	retriesForEgsLeft = 20;
	retryForEgsDelay = 4000;

	constructor(
		private debugService: DebugService,
		private logListenerService: LogListenerService,
		private gameMonitorService: GameMonitorService,
		private logRegister: LogRegisterService,
		private init_gameDb: GameDbService,
		private init_memory: MemoryInspectionService,
		private cardsDb: AllCardsService,
		private ow: OverwolfService,
		private events: Events,
		private replayManager: ReplayManager,
		private replayUploader: ReplayUploader,
	) {
		console.log('init started');
		this.init();
	}

	async init() {
		const inHS: boolean = await this.ow.inGame();
		if (!inHS) {
			setTimeout(() => {
				this.init();
			}, 1000);
			return;
		}
		console.log('In HS, starting init');
		this.ow.addGameInfoUpdatedListener((res: any) => {
			if (this.exitGame(res)) {
				this.closeApp();
			}
		});
		this.events.on(Events.REPLAY_CREATED).subscribe(event => {
			console.log('received game from event', event);
			const game: Game = JSON.parse(event.data[0]);
			this.replayManager.saveLocally(game);
		});
		await this.cardsDb.initializeCardsDb();
		this.requestDisplayOnShelf();
	}

	retryEgs(errorCallback) {
		if (this.retriesForEgsLeft < 0) {
			errorCallback();
			return;
		}

		this.retriesForEgsLeft--;
		// console.log('retrying to display EGS', this.retriesForEgsLeft);
		setTimeout(async () => {
			await this.requestDisplayOnShelf();
		}, this.retryForEgsDelay);
	}

	async requestDisplayOnShelf() {
		const egsEnabledResult = await this.ow.isGSEnabled();
		if (egsEnabledResult.status === 'success' && egsEnabledResult.isEnabled) {
			const displayRequestResult = await this.ow.requestGSDisplay();
			if (displayRequestResult.status === 'success') {
				console.log(
					'request to display is a success, OW should call shelf.html ' +
						'which will trigger status listening process updates on its side',
					this.retriesForEgsLeft,
				);
			} else {
				this.retryEgs(() => console.log('Request to display shelf failed', displayRequestResult));
			}
		} else {
			this.retryEgs(() => console.log('EGS is not enabled', egsEnabledResult));
		}
	}

	private exitGame(gameInfoResult: any): boolean {
		return !gameInfoResult || !gameInfoResult.gameInfo || !gameInfoResult.gameInfo.isRunning;
	}

	private async closeApp() {
		const window = await this.ow.getCurrentWindow();
		console.log('closing');
		// Keep some time to finish parsing / uploading the replays in case the player rage quits
		setTimeout(() => this.ow.closeWindow(window.id), 5000);
	}
}

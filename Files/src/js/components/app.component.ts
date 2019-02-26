import { Component } from '@angular/core';

import { LogListenerService } from '../services/log-listener.service';
import { GameStorageService } from '../services/game-storage.service';
import { GameMonitorService } from '../services/gameparsing/game-monitor.service';
import { OwCommunicationService } from '../services/ow-communcation.service';
import { ReplayManager } from '../services/replay-manager.service';
import { ReplayUploader } from '../services/replay-uploader.service';
import { Events } from '../services/events.service';
import { DebugService } from '../services/debug.service';

import { Game } from '../models/game';
import { LogRegisterService } from '../services/log-register.service';

declare var overwolf: any;

@Component({
	selector: 'zh-app',
	styleUrls: [`../../css/component/app.component.scss`],
	template: `
		<div></div>
	`,
})
// 7.1.1.17994
export class AppComponent {

	// requestedDisplayOnShelf: boolean;
	retriesForEgsLeft = 10;
	retryForEgsDelay = 2000;

	constructor(
		private debugService: DebugService,
		private logListenerService: LogListenerService,
		private gameMonitorService: GameMonitorService,
		private logRegister: LogRegisterService,
		private gameStorageService: GameStorageService,
		private owCommunicationService: OwCommunicationService,
		private events: Events,
		private replayManager: ReplayManager,
		private replayUploader: ReplayUploader) {

		this.init();
	}

	init(): void {
		overwolf.games.onGameInfoUpdated.addListener((res: any) => {
			// console.log('updated game', res);
			if (this.exitGame(res)) {
				this.closeApp();
			}
		});

		this.events.on(Events.REPLAY_CREATED)
			.subscribe(event => {
				let game: Game = JSON.parse(event.data[0]);
				// console.log('received game from event', game);
				this.replayManager.saveLocally(game);
			});

		this.requestDisplayOnShelf();
	}

	retryEgs(errorCallback) {
		if (this.retriesForEgsLeft < 0) {
			errorCallback();
			return;
		}

		this.retriesForEgsLeft--;
		// console.log('retrying to display EGS', this.retriesForEgsLeft);
		setTimeout(() => {
			this.requestDisplayOnShelf();
		}, this.retryForEgsDelay)
	}

	requestDisplayOnShelf(): void {
		// console.log('requesting display on shelf', overwolf.egs);
		// this.showShelfWindow();
		overwolf.egs.isEnabled((result: any) => {
			// console.log('egs is enabled', result);
			if (result.status === 'success' && result.isEnabled) {
				// console.log('requesting to display', result);
				overwolf.egs.requestToDisplay((result2: any) => {
					// console.log('requestToDisplay result', result2);
					if (result2.status === 'success') {
						console.log('request to display is a success, OW should call shelf.html which will trigger status listening process updates on its side', this.retriesForEgsLeft);
					}
					else {
						this.retryEgs(() => {
							let extra = {
								status: result2.status,
								result: result2
							}
							console.log('Request to display shelf failed', { extra: extra });
							// Raven.captureMessage('Request to display shelf failed', { extra: extra });
						});
					}
				});
			}
			else {
				this.retryEgs(() => {
					let extra = {
						status: result.status,
						isEnabled: result.isEnabled,
						result: result
					}
					console.log('EGS is not enabled', { extra: extra });
					// Raven.captureMessage('EGS is not enabled', { extra: extra });
				});
			}
		});
	}

	closeWindow() {
		// Wait for a bit to give a chance to the game parser to finish parsing everything
		setTimeout(() => {
			overwolf.windows.getCurrentWindow((result) => {
				if (result.status === "success") {
					console.log('closing');
					// overwolf.windows.close(result.window.id);
				}
			});
		}, 2000);
	}

	showShelfWindow(): void {
		console.log('opening shelf window');
		overwolf.windows.obtainDeclaredWindow('ShelfWindow', function(result: any) {
			if (result.status === "success") {
				overwolf.windows.restore(result.window.id, function(result2: any) {
					console.log(result2);
				});
			}
		});
	}

	private exitGame(gameInfoResult: any): boolean {
		return (!gameInfoResult || !gameInfoResult.gameInfo || !gameInfoResult.gameInfo.isRunning);
	}

	private closeApp() {
		overwolf.windows.getCurrentWindow((result) => {
			if (result.status === "success") {
				console.log('closing');
				// Keep some time to finish parsing / uploading the replays in case the player rage quits
				setTimeout(() => {
					overwolf.windows.close(result.window.id);
				}, 5000)
			}
		});
	}
}

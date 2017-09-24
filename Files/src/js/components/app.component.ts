import { Component } from '@angular/core';

import * as Raven from 'raven-js';

import { LogListenerService } from '../services/log-listener.service';
import { GameStorageService } from '../services/game-storage.service';
import { OwCommunicationService } from '../services/ow-communcation.service';
import { ReplayManager } from '../services/replay-manager.service';
import { ReplayUploader } from '../services/replay-uploader.service';
import { Events } from '../services/events.service';

import { Game } from '../models/game';

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

	constructor(
		private logListenerService: LogListenerService,
		private gameStorageService: GameStorageService,
		private owCommunicationService: OwCommunicationService,
		private events: Events,
		private replayManager: ReplayManager,
		private replayUploader: ReplayUploader) {

		this.init();
	}

	init(): void {
		console.log('init gameservice', overwolf.egs);

		this.events.on(Events.REPLAY_CREATED)
			.subscribe(event => {
				this.replayManager.saveLocally(event.data[0]);
			});

		this.requestDisplayOnShelf();

		let oldConsoleLogFunc = console.log;
		let debugMode = true;
		if (debugMode) {
			console.log = function() {
				let argsString = "";
				for (let i = 0; i < arguments.length; i++) {
					let cache = [];
					argsString += (JSON.stringify(arguments[i], function(key, value) {
						if (typeof value === 'object' && value !== null) {
							if (cache.indexOf(value) !== -1) {
								// Circular reference found, discard key
								return;
							}
							// Store value in our collection
							cache.push(value);
						}
						return value;
					}) || '').substring(0, 500) + ' | ';
					cache = null; // Enable garbage collection + " | "
				}
				oldConsoleLogFunc.apply(console, [argsString]);
			};
		}
	}

	requestDisplayOnShelf(): void {
		console.log('requesting display on shelf', overwolf.egs);
		// this.showShelfWindow();
		overwolf.egs.isEnabled((result: any) => {
			console.log('egs is enabled', result);
			// result.status == ["success"| "error"]
			// result.isEnabled == [true | false]
			if (result.status === 'success' && result.isEnabled) {
				console.log('requesting to display', result);
				overwolf.egs.requestToDisplay((result2: any) => {
					console.log('requestToDisplay result', result2);
					if (result2.status === 'success') {
						console.log('request to display is a success, OW should call shelf.html which will trigger status listening process updates on its side');
					}
					else {
						let extra = {
							status: result2.status,
							result: result2
						}
						console.log('Request to display shelf failed', { extra: extra });
						Raven.captureMessage('Request to display shelf failed', { extra: extra });
					}
				});
			}
			else {
				let extra = {
					status: result.status,
					isEnabled: result.isEnabled,
					result: result
				}
				console.log('EGS is not enabled', { extra: extra });
				Raven.captureMessage('EGS is not enabled', { extra: extra });
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
}

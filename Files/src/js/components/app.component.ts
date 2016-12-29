import { Component } from '@angular/core';
import { LogListenerService } from '../services/log-listener.service';
import { GameStorageService } from '../services/game-storage.service';

import { Game } from '../models/game';

declare var overwolf: any;

@Component({
	selector: 'zh-app',
	styleUrls: [`css/component/app.component.css`],
	template: ` 
		<div></div>
	`,
})
export class AppComponent {

	requestedDisplayOnShelf: boolean;

	constructor(private logListenerService: LogListenerService, private gameStorageService: GameStorageService) {
		this.init();
	}

	init(): void {
		console.log('init gameservice', overwolf.egs);
		this.logListenerService.addGameCompleteListener((game: Game) => {
			if (!this.requestedDisplayOnShelf) {
				this.requestDisplayOnShelf();
			}
		});
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
				overwolf.egs.requestToDisplay(function(result2: any) {
					// result.status == ["success" | "error"]
					// result.reason == [undefined | "EndGameScreen is disabled" | "Not accepting shelves"]
					console.log('requestToDisplay result', result2);
					if (result2.status === 'success') {
						console.log('request to display is a success, OW should call shelf.html which will trigger status listening process updates on its side');
						this.requestedDisplayOnShelf = true;
					}
				});
			}
			else {
				// Debug only
				// this.showShelfWindow();
			}
		});
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

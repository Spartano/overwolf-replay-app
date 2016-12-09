import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { LogListenerService } from '../../service/log-listener.service';

import { Game } from '../../model/game';

declare var overwolf:any

@Component({
	moduleId: module.id,
	selector: 'zh-app',
	styleUrls: [`app.css`],
	template: `
		<div></div>
	`
})
export class AppComponent { 

	requestedDisplayOnShelf:boolean;

	constructor(private logListenerService:LogListenerService) {
		this.init();
	}

	init():void {
		console.log('init gameservice', overwolf.egs)
		this.logListenerService.addGameCompleteListener((game:Game) => {
			if (!this.requestedDisplayOnShelf) {
				this.requestDisplayOnShelf();
			}
		})
	}

	requestDisplayOnShelf():void {
		console.log('requesting display on shelf', overwolf.egs);
		overwolf.egs.isEnabled((result:any) => {
			console.log('egs is enabled', result);
		  	// result.status == ["success"| "error"]
		  	// result.isEnabled == [true | false]
			if (result.status == 'success' && result.isEnabled) {
				console.log('requesting to display', result);
				overwolf.egs.requestToDisplay(function(result:any) {
				    // result.status == ["success" | "error"]
				    // result.reason == [undefined | "EndGameScreen is disabled" | "Not accepting shelves"]
				    console.log('requestToDisplay result', result);
				    if (result.status == 'success') {
				    	console.log('request to display is a success, OW should call shelf.html which will trigger status listening process updates on its side')
						this.requestedDisplayOnShelf = true;
				    }
				});
			}
			// else {
			// 	// Debug only
			// 	this.showShelfWindow();
			// }
		});
	}

	showShelfWindow():void {
		console.log('opening shelf window');
		overwolf.windows.obtainDeclaredWindow('ShelfWindow', function(result:any) {
			if (result.status == "success"){
				overwolf.windows.restore(result.window.id, function(result:any) {
					console.log(result);
				});
			}
		})
	}
}
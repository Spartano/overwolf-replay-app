import { Component, NgZone } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

import { LocalStorageService } from 'angular-2-local-storage';
import $ from 'jquery';

import { Game } from '../models/game';

import { Events } from '../services/events.service';
import { GameHelper } from '../services/gameparsing/game-helper.service';
import { GameRetrieveService } from '../services/game-retrieve.service';
import { StorageHelperService } from '../services/storage-helper.service';
import { LogListenerService } from '../services/log-listener.service';
import { GameStorageService } from '../services/game-storage.service';
import { DebugService } from '../services/debug.service';

declare var overwolf: any;

@Component({
	selector: 'zh-shelf',
	styleUrls: [`../../css/component/shelf.component.scss`, '../../css/global/global.scss'],
	encapsulation: ViewEncapsulation.None,
	template: `
		<div class="shelf-container" [ngSwitch]="currentState">
			<global-error class="global-error" *ngIf="globalError" [error]="globalError" (close)="hideError()"></global-error>
			<loading *ngSwitchCase="'LOADING'" class="loading"></loading>
			<shelf-with-games *ngSwitchCase="'SHELF_WITH_GAMES'" [games]="games"></shelf-with-games>
			<empty-shelf *ngSwitchCase="'EMPTY_SHELF'" class="empty-shelf"></empty-shelf>
			<first-time *ngIf="firstTimeUser" class="first-time" (close)="completeFtue()"></first-time>
			<login *ngIf="showLogin" class="login" (close)="showLogin = false"></login>
			<upload-progress class="upload-progress"></upload-progress>
		</div>
	`,
})
export class ShelfComponent {
	currentState = 'LOADING';
	globalError: string;
	firstTimeUser = false;
	showLogin = false;
	
	private games: Game[] = null;

	constructor(
		private zone: NgZone,
		private debugService: DebugService,
		private events: Events,
		private localStorageService: LocalStorageService,
		private gameStorageService: GameStorageService,
		private storageHelper: StorageHelperService,
		private gameService: GameRetrieveService,
		private gameHelper: GameHelper) {

		console.log('in AppComponent constructor', gameService);

		this.postMessage();

		this.events.on(Events.SHOW_LOGIN)
			.subscribe(() => {
				console.log('showing login');
				this.showLogin = true;
			});
		this.events.on(Events.HIDE_LOGIN)
			.subscribe(() => {
				this.showLogin = false;
			});
		this.events.on(Events.GLOBAL_ERROR)
			.subscribe((event) => {
				switch(event.data[0]) {
					case 'CANT_CLAIM_ACCOUNT':
						this.globalError = 'We could not connect to your account, and we will try again next time you open the EGS. In the meantime, you can still upload and share your games, and they will be linked once we can connect you.'
						break;
					case 'CANT_DISCONNECT_ACCOUNT':
						this.globalError = `We could not disconnect your account. Please contact us so we can help you, and we will probably ask you for this id: ${event.data[1]}`
						break;
					default:
						console.log('Unkown global error', event.data[0]);
				}
			});
	}

	ngOnInit(): void {
		overwolf.extensions.getInfo(
			'nafihghfcpikebhfhdhljejkcifgbdahdhngepfb',
			(callbackInfo) => {
				this.zone.run(() => {
					console.log('extensions callback', callbackInfo);
					let info = callbackInfo.info;
					if (info && info.sessionId) {
						this.loadGamesFromSession(info.sessionId);
					}
					else {
						this.loadGamesFromSession(null);
					}
				})
			}
		)
	}

	loadGamesFromSession(sessionId: string) {
		this.gameService.getGames(sessionId, (games) => {
			this.games = games.reverse();
			console.log('games in shelf', this.games);
			if (this.games && this.games.length > 0) {
				this.currentState = 'SHELF_WITH_GAMES';
				this.firstTimeUser = this.isFirstTime();
			}
			else {
				this.currentState = 'EMPTY_SHELF';
			}
			console.log('current state', this.currentState);
		})
	}

	isFirstTime() {
		return this.localStorageService.get('ftue-completed') !== 'true';
	}

	completeFtue() {
		this.localStorageService.set('ftue-completed', 'true');
		this.firstTimeUser = false;
		console.log('FTUE completed');
	}

	hideError() {
		this.globalError = null;
	}

	// https://github.com/Microsoft/TypeScript/issues/9548
	postMessage() {
		let el = $('.shelf-container')[0];
		console.log('content element', el);
		if (!el) {
			console.warn('could not find shelf container element, retrying', document);
			setTimeout( () => this.postMessage(), 50);
			return;
		}

		(el.addEventListener as WhatWGAddEventListener)('wheel', (evt: any) => {
			// console.log('scrolling', evt);
			window.parent.postMessage({deltaY: evt.deltaY}, "*");
		}, { passive: true });
	}
}

interface WhatWGEventListenerArgs {
	capture?: boolean;
}

interface WhatWGAddEventListenerArgs extends WhatWGEventListenerArgs {
	passive?: boolean;
	once?: boolean;
}

type WhatWGAddEventListener = (
	type: string,
	listener: (event: Event) => void,
	options?: WhatWGAddEventListenerArgs
) => void;

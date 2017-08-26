import { Component, NgZone, ViewChild } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

import * as Raven from 'raven-js';

import { GameReplayComponent } from '../components/game-replay.component';
import { CarouselComponent } from '../components/carousel.component';
import { EmptyShelfComponent } from '../components/empty-shelf.component';

import { Game } from '../models/game';

import { GameRetrieveService } from '../services/game-retrieve.service';
import { AccountService } from '../services/account.service';
import { LogListenerService } from '../services/log-listener.service';
import { GameStorageService } from '../services/game-storage.service';
import { UserPreferences } from '../services/user-preferences.service';

declare var overwolf: any;
import * as $ from 'jquery';

@Component({
	selector: 'zh-shelf',
	styleUrls: [`../../css/component/shelf.component.scss`, '../../css/global/global.scss'],
	encapsulation: ViewEncapsulation.None,
	template: `
		<div class="shelf-container">
			<div class="shelf-with-games" *ngIf="!games || games.length > 0">
				<div class="main-zone">
					<div class="header">
						<info-zone [game]="selectedGame" *ngIf="selectedGame"></info-zone>
						<button *ngIf="!accountClaimed && accountClaimUrl" class="claim-account" (click)="claimAccount()">
							Claim my account
							<div class="zth-tooltip bottom">
								<p>Claim your Zero to Heroes account now to store all your games online and post your games for advice!</p>
								<svg class="tooltip-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 4">
									<polygon points="12,0 6,4 0,0 "/>
								</svg>
							</div>
						</button>
					</div>
					<game-replay [game]="selectedGame"></game-replay>
				</div>
				<carousel [games]="games" (onGameSelected)=onGameSelected($event)></carousel>
			</div>
			<empty-shelf class="empty-shelf" *ngIf="games && games.length === 0"></empty-shelf>
		</div>
	`,
})
export class ShelfComponent {
	zone: NgZone;
	// requestedDisplayOnShelf:boolean;
	shelfLoaded: boolean;
	accountClaimed: boolean;
	accountClaimUrl: string;

	name = 'Hearthstone Replay Viewer';
	games: Game[] = null;
	selectedGame: Game;

	@ViewChild(CarouselComponent) private carouselComponent: CarouselComponent;
	@ViewChild(GameReplayComponent) private gameReplayComponent: GameReplayComponent;

	constructor(
		private gameStorageService: GameStorageService,
		private gameService: GameRetrieveService,
		private accountService: AccountService,
		private userPreferences: UserPreferences) {

		console.log('in AppComponent constructor', gameService);
		this.shelfLoaded = false;

		this.postMessage();

		// Change logging for debug
		let oldConsoleLogFunc = console.log;
		let debugMode = false;
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

	ngOnInit(): void {
		setTimeout(() => {
			try {
				this.games = this.gameService.getGames().reverse();
				console.log('games in shelf', this.games);
				if (this.games && this.games.length > 0) {
					this.carouselComponent.onSelect(this.games[0]);
				}
			}
			catch (e) {
				console.error(e);
				Raven.captureException(e);
				throw e;
			}
		}
		, 50);

		console.log('subscribing to account claim subjects');
		this.accountService.accountClaimUrlSubject.subscribe((value) => {
			this.accountClaimUrl = value.toString();
			console.log('built claimAccountUrl', this.accountClaimUrl);
		});

		this.accountService.accountClaimStatusSubject.subscribe((value) => {
			this.accountClaimed = value;
			console.log('accountClaimedStatus', value);
		});
	}

	onGameSelected(game: Game) {
		console.log('reloading game', game);
		this.selectedGame = game;
		this.gameReplayComponent.reload(game.replay, () => {
			console.log('game reloaded');

			if (!this.shelfLoaded) {
				console.log('sending shelf ready message');
				// Start loading the shelf page
				overwolf.egs.setStatus(overwolf.egs.enums.ShelfStatus.Ready, (result: any) => {
					console.log('confirmed ready', result);
					this.shelfLoaded = false;
				});
			}
		});
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

	claimAccount() {
		window.open(this.accountClaimUrl, '_blank');
		this.accountService.startListeningForClaimChanges();
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

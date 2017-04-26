import { Component, NgZone, ViewChild } from '@angular/core';

import { GameReplayComponent } from '../components/game-replay.component';
import { CarouselComponent } from '../components/carousel.component';

import { Game } from '../models/game';

import { GameRetrieveService } from '../services/game-retrieve.service';
import { AccountService } from '../services/account.service';

declare var overwolf: any;
declare var $: any;

@Component({
	selector: 'zh-shelf',
	styleUrls: [`css/component/shelf.component.css`],
	template: `
		<div class="shelf-container">
			<div class="replay-zone">
				<div *ngIf="!accountClaimed && accountClaimUrl" class="claim-account">
					Your Zero to Heroes account has not been claimed. Please 
						<a href="{{accountClaimUrl}}" target="_blank" (click)="accountService.startListeningForClaimChanges()">click here</a> 
					to claim it 
					<span class="help-text" title="Claiming your account will let you post your post public reviews of your games to receive advise on them"> (?)</span>
				</div>
				<game-replay [game]="selectedGame"></game-replay>
			</div>
			<carousel [games]="games" (onGameSelected)=onGameSelected($event)></carousel>
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
	games: Game[] = [];
	selectedGame: Game;

	@ViewChild(CarouselComponent) private carouselComponent: CarouselComponent;
	@ViewChild(GameReplayComponent) private gameReplayComponent: GameReplayComponent;

	constructor(private gameService: GameRetrieveService, private accountService: AccountService) {
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
					argsString += JSON.stringify(arguments[i], function(key, value) {
						if (typeof value === 'object' && value !== null) {
							if (cache.indexOf(value) !== -1) {
								// Circular reference found, discard key
								return;
							}
							// Store value in our collection
							cache.push(value);
						}
						return value;
					}) + ' | ';
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
				this.carouselComponent.onSelect(this.games[0]);
			}
			catch (e) {
				console.error(e);
				throw e;
			}
		}, 50);

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
		// console.log('reloading game', game);
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
			console.error('could not find shelf container element, retrying', document);
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

import { Component, NgZone, ViewChild } from '@angular/core';
import { GameReplayComponent } from '../components/game-replay.component';
import { CarouselComponent } from '../components/carousel.component';
import { Game } from '../models/game';
// import { GameService } from './game.service';
import { GameRetrieveService } from '../services/game-retrieve.service';

declare var overwolf: any;
declare var $: any;

@Component({
	selector: 'zh-shelf',
	styleUrls: [`css/component/shelf.component.css`],
	template: `
		<div class="shelf-container">
			<div class="replay-zone">
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

	name = 'Hearthstone Replay Viewer';
	games: Game[] = [];
	selectedGame: Game;

	@ViewChild(CarouselComponent) private carouselComponent: CarouselComponent;
	@ViewChild(GameReplayComponent) private gameReplayComponent: GameReplayComponent;

	constructor(private gameService: GameRetrieveService) {
		console.log('in AppComponent constructor', gameService);
		this.shelfLoaded = false;
		this.postMessage();
	}

	ngOnInit(): void {
		// this.zone = new NgZone({enableLongStackTrace: false});
		setTimeout(() => {
			try {
				console.log('getting games', this.carouselComponent, this.gameService.getGames());

				this.games = this.gameService.getGames().reverse();
				// for (let game of this.gameService.getGames()) {
				// 	console.log('retrieved games from gameService, adding', game);
				// 	this.games.unshift(game);
				// 	// this.carouselComponent.newGame(game);
				// }
				this.carouselComponent.onSelect(this.games[0])
			}
			catch (e) {
				console.error(e);
				throw e;
			}
		}, 50);
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
			console.error('could not find shelf container element, retrying', document);
			setTimeout( () => this.postMessage(), 50);
			return;
		}

		(el.addEventListener as WhatWGAddEventListener)('wheel', (evt: any) => {
			console.log('scrolling', evt);
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

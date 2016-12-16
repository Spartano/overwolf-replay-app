import { Component, NgZone, ViewChild } from '@angular/core';
import { GameReplayComponent } from '../components/game-replay.component';
import { CarouselComponent } from '../components/carousel.component';
import { Game } from '../models/game';
// import { GameService } from './game.service';
import { GameRetrieveService } from '../services/game-retrieve.service';

declare var overwolf: any;

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
	}

	ngOnInit(): void {
		// this.zone = new NgZone({enableLongStackTrace: false});
		setTimeout(() => {
			try {
				console.log('getting games', this.carouselComponent, this.gameService.getGames());

				for (let game of this.gameService.getGames()) {
					this.games.push(game);
					this.games.push(game);
					this.games.push(game);
					this.games.push(game);
					this.games.push(game);
					this.games.push(game);
					this.games.push(game);
					this.games.push(game);
					this.carouselComponent.newGame(game);
				}
			}
			catch (e) {
				console.error(e);
				throw e;
			}
		}, 50);

		// this.gameService.getGames().subscribe((game:Game) => {
		// 	// http://stackoverflow.com/questions/31706948/angular2-view-not-changing-after-data-is-updated
		// 	this.zone.run(() => {
		// 		// console.debug('loading game via subscription', game);
		// 		this.games.push(game);
		// 		this.games.push(game);
		// 		this.games.push(game);
		// 		this.games.push(game);
		// 		this.games.push(game);
		// 		this.games.push(game);
		// 		this.games.push(game);
		// 		this.games.push(game);
			// this.carouselComponent.newGame(game);

		// 		if (!this.shelfLoaded) {
		// 			console.log('trying to load shelf');
		// 	    	overwolf.egs.setStatus(overwolf.egs.enums.ShelfStatus.Loading, function(result:any) {
		// 	    		console.log('confirmed loading');
		// 	    	});
		// 		}
		// 	})
		// })
	}

	onGameSelected(game: Game) {
		console.log('reloading game', game);
		this.selectedGame = game;
		this.gameReplayComponent.reload(game.replay, () => {
			this.shelfLoaded = true;
			console.log('game reloaded');

			if (!this.shelfLoaded) {
				console.log('sending shelf ready message');
				// Start loading the shelf page   	
				overwolf.egs.setStatus(overwolf.egs.enums.ShelfStatus.Ready, function(result: any) {
					console.log('confirmed ready');
				});
			}
		});
	}
}

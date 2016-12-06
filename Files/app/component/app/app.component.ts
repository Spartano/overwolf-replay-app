import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { GameReplayComponent } from '../game-replay/game-replay.component';
import { CarouselComponent } from '../carousel/carousel.component';
import { Game } from '../../model/game';
// import { GameService } from './game.service';
import { GameService } from '../../service/game.service';

@Component({
	moduleId: module.id,
	selector: 'zh-app',
	styleUrls: [`app.css`],
	template: `
		<div class="shelf-container">
			<div class="replay-zone">
				<h1 class="matchup-title" *ngIf="selectedGame && selectedGame.player">{{selectedGame.player.name}} Vs. {{selectedGame.opponent.name}}</h1>
				<game-replay [game]="selectedGame"></game-replay>
			</div>
			<carousel [games]="games" (onGameSelected)=onGameSelected($event)></carousel>
		</div>
	`
})

export class AppComponent { 
	zone:NgZone;

	@ViewChild(CarouselComponent) private carouselComponent: CarouselComponent;
	@ViewChild(GameReplayComponent) private gameReplayComponent: GameReplayComponent;

	name = 'Hearthstone Replay Viewer';
	games: Game[] = [];
	selectedGame:Game;

	constructor(private gameService:GameService) {
		// console.log('in AppComponent constructor', gameService)
	}

	ngOnInit():void {
		this.zone = new NgZone({enableLongStackTrace: false});

		this.gameService.getGames().subscribe((game:Game) => {
			// http://stackoverflow.com/questions/31706948/angular2-view-not-changing-after-data-is-updated
			this.zone.run(() => {
				// console.debug('loading game via subscription', game);
				this.games.push(game);
				this.games.push(game);
				this.games.push(game);
				this.games.push(game);
				this.games.push(game);
				this.games.push(game);
				this.games.push(game);
				this.games.push(game);
				this.carouselComponent.newGame(game);
			})
		})
	}

	onGameSelected(game:Game) {
		console.log('reloading game', game);
		this.selectedGame = game;
		this.gameReplayComponent.reload(game.replay);
	}
}
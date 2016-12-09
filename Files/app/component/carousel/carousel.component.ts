import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Game } from '../../model/game';
import { GameThumbnailComponent } from '..//game-thumbnail/game-thumbnail.component';

@Component({
	moduleId: module.id,
	selector: 'carousel',
	styleUrls: [`carousel.css`],
	template: `
		<div class="carousel">
			<ul class="games" *ngIf="games">
				<li *ngFor="let game of games | slice:startIndex:endIndex" (click)="onSelect(game)">
					<game-thumbnail [game]="game" [selected]="game === selectedGame"></game-thumbnail>
				</li>
			</ul>
		</div>
	`
})

export class CarouselComponent {
	@Input() games: Game[];
	@Output() onGameSelected = new EventEmitter<Game>();

	selectedGame: Game;

	displayedGames: number;
	startIndex: number;
	endIndex: number;

	ngOnInit():void {
		this.displayedGames = 4;
		this.startIndex = 0;
		this.endIndex = this.startIndex + this.displayedGames;
	}

	newGame(game: Game): void {
		if (!this.selectedGame) {
			this.onSelect(game);
		}
	}

	onSelect(game: Game): void {
		// console.log('loading game', game);
		this.selectedGame = game;
		this.onGameSelected.emit(game);
	}

	showPrevious():void {
		if (this.startIndex == 0) return;
		if (this.startIndex - this.displayedGames < 0) return;
		this.startIndex = this.startIndex - this.displayedGames;
		this.endIndex = this.startIndex + this.displayedGames;
	}

	showNext():void {
		if (this.startIndex + this.displayedGames >= this.games.length) return;
		
		this.startIndex = this.startIndex + this.displayedGames;
		this.endIndex = Math.min(this.games.length, this.startIndex + this.displayedGames);
	}
}
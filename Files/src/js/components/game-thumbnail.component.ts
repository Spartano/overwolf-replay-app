import { Component, Input } from '@angular/core';
import { Game } from '../models/game';

@Component({
	selector: 'game-thumbnail',
	styleUrls: [`css/component/game-thumbnail.component.css`],
	template: `
		<div class="game {{game.spectating ? 'spectating' : game.result}} {{game.gameMode}}" [class.selected]="selected" *ngIf="game">
			<div class="matchup">
				<div class="highlighter"></div>
				<hero-avatar [hero]="game.player.hero" [won]="game.result == 'won'"></hero-avatar>
				<div class="separator">VS</div>
				<hero-avatar [hero]="game.opponent.hero" [won]="game.result == 'lost'"></hero-avatar>
			</div>
			<div class="game-info">
				<span class="title">
					<span class="hero-name">{{game.player.name}}</span>
					<span class="separator">Vs.</span>
					<span class="hero-name">{{game.opponent.name}}</span>
				</span>
				<span class="result">{{getGameResultString(game)}}</span>
			</div>
		</div>
	`,
})

export class GameThumbnailComponent {
	@Input() game: Game;
	@Input() selected: boolean;

	getGameResultString(game: Game) {
		if (game.spectating) {
			return "Spectating";
		}

		let result = game.result;
		let resultString: string;

		switch (result) {
			case "won":
				resultString = "Victory";
				break;
			case "lost":
				resultString = "Defeat";
				break;
			default:
				resultString = "Tie";
				break;
		}

		return resultString;
	}
}

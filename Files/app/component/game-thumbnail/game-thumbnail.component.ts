import { Component, Input } from '@angular/core';
import { Game } from '../../model/game';
import { HeroAvatarComponent } from './hero-avatar.component';

@Component({
	moduleId: module.id, 
	selector: 'game-thumbnail',
	styleUrls: ['game-thumbnail.css'],
	template: `
		<div class="game {{game.result}}" [class.selected]="selected" *ngIf="game">
			<div class="matchup">
				<div class="highlighter"></div>
				<hero-avatar [hero]="game.player.hero" [won]="game.result == 'won'"></hero-avatar>
				<div class="separator">VS</div>
				<hero-avatar [hero]="game.opponent.hero" [won]="game.result == 'lost'"></hero-avatar>
			</div>
			<div class="game-info">
				<span class="title">{{game.title}}</span>
				<span class="result">{{getGameResultString(game.result)}}</span>
			</div>
		</div>
	`
})

export class GameThumbnailComponent {
	@Input() game: Game;
	@Input() selected: boolean;

	getGameResultString(result:string) {
		let resultString:string;

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
import { Component, Input } from '@angular/core';

import { Game } from '../models/game';

@Component({
	selector: 'game-info',
	styleUrls: [`css/component/game-info.component.css`],
	template: `
		<div class="game-info">
			<!--<h2>Game information</h2>-->
			<div class="summary">
				<img *ngIf="rankImage()" src="https://s3.amazonaws.com/com.zerotoheroes/plugins/hearthstone/ranks/{{rankImage()}}.png">
				<div class="info">
					<span class="game-mode">{{gameMode()}}</span>
				</div>
			</div>
			<span class="duration-time">{{durationTime()}}</span>
			<span class="duration-turns">{{game.durationTurns + ' turns'}}</span>
		</div>
	`,
})

export class GameInfoComponent {

	@Input() game: Game;

	private durationTime(): string {
		if (this.game.durationTimeSeconds > 60) {
			// TODO: integer division
			return Math.round(this.game.durationTimeSeconds / 60) + ' minutes';
		}
		return 'a few seconds';
	}

	private gameMode(): string {
		if (this.game.gameMode === 'TavernBrawl') {
			return 'Tavern Brawl';
		}
		if (this.game.gameMode === 'Ranked') {
			if (this.game.gameFormat === 'Wild') {
				return 'Ranked Wild';
			}
			return 'Ranked Standard';
		}
		if (this.game.gameMode === 'Friendly') {
			if (this.game.gameFormat === 'Wild') {
				return 'Friendly Wild';
			}
			return 'Friendly Standard';
		}
		if (this.game.gameMode === 'Casual') {
			if (this.game.gameFormat === 'Wild') {
				return 'Casual Wild';
			}
			return 'Casual Standard';
		}
		if (this.game.gameMode === 'Arena') {
			return 'Arena ' + this.game.arenaInfo.Wins + ' - ' + this.game.arenaInfo.Losses;
		}
		return this.game.gameMode;
	}

	private rankImage(): string {
		if (this.game.gameMode === 'Arena') {
			return 'arena' + this.game.arenaInfo.Wins + 'wins';
		}
		if (this.game.gameMode === 'Ranked') {
			if (this.game.rank === 'legend') {
				return 'legend';
			}
			return 'rank' + this.game.rank;
		}
		if (this.game.gameMode === 'TavernBrawl') {
			return 'tavernbrawl';
		}
		if (this.game.gameMode === 'Casual') {
			return 'casual';
		}
		if (this.game.gameMode === 'Friendly') {
			return 'friendly';
		}
		if (this.game.gameMode === 'Practice') {
			return 'friendly';
		}
		return null;
	}
}

import { Component, Input } from '@angular/core';

import { Game } from '../models/game';

@Component({
	selector: 'game-info',
	styleUrls: [`../../css/component/game-info.component.scss`],
	template: `
		<div class="game-info">
			<img *ngIf="rankImage()" src="https://s3.amazonaws.com/com.zerotoheroes/plugins/hearthstone/ranks/{{rankImage()}}.png">
			<div class="zth-tooltip bottom">
				<p>{{gameMode()}}</p>
				<svg class="tooltip-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 4">
					<polygon points="12,0 6,4 0,0 "/>
				</svg>
			</div>
		</div>
	`,
})

export class GameInfoComponent {

	@Input() game: Game;

	gameMode(): string {
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
		if (this.game.gameMode === 'Arena' && this.game.arenaInfo) {
			return 'Arena ' + this.game.arenaInfo.Wins + ' - ' + this.game.arenaInfo.Losses;
		}
		return this.game.gameMode;
	}

	rankImage(): string {
		if (this.game.gameMode === 'Arena' && this.game.arenaInfo) {
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

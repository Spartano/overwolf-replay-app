import { Component, Input } from '@angular/core';
import { Game } from '../../model/game';

@Component({
	moduleId: module.id,
	selector: 'hero-avatar',
	styleUrls: ['hero-avatar.css'],
	template: `
		<div class="hero-avatar">
			<img class="win-img" src="app/component/game-thumbnail/images/victory.png" *ngIf="won">
			<div class="avatar">
				<img class="portrait" src="https://s3.amazonaws.com/com.zerotoheroes/plugins/hearthstone/cardart/256x/{{hero}}.jpg">
				<img class="frame" src="app/component/game-thumbnail/images/hero_frame.png">
			</div>
		</div>
	`
})

export class HeroAvatarComponent {
	@Input() hero: string;
	@Input() won: boolean;
}
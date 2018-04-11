import { Component, Input } from '@angular/core';

@Component({
	selector: 'hero-avatar',
	styleUrls: [`../../css/component/hero-avatar.component.scss`],
	template: `
		<div class="hero-avatar">
			<img class="win-img" src="../assets/images/victory.png" *ngIf="won">
			<div class="avatar">
				<img class="portrait" src="http://static.zerotoheroes.com/hearthstone/cardart/256x/{{hero}}.jpg">
				<img class="frame" src="../assets/images/hero_frame.png">
			</div>
		</div>
	`,
})

export class HeroAvatarComponent {
	@Input() hero: string;
	@Input() won: boolean;
}

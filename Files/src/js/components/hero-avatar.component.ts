import { Component, Input } from '@angular/core';

@Component({
	selector: 'hero-avatar',
	styleUrls: [`css/component/hero-avatar.component.css`],
	template: `
		<div class="hero-avatar">
			<img class="win-img" src="static/images/victory.png" *ngIf="won">
			<div class="avatar">
				<img class="portrait" src="https://s3.amazonaws.com/com.zerotoheroes/plugins/hearthstone/cardart/256x/{{hero}}.jpg">
				<img class="frame" src="static/images/hero_frame.png">
			</div>
		</div>
	`,
})

export class HeroAvatarComponent {
	@Input() hero: string;
	@Input() won: boolean;
}

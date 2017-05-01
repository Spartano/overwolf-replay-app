import { Component, Input } from '@angular/core';

import { ShareProvider, ShareButton } from 'ng2-sharebuttons';

import { Game } from '../models/game';

@Component({
	selector: 'sharing-zone',
	styleUrls: [`css/component/sharing-zone.component.css`],
	template: `
		<div class="sharing-zone">
			<h2>Share your replay</h2>
			<div class="share-buttons sb-buttons sb-style sb-style-colors">
				<div class="sb-button facebook">
					<button [shareButton]="'facebook'" 
							[sbUrl]="buildUrl()">
						<i class="fa fa-facebook"></i>
					</button>
				</div>
				<div class="sb-button twitter">
					<button [shareButton]="'twitter'" 
							[sbUrl]="buildUrl()"
							[sbTitle]="buildTitle()"
							[sbTags]="'hearthstone'">
						<i class="fa fa-twitter"></i>
					</button>
				</div>
				<div class="sb-button reddit">
					<button [shareButton]="'reddit'" 
							[sbUrl]="buildUrl()"
							[sbTitle]="buildTitle()"
							[sbVia]="'hearthstone'">
						<i class="fa fa-reddit"></i>
					</button>
				</div>
				<div class="sb-button zerotoheroes">
					<button>
						<a class="zerotoheroes" href="{{ buildUrl() }}" target="_blank">
							<img src="static/images/zero-to-heroes-logo.svg">
						</a>
					</button>
				</div>
			</div>
		</div>
	`,
})

export class SharingZoneComponent {

	@Input() game: Game;

	private buildUrl(): string {
		return 'http://www.zerotoheroes.com/r/hearthstone/' + this.game.reviewId;
	}

	private buildTitle(): string {
		return 'Need help! ' + this.game.player.class + ' vs ' + this.game.opponent.class;
	}
}

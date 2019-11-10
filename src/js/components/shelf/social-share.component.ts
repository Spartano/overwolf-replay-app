import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { OverwolfService } from '../../hs-integration/services/overwolf.service';
import { Game } from '../../models/game';

declare var ga: any;

@Component({
	selector: 'social-share',
	styleUrls: [
		`../../../css/component/shelf/manastorm-themes.scss`,
		`../../../css/component/shelf/manastorm-fonts.scss`,
		`../../../css/component/shelf/tooltips.scss`,
		`../../../css/global.scss`,
		`../../../css/component/shelf/social-share.component.scss`,
	],
	template: `
		<section class="manastorm-header-share-section">
			<p class="manastorm-header-subtitle">Share</p>
			<button
				class="gs-icon btn-gs-icon share-icon hint-tooltip-container"
				shareButton="facebook"
				[url]="url('facebook')"
				(click)="sendShareStat('facebook')"
			>
				<svg>
					<use xlink:href="/Files/assets/svg/share-icons.svg#share-on-facebook" />
				</svg>
				<div class="hint-tooltip hint-tooltip-bottom dark-theme">
					<span>Share on Facebook</span>
				</div>
			</button>
			<button
				class="gs-icon btn-gs-icon share-icon hint-tooltip-container"
				shareButton="twitter"
				[url]="url('twitter')"
				(click)="sendShareStat('twitter')"
			>
				<svg>
					<use xlink:href="/Files/assets/svg/share-icons.svg#share-on-twitter" />
				</svg>
				<div class="hint-tooltip hint-tooltip-bottom dark-theme">
					<span>Share on Twitter</span>
				</div>
			</button>
			<button
				class="gs-icon btn-gs-icon share-icon hint-tooltip-container"
				shareButton="reddit"
				[url]="url('reddit')"
				(click)="sendShareStat('reddit')"
			>
				<svg>
					<use xlink:href="/Files/assets/svg/share-icons.svg#share-on-reddit" />
				</svg>
				<div class="hint-tooltip hint-tooltip-bottom dark-theme">
					<span>Share on Reddit</span>
				</div>
			</button>
		</section>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialShareComponent {
	private baseUrl: string;

	constructor(private logger: NGXLogger, private readonly ow: OverwolfService) {}

	@Input('game') set game(value: Game) {
		this.logger.debug('[social-share] setting game');
		if (value) {
			this.baseUrl = `http://replays.firestoneapp.com/?reviewId=${value.reviewId}`;
		}
	}

	url(source: string): string {
		return `${this.baseUrl}&source=${source}`;
	}

	async sendShareStat(source: string) {
		ga('send', 'event', 'share', source);
		ga('send', 'event', 'firestone-user', await this.ow.isFirestoneRunning());
	}
}

import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
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
                    [url]="url">
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
                    [url]="url">
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
                    [url]="url">
                <svg>
                    <use xlink:href="/Files/assets/svg/share-icons.svg#share-on-reddit" />
                </svg>
                <div class="hint-tooltip hint-tooltip-bottom dark-theme">
                    <span>Share on Reddit</span>
                </div>
            </button>
        </section>
    `,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialShareComponent {

	url: string;

	constructor(private logger: NGXLogger) { }

	@Input('game') set game(value: Game) {
		this.logger.debug('[header] setting game', value);
		if (value) {
			this.url = `http://replays.firestoneapp.com/?reviewId=${value.reviewId}`;
		}
	}
}

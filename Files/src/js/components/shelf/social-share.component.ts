import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Game } from '../../models/game';

declare var ga: any;

@Component({
	selector: 'social-share',
	styleUrls: [
        `../../../css/component/shelf/manastorm-themes.scss`,
        `../../../css/component/shelf/manastorm-fonts.scss`,
        `../../../css/global.scss`,
        `../../../css/component/shelf/social-share.component.scss`,
    ],
	template: `
        <section class="manastorm-header-share-section">
            <p class="manastorm-header-subtitle">Share</p>
            <button 
                    class="gs-icon btn-gs-icon share-icon zero-to-heroes hint-tooltip-container" 
                    title="View your replay online"
                    (click)="viewOnline()">
                <svg>
                    <use xlink:href="/Files/assets/svg/share-icons.svg#share-on-zero-to-heroes" />
                </svg>
                <div class="hint-tooltip hint-tooltip-bottom dark-theme">
                    <span>View it online</span>
                </div>
            </button>
            <div class="gs-icon-divider"></div>
            <button 
                    class="gs-icon btn-gs-icon share-icon facebook"
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
                    class="gs-icon btn-gs-icon share-icon twitter hint-tooltip-container"
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
                    class="gs-icon btn-gs-icon share-icon reddit hint-tooltip-container"
                    shareButton="reddit"
                    [url]="url">
                <svg>
                    <use xlink:href="/Files/assets/svg/share-icons.svg#share-on-reddit hint-tooltip-container" />
                </svg>
                <div class="hint-tooltip hint-tooltip-bottom dark-theme">
                    <span>Share on Reddit</span>
                </div>
            </button>
            <div class="gs-icon-divider"></div>
            <button class="gs-icon btn-gs-icon menu">
                <svg>
                    <use xlink:href="/Files/assets/svg/ui-icons.svg#hamburger-menu" />
                </svg>
            </button>
        </section>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialShareComponent {

    url: string;
    viewUrl: string;

    private _game: Game;

    constructor(private logger: NGXLogger) { }

	@Input('game') set game(value: Game) {
		this.logger.debug('[header] setting game', value);
        this._game = value;
        if (value) {
            this.discussUrl = `https://www.zerotoheroes.com/r/hearthstone/${value.reviewId}`;
            this.url = `http://replays.firestoneapp.com/?reviewId=${value.reviewId}`;
        }
    }

    viewOnline() {
        ga('send', 'event', 'share', 'zetoh');
        window.open(this.viewUrl, '_blank');
    }
}

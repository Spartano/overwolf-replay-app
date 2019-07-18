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
                    class="gs-icon share-icon zero-to-heroes" 
                    title="View your replay online"
                    (click)="viewOnline()">
                <svg>
                    <use xlink:href="/Files/assets/svg/share-icons.svg#share-on-zero-to-heroes" />
                </svg>
            </button>
            <button 
                    class="gs-icon share-icon twitter"
                    shareButton="twitter"
                    [url]="url">
                <svg>
                    <use xlink:href="/Files/assets/svg/share-icons.svg#share-on-twitter" />
                </svg>
            </button>
            <button 
                    class="gs-icon share-icon reddit"
                    shareButton="reddit"
                    [url]="url">
                <svg>
                    <use xlink:href="/Files/assets/svg/share-icons.svg#share-on-reddit" />
                </svg>
            </button>
            <button 
                    class="gs-icon share-icon facebook"
                    shareButton="facebook"
                    [url]="url">
                <svg>
                    <use xlink:href="/Files/assets/svg/share-icons.svg#share-on-facebook" />
                </svg>
            </button>
            <button class="gs-icon menu">
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

    private _game: Game;

    constructor(private logger: NGXLogger) { }

	@Input('game') set game(value: Game) {
		this.logger.debug('[header] setting game', value);
        this._game = value;
        if (value) {
            this.url = this.buildUrl(value);
        }
    }

    viewOnline() {
        ga('send', 'event', 'share', 'zetoh');
        window.open(this.url, '_blank');
    }

    private buildUrl(game: Game) {
        return `https://www.zerotoheroes.com/r/hearthstone/${game.reviewId}`;
    }
}

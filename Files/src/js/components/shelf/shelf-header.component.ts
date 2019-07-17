import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Game } from '../../models/game';

@Component({
	selector: 'shelf-header',
	styleUrls: [
        `../../../css/component/shelf/manastorm-themes.scss`,
        `../../../css/component/shelf/manastorm-fonts.scss`,
        `../../../css/global.scss`,
        `../../../css/component/shelf/header.component.scss`,
    ],
	template: `
        <header class="manastorm-header">
            <h1 class="manastorm-header-title">{{title}}</h1>
            <section class="manastorm-header-share-section">
                <p class="manastorm-header-subtitle">Share</p>
                <button class="gs-icon share-icon zero-to-heroes">
                    <svg>
                        <use xlink:href="/Files/assets/svg/share-icons.svg#share-on-zero-to-heroes" />
                    </svg>
                </button>
                <button class="gs-icon share-icon twitter">
                    <svg>
                        <use xlink:href="/Files/assets/svg/share-icons.svg#share-on-twitter" />
                    </svg>
                </button>
                <button class="gs-icon share-icon reddit">
                    <svg>
                        <use xlink:href="/Files/assets/svg/share-icons.svg#share-on-reddit" />
                    </svg>
                </button>
                <button class="gs-icon menu">
                    <svg>
                        <use xlink:href="/Files/assets/svg/ui-icons.svg#hamburger-menu" />
                    </svg>
                </button>
            </section>
        </header>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShelfHeaderComponent {

    title: string;
	
    private _game: Game;

    constructor(private logger: NGXLogger) { }

	@Input('game') set game(value: Game) {
		this.logger.debug('[header] setting game', value);
        this._game = value;
        this.title = this.buildTitle(value);
    }
    
    private buildTitle(game: Game) {
        return game && `${game.player.name} Vs. ${game.opponent.name}`;
    }
}

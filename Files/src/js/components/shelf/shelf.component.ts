import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';

import { Game } from '../../models/game';
import { ShelfApiService } from '../../services/shelf/shelf-api.service';
import { NGXLogger } from 'ngx-logger';

@Component({
	selector: 'manastorm-shelf',
	styleUrls: [
        `../../../css/component/shelf/manastorm-themes.scss`,
        `../../../css/component/shelf/manastorm-fonts.scss`,
        `../../../css/global.scss`,
        `../../../css/component/shelf/shelf.component.scss`,
    ],
	template: `
        <div class="manastorm-shelf light-theme">
            <shelf-header [game]="selectedGame"></shelf-header>
            <game-replay [game]="selectedGame"></game-replay>
		</div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShelfComponent implements OnInit {
	
    selectedGame: Game;

    constructor(
            private shelfApi: ShelfApiService, 
            private logger: NGXLogger,
            private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.shelfApi.currentGame.subscribe(game => {
            this.logger.info('[shelf] Updating current game', game, this.selectedGame);
            this.selectedGame = game;
            this.cdr.detectChanges();
        });
    }
}

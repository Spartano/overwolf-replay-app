import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';

import { Game } from '../../models/game';
import { ShelfApiService } from '../../services/shelf/shelf-api.service';
import { NGXLogger } from 'ngx-logger';
import { ShelfStoreService } from '../../services/shelf/store/shelf-store.service';
import { ShelfState } from '../../models/shelf/shelf-state';
import { ShelfApiListenerService } from '../../services/shelf/shelf-api-listener.service';

@Component({
	selector: 'manastorm-shelf',
	styleUrls: [
		`../../../css/component/shelf/manastorm-themes.scss`,
		`../../../css/component/shelf/manastorm-fonts.scss`,
		`../../../css/global.scss`,
		`../../../css/component/shelf/shelf.component.scss`,
	],
	template: `
        <div class="manastorm-shelf light-theme" *ngIf="state">
			<shelf-header *ngIf="state.currentGame"
					[game]="state.currentGame"
					[user]="state.user"
					[menu]="state.settingsMenu">
			</shelf-header>
            <game-replay [game]="state.currentGame"></game-replay>
		</div>
    `,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShelfComponent implements OnInit {

	state: ShelfState;

	constructor(
			private store: ShelfStoreService,
			private init_ShelfApiListenerService: ShelfApiListenerService,
			private logger: NGXLogger,
			private cdr: ChangeDetectorRef) { }

	ngOnInit() {
		this.store.onStateChanged((newState: ShelfState) => {
			this.logger.info('[shelf] Updating current state', newState);
			this.state = newState;
			this.cdr.detectChanges();
		});
	}
}

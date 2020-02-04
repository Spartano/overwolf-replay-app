import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ShelfState } from '../../models/shelf/shelf-state';
import { DebugService } from '../../services/debug.service';
import { ShelfApiService } from '../../services/shelf/shelf-api.service';
import { ShelfStoreService } from '../../services/shelf/store/shelf-store.service';

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
			<shelf-header class="ignored-wrapper" [game]="state.currentGame" [menu]="state.settingsMenu"> </shelf-header>
			<game-replay class="ignored-wrapper" [game]="state.currentGame"></game-replay>
			<empty-state class="ignored-wrapper" [error]="state.globalError"></empty-state>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShelfComponent implements OnInit {
	state: ShelfState;

	constructor(
		private store: ShelfStoreService,
		private init_shelfApi: ShelfApiService,
		private init_debug: DebugService,
		private logger: NGXLogger,
		private cdr: ChangeDetectorRef,
	) {}

	ngOnInit() {
		this.logger.debug('[shelf] subscribing to store', this.store);
		this.store.onStateChanged((newState: ShelfState) => {
			this.logger.debug('[shelf] Updating current state');
			this.state = newState;
			this.cdr.detectChanges();
		});
	}
}

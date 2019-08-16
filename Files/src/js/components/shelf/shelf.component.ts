import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ShelfState } from '../../models/shelf/shelf-state';
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
			<shelf-header class="ignored-wrapper" [game]="state.currentGame" [user]="state.user" [menu]="state.settingsMenu">
			</shelf-header>
			<login-modal class="ignored-wrapper" [info]="state.loginModalInfo"> </login-modal>
			<game-replay class="ignored-wrapper" [game]="state.currentGame"></game-replay>
			<empty-state class="ignored-wrapper" [error]="state.globalError" [user]="state.user"></empty-state>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShelfComponent implements OnInit {
	state: ShelfState;

	constructor(
		private store: ShelfStoreService,
		private init_shelfApi: ShelfApiService,
		private logger: NGXLogger,
		private cdr: ChangeDetectorRef,
	) {}

	ngOnInit() {
		this.store.onStateChanged((newState: ShelfState) => {
			this.logger.info('[shelf] Updating current state', newState, newState.loginModalInfo.toggled);
			this.state = newState;
			this.cdr.detectChanges();
		});
	}
}

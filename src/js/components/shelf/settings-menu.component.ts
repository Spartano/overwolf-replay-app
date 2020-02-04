import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { SettingsMenu } from '../../models/shelf/settings-menu';
import { SettingsMenuToggleEvent } from '../../services/shelf/store/events/settings-menu-toggle-event';
import { ShelfStoreService } from '../../services/shelf/store/shelf-store.service';

@Component({
	selector: 'settings-menu',
	styleUrls: [
		`../../../css/component/shelf/manastorm-themes.scss`,
		`../../../css/component/shelf/manastorm-fonts.scss`,
		`../../../css/global.scss`,
		`../../../css/component/shelf/manastorm-modal.scss`,
		`../../../css/component/shelf/settings-menu.component.scss`,
	],
	template: `
		<header class="settings-menu-container">
			<button class="gs-icon btn-gs-icon menu" (click)="toggle()" [ngClass]="{ 'toggled': toggled }">
				<svg>
					<use xlink:href="/Files/assets/svg/ui-icons.svg#hamburger-menu" />
				</svg>
			</button>
			<div class="modal-wrapper modal-wrapper-settings-menu" [ngClass]="{ 'active': toggled }">
				<div class="modal-inner settings-menu">
					<ul class="settings-menu-list">
						<li>
							<a target="_blank" href="https://discord.gg/suKNN92">Help</a>
						</li>
						<li>
							<a target="_blank" href="https://discord.gg/suKNN92">Report a bug</a>
						</li>
					</ul>
				</div>
			</div>
		</header>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsMenuComponent {
	toggled: boolean;

	constructor(private logger: NGXLogger, private store: ShelfStoreService) {}

	@Input('menu') set menu(value: SettingsMenu) {
		this.logger.debug('[settings-menu] setting menu', value);
		this.toggled = value.toggled;
	}

	toggle() {
		this.store.publishEvent(new SettingsMenuToggleEvent());
	}
}

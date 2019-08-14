import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { SettingsMenu } from '../../models/shelf/settings-menu';
import { User } from '../../models/shelf/user';
import { LoginModalToggleEvent } from '../../services/shelf/store/events/login-modal-toggle-event';
import { LogoutEvent } from '../../services/shelf/store/events/logout-event';
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
					<header class="settings-menu-header divided" *ngIf="loggedIn">
						<h1 class="settings-menu-header-title">Connected as</h1>
						<h2 class="settings-menu-header-subtitle">
							<strong>{{ username }}</strong>
						</h2>
					</header>
					<ul class="settings-menu-list" [ngClass]="{ 'logged-in': loggedIn }">
						<li *ngIf="loggedIn">
							<a target="_blank" href="{{ profileUrl }}">My profile</a>
						</li>
						<li>
							<a target="_blank" href="https://discord.gg/suKNN92">Help</a>
						</li>
						<li>
							<a target="_blank" href="https://discord.gg/suKNN92">Report a bug</a>
						</li>
						<li class="divided" *ngIf="loggedIn" (click)="logout()">
							<a class="log-in-button">Log out</a>
						</li>
						<li class="divided" *ngIf="!loggedIn" (click)="login()">
							<a class="log-in-button">Log in</a>
						</li>
					</ul>
				</div>
			</div>
		</header>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsMenuComponent {
	loggedIn: boolean;
	username: string;
	profileUrl: string;
	toggled: boolean;

	constructor(private logger: NGXLogger, private store: ShelfStoreService) {}

	@Input('user') set user(value: User) {
		this.logger.debug('[settings-menu] setting user', value);
		this.loggedIn = value.loggedIn;
		this.username = value.username;
		this.profileUrl = value.username ? `http://www.zerotoheroes.com/u/${value.username}/hearthstone/profile` : undefined;
	}

	@Input('menu') set menu(value: SettingsMenu) {
		this.logger.debug('[settings-menu] setting menu', value);
		this.toggled = value.toggled;
	}

	toggle() {
		this.store.publishEvent(new SettingsMenuToggleEvent());
	}

	login() {
		this.store.publishEvent(new LoginModalToggleEvent(true, 'sign-up'));
	}

	logout() {
		this.store.publishEvent(new LogoutEvent());
	}
}

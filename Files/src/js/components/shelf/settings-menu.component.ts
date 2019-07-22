import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewRef } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

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
			<button class="gs-icon btn-gs-icon menu" 
					(click)="toggle()" 
					[ngClass]="{ 'toggled': toggled}">
                <svg>
                    <use xlink:href="/Files/assets/svg/ui-icons.svg#hamburger-menu" />
                </svg>
			</button>
			<div class="modal-wrapper modal-wrapper-settings-menu" *ngIf="toggled"
					[ngClass]="{ 'active': toggled}">
				<div class="modal-inner settings-menu">
					<header class="settings-menu-header divided" *ngIf="loggedIn">
						<h1 class="settings-menu-header-title">Connected as</h1>
						<h2 class="settings-menu-header-subtitle"><strong>{{username}}</strong></h2>
					</header>
					<ul class="settings-menu-list">
						<li *ngIf="loggedIn">
							<a target="_blank" href="#">My profile</a>
						</li>
						<li>
							<a target="_blank" href="https://discord.gg/suKNN92">Help</a>
						</li>
						<li>
							<a target="_blank" href="https://discord.gg/suKNN92">Report a bug</a>
						</li>
						<li class="divided" *ngIf="loggedIn">
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
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsMenuComponent {

	loggedIn = false;
	username: string;

	toggled = false;

	constructor(private logger: NGXLogger, private cdr: ChangeDetectorRef) { }

	toggle() {
		this.toggled = !this.toggled;
		if (!(<ViewRef>this.cdr).destroyed) {
			this.cdr.detectChanges();
		}
	}

	login() {
		this.logger.debug('[settings-menu] showing login window');
	}
}

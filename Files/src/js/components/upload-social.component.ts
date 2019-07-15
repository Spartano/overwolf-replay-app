import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Game } from '../models/game';
import { Preferences } from '../models/preferences';
import { Events } from '../services/events.service';
import { UserPreferences } from '../services/user-preferences.service';

@Component({
	selector: 'upload-social',
	styleUrls: [
		`../../css/global/_vars.scss`,
		`../../css/global/fonts.scss`,
		`../../css/global/forms.scss`,
		`../../css/global/modal-inner.scss`,
		`../../css/global/modal-window.scss`,
		`../../css/global/tooltip.scss`,
		`../../css/global/component-global.scss`,
		`../../css/component/upload-social.component.scss`,
	],
	template: `
		<div class="upload-social-container" *ngIf="sharingInProgress && game">
			<div class="modal modal-uploading active">
				<div class="modal-window modal-window-uploading">

					<i class="cloud-icon">
						<i class="cloud-sun">
							<svg class="cloud-sun-bg">
								<use xlink:href="/Files/assets/svg/sprite.svg#cloud-sun-bg" />
							</svg>

							<svg>
								<use xlink:href="/Files/assets/svg/sprite.svg#cloud-sun" />
							</svg>
						</i>

						<svg>
							<use xlink:href="/Files/assets/svg/sprite.svg#cloud" />
						</svg>
					</i>

					<h1>Ready to share!</h1>
					<sharing-zone [game]="game"></sharing-zone>

					<footer>
						<form class="form-classic">
							<fieldset>
								<input type="checkbox" name="auto-upload" id="auto-upload" [(ngModel)]="autoUpload" (change)="updatePreference()" hidden checked/>
								<label class="" for="auto-upload">
									<p class="settings-p">Automaticaly upload my replays to my account</p>
									<b></b>
								</label>
							</fieldset>
						</form>
					</footer>

					<button class="window-control window-control-close" (click)="close()">
						<svg class="svg-icon-fill">
							<use xlink:href="/Files/assets/svg/sprite.svg#window-control_close" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	`,
})

export class UploadSocialComponent {

	// @Output() close = new EventEmitter();
	@Input() game;

	sharingInProgress = false;
	
	private autoUpload = true;

	constructor(
		private events: Events,
		private userPreferences: UserPreferences) {

		this.events.on(Events.START_SHARING_AFTER_UPLOAD).subscribe(
			(data) => {
				this.sharingInProgress = true;
			}
		)

		this.autoUpload = this.userPreferences.isAutoUpload() === undefined ? true : this.userPreferences.isAutoUpload();
		this.userPreferences.setAutoUpload(this.autoUpload);
	}

	private updatePreference() {
		console.log('preference is now', this.autoUpload);
		this.userPreferences.setAutoUpload(this.autoUpload);
	}

	private close() {
		this.sharingInProgress = false;
	}

}

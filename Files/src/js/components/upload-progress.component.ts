import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Game } from '../models/game';
import { Preferences } from '../models/preferences';
import { Events } from '../services/events.service';
import { FileUploadService } from '../services/file-upload.service';
import { GameUploadService } from '../services/game-upload.service';
import { UserPreferences } from '../services/user-preferences.service';

@Component({
	selector: 'upload-progress',
	styleUrls: [
		`../../css/global/_vars.scss`,
		`../../css/global/fonts.scss`,
		`../../css/global/forms.scss`,
		`../../css/global/modal-inner.scss`,
		`../../css/global/modal-window.scss`,
		`../../css/global/tooltip.scss`,
		`../../css/global/component-global.scss`,
		`../../css/component/upload-progress.component.scss`,
	],
	template: `
		<div class="upload-progress-container" *ngIf="uploadInProgress">
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

					<h1>Upload In Progress</h1>
					<p>Uploading your game to Zero to Heroes<br />so you can share it with your friends</p>

					<progress class="uploading-progress" value="{{ currentStep() * 100.0 / 6.0 }}" max="100"></progress>
					<span class="progress-text">Uploading [{{ currentStep() }} / 6]: {{ currentStepLabel() }}</span>

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

					<button class="window-control window-control-close" (click)="closeWindow()">
						<svg class="svg-icon-fill">
							<use xlink:href="/Files/assets/svg/sprite.svg#window-control_close" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	`,
})

export class UploadProgressComponent {

	@Output() close = new EventEmitter();

	private uploadInProgress = false;
	private uploadStatus: string;
	private autoUpload = true;
	private game: Game;

	constructor(
		private events: Events,
		private upload: GameUploadService,
		private fileUpload: FileUploadService,
		private userPreferences: UserPreferences,
		private changeDetector: ChangeDetectorRef) {

		// this.registerEvents();
		this.monitorUpload();

		console.log('Default preferences', new Preferences(), new Preferences().autoUpload);
		this.autoUpload = this.userPreferences.isAutoUpload() === undefined ? true : this.userPreferences.isAutoUpload();
		this.userPreferences.setAutoUpload(this.autoUpload);
	}

	private monitorUpload() {
		this.upload.uploadStatus.subscribe(
			(data) => {
				console.log('notification received', data);
				switch(data) {
					case GameUploadService.UPLOAD_STARTED:
						this.uploadInProgress = true;
						this.uploadStatus = 'UPLOAD_STARTED';
						this.changeDetector.detectChanges();
						break;
					case GameUploadService.EMPTY_SHELL_CREATED:
						this.uploadStatus = 'EMPTY_SHELL_CREATED';
						this.changeDetector.detectChanges();
						break;
					case GameUploadService.RETRIEVED_BINARY_FILE:
						this.uploadStatus = 'RETRIEVED_BINARY_FILE';
						this.changeDetector.detectChanges();
						break;
					case GameUploadService.SENDING_GAME_REPLAY:
						this.uploadStatus = 'SENDING_GAME_REPLAY';
						this.changeDetector.detectChanges();
						break;
					case GameUploadService.GAME_REPLAY_SENT:
						this.uploadStatus = 'GAME_REPLAY_SENT';
						this.changeDetector.detectChanges();
						break;
					case GameUploadService.UPLOAD_COMPLETE:
						this.uploadInProgress = false;
						this.uploadStatus = 'PROCESSING_DONE';
						this.changeDetector.detectChanges();
						break;
					default:
						this.uploadInProgress = false;
						console.log('Unkown status', data);
				}
			}
		);
	}

	private currentStep(): number {
		switch (this.uploadStatus) {
			case 'UPLOAD_STARTED':
				return 1;
			case 'EMPTY_SHELL_CREATED':
				return 2;
			case 'RETRIEVED_BINARY_FILE':
				return 3;
			case 'SENDING_GAME_REPLAY':
				return 4;
			case 'GAME_REPLAY_SENT':
				return 5;
			case 'PROCESSING_DONE':
				return 6;
			default:
				return 0;
		}
	}

	private currentStepLabel(): string {
		switch (this.uploadStatus) {
			case 'UPLOAD_STARTED':
				return 'Upload started';
			case 'EMPTY_SHELL_CREATED':
				return 'Initial review created';
			case 'RETRIEVED_BINARY_FILE':
				return 'Replay read and ready to send';
			case 'SENDING_GAME_REPLAY':
				return 'Sending game replay';
			case 'GAME_REPLAY_SENT':
				return 'Game replay sent and being processed on the server';
			case 'PROCESSING_DONE':
				return 'Processing done, ready to share!';
			default:
				return 'Unkown status: ' + this.uploadStatus;
		}
	}

	private updatePreference() {
		console.log('preference is now', this.autoUpload);
		this.userPreferences.setAutoUpload(this.autoUpload);
	}

	private closeWindow() {
		this.close.emit(null);
	}

}

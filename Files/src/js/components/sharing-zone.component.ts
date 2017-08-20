import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ShareProvider, ShareButton } from 'ng2-sharebuttons-ow';

import { Game } from '../models/game';
import { UserPreferences } from '../services/user-preferences.service';
import { FileUploadService } from '../services/file-upload.service';

import * as $ from 'jquery';

@Component({
	selector: 'sharing-zone',
	styleUrls: [`../../css/component/sharing-zone.component.scss`],
	template: `
		<div class="sharing-zone">
			<h2>Share your replay</h2>
			<div class="share-buttons sb-buttons sb-style sb-style-colors">
				<div class="sb-button zerotoheroes">
					<button title="Share on Zero to Heroes">
						<a class="zerotoheroes" (click)="shareZetoh()">
							<img src="../assets/images/zero-to-heroes-logo.svg">
						</a>
						<div class="zth-tooltip bottom">
							<p>Watch or discuss this game online on Zero to Heroes</p>
							<svg class="tooltip-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 4">
								<polygon points="12,0 6,4 0,0 "/>
							</svg>
						</div>
					</button>
				</div>
				<div class="sb-button facebook">
					<button [shareButton]="'facebook'"
							[sbUrl]="buildUrl()"
							[sbPreHook]="uploadDoneNotifier"
							(click)="uploadBeforeSharing()">
						<i class="fa fa-facebook"></i>
						<div class="zth-tooltip bottom">
							<p>Share on Facebook</p>
							<svg class="tooltip-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 4">
								<polygon points="12,0 6,4 0,0 "/>
							</svg>
						</div>
					</button>
				</div>
				<div class="sb-button twitter">
					<button [shareButton]="'twitter'"
							[sbUrl]="buildUrl()"
							[sbTitle]="buildTitle()"
							[sbTags]="'hearthstone'"
							[sbPreHook]="uploadDoneNotifier"
							(click)="uploadBeforeSharing()">
						<i class="fa fa-twitter"></i>
						<div class="zth-tooltip bottom">
							<p>Share on Twitter</p>
							<svg class="tooltip-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 4">
								<polygon points="12,0 6,4 0,0 "/>
							</svg>
						</div>
					</button>
				</div>
				<div class="sb-button reddit">
					<button [shareButton]="'reddit'"
							[sbUrl]="buildUrl()"
							[sbTitle]="buildTitle()"
							[sbVia]="'hearthstone'"
							[sbPreHook]="uploadDoneNotifier"
							(click)="uploadBeforeSharing()">
						<i class="fa fa-reddit"></i>
						<div class="zth-tooltip bottom">
							<p>Share on Reddit</p>
							<svg class="tooltip-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 4">
								<polygon points="12,0 6,4 0,0 "/>
							</svg>
						</div>
					</button>
				</div>
			</div>

			<div class="share-announcement zth-popup" *ngIf="!userPreferences.isDontAskAutoUpload() && !wasAutoUpload">
				<h1>Share your replays!</h1>
				<div class="close-popup" (click)="closeAnnouncement()">x</div>
				<p>We have listened to your requests. And you can now easily share your replays, hooray!</p>
				<p>Your games will be uploaded to the Zero to Heroes website for you to share at any moment.</p>
				<p>Have more requests or suggestions? Talk to us!</p>
				<div>
					<input type="checkbox" [checked]="userPreferences.isAutoUpload()" (change)="toggleAutoUpload()" id="autoUpload">
					<label for="autoUpload">Automatically upload my games so they'll be ready to share <span class="normal">(you can change this in the Game Session Summary's preferences - TODO)</span></label>
				</div>
			</div>

			<div class="upload-status zth-popup" *ngIf="uploadInProgress === true">
				<h1>Upload in progress</h1>
				<div class="close-popup" (click)="uploadInProgress = false">x</div>
				<p>We are uploading your game to the Zero to Heroes website so you can share it with your friends.</p>
				<p>You can opt in to automatically upload all of your games from your preferences, which will make it even easier to share games, and will allow you to benefit from all our future improvements, like stats and overall win rates.</p>
				<div class="zth-progress">
					<div class="background"></div>
					<div class="done" [ngStyle]="{ 'width': currentStep() * 100.0 / 6.0 + '%' }"></div>
					<div class="progress-text">Uploading [{{ currentStep() }} / 6]: {{ currentStepLabel() }}</div>
				</div>
			</div>
		</div>
	`,
})

export class SharingZoneComponent {

	@Input() game: Game;

	uploadDoneNotifier: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	private wasAutoUpload = false;

	private uploadInProgress = false;
	private uploadStatus: string;
	private handlingZetoh = false;

	constructor(
		private fileUpload: FileUploadService,
		private userPreferences: UserPreferences,
		private changeDetector: ChangeDetectorRef) {

		this.wasAutoUpload = this.userPreferences.isAutoUpload();
	}

	private uploadBeforeSharing() {
		if (this.game.reviewId) {
			this.uploadDoneNotifier.next(true);
		}
		else {
			let monitor = new BehaviorSubject<string>('');

			monitor.subscribe((status) => {
				this.uploadStatus = status;
				switch (status) {
					case 'UPLOAD_STARTED':
						this.uploadInProgress = true;
						this.changeDetector.detectChanges();
						break;
					case 'EMPTY_SHELL_CREATED':
						console.debug('empty shell created');
						this.changeDetector.detectChanges();
						break;
					case 'RETRIEVED_BINARY_FILE':
						console.debug('retrieved binary file');
						this.changeDetector.detectChanges();
						break;
					case 'SENDING_GAME_REPLAY':
						console.debug('sending game replay');
						this.changeDetector.detectChanges();
						break;
					case 'GAME_REPLAY_SENT':
						console.debug('game replay sent');
						this.changeDetector.detectChanges();
						this.checkProcessingProgress(monitor);
						break;
					case 'PROCESSING_DONE':
						console.debug('processing done', this.buildUrl());
						this.changeDetector.detectChanges();
						this.uploadInProgress = false;
						this.uploadDoneNotifier.next(true);
						break;
					case '':
						this.changeDetector.detectChanges();
						this.uploadInProgress = false;
						break;
					default:
						console.error('error during upload', status);
						break;
				}
			});

			monitor.next('UPLOAD_STARTED');

			// Then upload the game
			this.fileUpload.uploadFromPath(this.game.path, this.game, monitor);
		}
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

	private checkProcessingProgress(monitor: BehaviorSubject<string>) {
		console.debug('checking processing progress');
		this.fileUpload.getRemoteReview(this.game.reviewId, (result) => {
			let review = JSON.parse(result._body);
			console.log('result', review.published);
			if (review.published === true) {
				monitor.next('PROCESSING_DONE');
			}
			else {
				setTimeout(() => {
					this.checkProcessingProgress(monitor);
				},
				1000);
			}
		})
	}

	private shareZetoh() {
		this.handlingZetoh = true;
		this.uploadDoneNotifier.subscribe((status) => {
			if (this.handlingZetoh && status) {
				this.handlingZetoh = false;
				window.open(this.buildUrl(), '_blank');
			}
		})
		this.uploadBeforeSharing();
	}

	private buildUrl(): string {
		return 'http://www.zerotoheroes.com/r/hearthstone/' + this.game.reviewId;
	}

	private buildTitle(): string {
		return 'Need help! ' + this.game.player.class + ' vs ' + this.game.opponent.class;
	}

	private toggleAutoUpload() {
		this.userPreferences.setAutoUpload(!this.userPreferences.isAutoUpload());
	}

	private closeAnnouncement() {
		this.userPreferences.setDontAskAutoUpload(true);
	}
}

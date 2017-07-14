import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ShareProvider, ShareButton } from 'ng2-sharebuttons';

import { Game } from '../models/game';
import { FileUploadService } from '../services/file-upload.service';

declare var $: any;

@Component({
	selector: 'sharing-zone',
	styleUrls: [`css/component/sharing-zone.component.css`],
	template: `
		<div class="sharing-zone">
			<h2>Share your replay</h2>
			<div class="share-buttons sb-buttons sb-style sb-style-colors">
				<div class="sb-button zerotoheroes">
					<button title="Share on Zero to Heroes">
						<a class="zerotoheroes" (click)="shareZetoh()">
							<img src="static/images/zero-to-heroes-logo.svg">
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

			<div id="uploadProgressPopin">
				Upload ongoing
			</div>
		</div>
	`,
})

export class SharingZoneComponent {

	@Input() game: Game;

	uploadDoneNotifier: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	private handlingZetoh = false;

	constructor(private fileUpload: FileUploadService) {

	}

	private uploadBeforeSharing() {
		if (this.game.reviewId) {
			this.uploadDoneNotifier.next(true);
		}
		else {
			let monitor = new BehaviorSubject<string>('');

			monitor.subscribe((status) => {
				switch (status) {
					case 'EMPTY_SHELL_CREATED':
						console.debug('empty shell created');
						break;
					case 'RETRIEVED_BINARY_FILE':
						console.debug('retrieved binary file');
						break;
					case 'SENDING_GAME_REPLAY':
						console.debug('sending game replay');
						break;
					case 'GAME_REPLAY_SENT':
						console.debug('game replay sent');
						this.checkProcessingProgress(monitor);
						break;
					case 'PROCESSING_DONE':
						console.debug('processing done');
						this.uploadDoneNotifier.next(true);
						break;
					case '':
						break;
					default:
						console.error('error during upload', status);
						break;
				}
			});

			// Then upload the game
			this.fileUpload.uploadFromPath(this.game.path, this.game, monitor);
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
}

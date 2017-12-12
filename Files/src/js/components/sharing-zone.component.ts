import { Component, Input, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ShareProvider, ShareButton } from 'ng2-sharebuttons-ow';

import { Game } from '../models/game';
import { GameUploadService } from '../services/game-upload.service';

@Component({
	selector: 'sharing-zone',
	styleUrls: [
		`../../css/global/_vars.scss`,
		`../../css/component/sharing-zone.component.scss`,
	],
	template: `
		<div class="sharing-zone">
			<!--<h2>Share your replay</h2>-->
			<div class="share-buttons sb-buttons sb-style sb-style-colors tooltip-container">
				<div class="sb-button zerotoheroes">
					<button title="Share on Zero to Heroes">
						<a class="zerotoheroes" (click)="shareZetoh()">
							<img src="../assets/images/zero-to-heroes-logo.svg">
						</a>
						<div class="zth-tooltip bottom">
							<p>Watch or discuss this game online on Zero to Heroes</p>
							<svg class="tooltip-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 4">
								<polygon points="12,0 6,-4 0,0 "/>
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
								<polygon points="12,0 6,-4 0,0 "/>
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
								<polygon points="12,0 6,-4 0,0 "/>
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
								<polygon points="12,0 6,-4 0,0 "/>
							</svg>
						</div>
					</button>
				</div>
			</div>
		</div>
	`,
})

export class SharingZoneComponent {

	@Input() game: Game;

	uploadDoneNotifier: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	private handlingZetoh = false;

	constructor(private upload: GameUploadService) {
	}

	private uploadBeforeSharing() {
		this.upload.upload(this.game);
		this.upload.uploadStatus.subscribe(
			(data) => {
				if (data === GameUploadService.UPLOAD_COMPLETE) {
					console.log('Upload complete!')
					this.uploadDoneNotifier.next(true);
					// Reset
					this.uploadDoneNotifier.next(false);
				}
			}
		);
	}

	private shareZetoh() {
		console.log('sharing on Zetoh');
		if (this.handlingZetoh) {
			return;
		}
		this.handlingZetoh = true;
		this.uploadDoneNotifier.subscribe((status) => {
			console.log('upload done', status, this.handlingZetoh);
			if (this.handlingZetoh && status) {
				this.handlingZetoh = false;
				let url = this.buildUrl();
				console.log('opening in new window', url);
				window.open(url, '_blank');
			}
		})
		this.uploadBeforeSharing();
	}

	private buildUrl(): string {
		return 'https://www.zerotoheroes.com/r/hearthstone/' + this.game.reviewId;
	}

	private buildTitle(): string {
		return 'Need help! ' + this.game.player.class + ' vs ' + this.game.opponent.class;
	}
}

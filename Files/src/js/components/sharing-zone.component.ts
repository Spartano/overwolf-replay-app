import { Component, Input, Output, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ShareProvider, ShareButton } from 'ng2-sharebuttons-ow';

import { Game } from '../models/game';
import { GameUploadService } from '../services/game-upload.service';
import { SharingService } from '../services/sharing.service';
import { Events } from '../services/events.service';

declare var ga: any;

@Component({
	selector: 'sharing-zone',
	styleUrls: [
		`../../css/global/_vars.scss`,
		`../../css/global/component-global.scss`,
		`../../css/component/sharing-zone.component.scss`,
	],
	template: `
		<div class="sharing-zone">
			<div class="share-buttons sb-buttons sb-style sb-style-colors tooltip-container">
				<div class="sb-button zerotoheroes">
					<button title="Share on Zero to Heroes" (click)="shareZetoh()">
						<svg class="svg-icon-fill">
							<use xlink:href="/Files/assets/svg/sprite.svg#social-icon_zero-to-heroes"></use>
						</svg>
						<div class="zth-tooltip bottom">
							<p>Watch this game on Zero to Heroes</p>
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
							(click)="uploadBeforeSharing('facebook')">
						<svg class="svg-icon-fill">
							<use xlink:href="/Files/assets/svg/sprite.svg#social-icon_facebook"></use>
						</svg>
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
							(click)="uploadBeforeSharing('twitter')">
						<svg class="svg-icon-fill">
							<use xlink:href="/Files/assets/svg/sprite.svg#social-icon_twitter"></use>
						</svg>
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
							(click)="uploadBeforeSharing('reddit')">
						<svg class="svg-icon-fill">
							<use xlink:href="/Files/assets/svg/sprite.svg#social-icon_reddit"></use>
						</svg>
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

	@Input() _game: Game;

	uploadDoneNotifier: BehaviorSubject<boolean>;

	constructor(private upload: GameUploadService, private share: SharingService, private events: Events) {
		this.uploadDoneNotifier = this.share.uploadDoneNotifier;
	}

	@Input('game') set game(game: Game) {
		this._game = game;
		this.share.init(game);
	}

	uploadBeforeSharing(social: string) {
		ga('send', 'event', 'share', social);
		this.share.uploadBeforeSharing();
	}

	shareZetoh() {
		ga('send', 'event', 'share', 'zetoh');
		this.share.shareZetoh();
	}

	buildUrl(): string {
		return 'https://www.zerotoheroes.com/r/hearthstone/' + this._game.reviewId;
	}

	buildTitle(): string {
		return 'Need help! ' + this._game.player.class + ' vs ' + this._game.opponent.class;
	}
}

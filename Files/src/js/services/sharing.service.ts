import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { GameUploadService } from '../services/game-upload.service';
import { Events } from '../services/events.service';

import { Game } from '../models/game';

@Injectable()
export class SharingService {
	public uploadDoneNotifier: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	private game: Game;

	private handlingZetoh = false;
	private subscribedUploadDone = false;
	private subscribedUploadStatus = false;
	private reviewId = null;

	constructor(private upload: GameUploadService, private events: Events) {
		console.log('building sharing service');
	}

	public init(game: Game) {
		if (game === this.game) {
			return;
		}

		console.log('init sharing service', game);
		// this.uploadDoneNotifier = new BehaviorSubject<boolean>(false)

		this.handlingZetoh = false;
		this.subscribedUploadDone = false;
		this.subscribedUploadStatus = false;

		this.game = game;
		this.reviewId = this.game.reviewId;
	}

	public uploadBeforeSharing() {
		this.reviewId = this.game.reviewId;
		console.log('in uploadBeforeSharing', this.subscribedUploadStatus, this.reviewId, this.game);

		if (!this.subscribedUploadStatus) {
			console.log('subscribing to uploadStatus', this.upload.uploadStatus);
			this.subscribedUploadStatus = true;
			this.upload.uploadStatus.subscribe(data => {
				if (data === GameUploadService.UPLOAD_COMPLETE) {
					console.log('Upload complete!', this.game.reviewId, this.reviewId);
					if (this.reviewId) {
						// console.log('notifying subscriptions', this.uploadDoneNotifier);
						this.uploadDoneNotifier.next(true);
						// Reset
						// console.log('resetting subscriptions', this.uploadDoneNotifier);
						this.uploadDoneNotifier.next(false);
					} else if (!this.reviewId) {
						console.log('Upload complete, showing sharing popup!');
						this.events.broadcast(Events.START_SHARING_AFTER_UPLOAD);
					}
					this.handlingZetoh = false;
				}
			});
		}
		this.upload.upload(this.game);
	}

	public shareZetoh() {
		console.log('sharing on Zetoh', this.handlingZetoh);
		if (this.handlingZetoh) {
			return;
		}
		this.handlingZetoh = true;
		console.log('handling zetoh', this.subscribedUploadDone);
		if (!this.subscribedUploadDone) {
			this.subscribedUploadDone = true;
			console.log('subscribing to uploadDoneNotifier');
			this.uploadDoneNotifier.subscribe(status => {
				if (this.handlingZetoh && status) {
					console.log('upload done', status, this.handlingZetoh);
					this.handlingZetoh = false;
					const url = this.buildUrl();
					console.log('opening in new window', url);
					window.open(url, '_blank');
					// this.uploadDoneNotifier.unsubscribe();
				}
			});
		}
		this.uploadBeforeSharing();
	}

	private buildUrl(): string {
		return 'https://www.zerotoheroes.com/r/hearthstone/' + this.game.reviewId;
	}
}

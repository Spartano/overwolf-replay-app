import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Game } from '../models/game';
import { FileUploadService } from '../services/file-upload.service';

@Injectable()
export class GameUploadService {
	public static readonly UPLOAD_COMPLETE = 'UPLOAD_COMPLETE';
	public static readonly UPLOAD_STARTED = 'UPLOAD_STARTED';
	public static readonly EMPTY_SHELL_CREATED = 'EMPTY_SHELL_CREATED';
	public static readonly RETRIEVED_BINARY_FILE = 'RETRIEVED_BINARY_FILE';
	public static readonly SENDING_GAME_REPLAY = 'SENDING_GAME_REPLAY';
	public static readonly GAME_REPLAY_SENT = 'GAME_REPLAY_SENT';

	uploadStatus: BehaviorSubject<string> = new BehaviorSubject<string>('initialStatus');

	constructor(private fileUpload: FileUploadService) {}

	public upload(game: Game) {
		console.log('about to upload before sharing');
		if (game.reviewId) {
			console.log('game already uploaded');
			this.uploadStatus.next(GameUploadService.UPLOAD_COMPLETE);
		} else {
			const monitor = new BehaviorSubject<string>('');

			monitor.subscribe(status => {
				// this.uploadStatus = status;
				switch (status) {
					case 'UPLOAD_STARTED':
						this.uploadStatus.next(GameUploadService.UPLOAD_STARTED);
						console.log('upload started');
						break;
					case 'EMPTY_SHELL_CREATED':
						this.uploadStatus.next(GameUploadService.EMPTY_SHELL_CREATED);
						console.log('empty shell created');
						break;
					case 'RETRIEVED_BINARY_FILE':
						console.log('retrieved binary file');
						this.uploadStatus.next(GameUploadService.RETRIEVED_BINARY_FILE);
						break;
					case 'SENDING_GAME_REPLAY':
						console.log('sending game replay');
						this.uploadStatus.next(GameUploadService.SENDING_GAME_REPLAY);
						break;
					case 'GAME_REPLAY_SENT':
						console.log('game replay sent');
						this.uploadStatus.next(GameUploadService.GAME_REPLAY_SENT);
						this.checkProcessingProgress(game, monitor);
						break;
					case 'PROCESSING_DONE':
						console.log('processing done');
						this.uploadStatus.next(GameUploadService.UPLOAD_COMPLETE);
						break;
					case '':
						break;
					default:
						console.error('error during upload', status);
						break;
				}
			});

			monitor.next('UPLOAD_STARTED');

			// Then upload the game
			this.fileUpload.uploadFromPath(game.path, game, monitor);
		}
	}

	private checkProcessingProgress(game: Game, monitor: BehaviorSubject<string>) {
		console.log('checking processing progress', game);
		this.fileUpload.getRemoteReview(game.reviewId, result => {
			const review = JSON.parse(result._body);
			console.log('result', review.published);
			if (review.published === true) {
				monitor.next('PROCESSING_DONE');
			} else {
				setTimeout(() => {
					this.checkProcessingProgress(game, monitor);
				}, 1000);
			}
		});
	}
}

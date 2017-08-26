import { Injectable } from '@angular/core';
import { Http } from "@angular/http";

import * as Raven from 'raven-js';

import 'rxjs/add/operator/share';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Game } from '../models/game';
import { GameStorageService } from './game-storage.service';

declare var overwolf: any;
declare var AWS: any;


const GET_REVIEW_ENDPOINT = 'http://www.zerotoheroes.com/api/reviews/';
const REVIEW_INIT_ENDPOINT = 'http://www.zerotoheroes.com/api/hearthstone/upload/createEmptyReview/hearthstone';
const BUCKET = 'com.zerotoheroes.batch';

// const REVIEW_INIT_ENDPOINT = 'http://localhost:8080/api/hearthstone/upload/createEmptyReview/hearthstone';
// const BUCKET = 'com.zerotoheroes.test.batch';

@Injectable()
export class FileUploadService {

	constructor(private http: Http, private gameStorageService: GameStorageService) {
	}

	public getRemoteReview(reviewId: string, callback: Function) {
		this.http.get(GET_REVIEW_ENDPOINT + reviewId).subscribe((res) => {
			console.log('retrieved review', res);
			callback(res);
		});
	}

	public uploadFromPath(filePath: string, game: Game, progressMonitor?: BehaviorSubject<string>) {
		console.log('Requesting reading file from disk', filePath, Date.now());

		overwolf.profile.getCurrentUser((user) => {
			console.log('current user', user);
			let userId = user.userId || user.machineId || user.username || 'unauthenticated_user';

			// Build an empty review
			this.http.post(REVIEW_INIT_ENDPOINT, null).subscribe((res) => {
				let review = res.json();
				console.log('Created empty shell review', res, review);
				if (progressMonitor) {
					progressMonitor.next('EMPTY_SHELL_CREATED');
				}

				let bytes = game.replayBytes;
				console.log('loaded bytes', bytes);

				// http://stackoverflow.com/questions/35038884/download-file-from-bytes-in-javascript
				let byteArray = new Uint8Array(bytes);
				let blob = new Blob([byteArray], { type: 'application/zip' });
				console.log('built blob', blob);

				let fileName = this.extractFileName(filePath);
				console.log('extracted filename', fileName);
				let fileKey = fileName + Date.now() + '.hszip';
				console.log('built file key', fileKey);

				let file = new File([blob], fileKey);
				console.log('built file', file);

				// Configure The S3 Object
				AWS.config.region = 'us-west-2';
				AWS.config.httpOptions.timeout = 3600 * 1000 * 10;

				let rank = game.rank;
				if ('Arena' === game.gameMode) {
					rank = game.arenaInfo.Wins;
				}
				console.debug('setting rank', rank);
				let s3 = new AWS.S3();
				let params = {
					Bucket: BUCKET,
					Key: fileKey,
					ACL: 'public-read-write',
					Body: blob,
					Metadata: {
						'review-id': review.id,
						'application-key': 'overwolf',
						'user-key': userId,
						'file-type': 'hszip',
						'review-text': 'Created by [Overwolf](http://www.overwolf.com)',
						'game-rank': rank != 'legend' ? rank.toString() : '',
						'game-legend-rank': rank == 'legend' ? rank.toString() : '',
						'game-format': game.gameFormat,
						'game-mode': game.gameMode,
					},
				};
				console.log('uploading with params', AWS, s3, params);
				if (progressMonitor) {
					progressMonitor.next('SENDING_GAME_REPLAY');
				}
				s3.makeUnauthenticatedRequest('putObject', params, (err, data2) => {
					// There Was An Error With Your S3 Config
					if (err) {
						if (progressMonitor) {
							progressMonitor.next('ERROR_SENDING_GAME_REPLAY');
						}

						console.error('An error during upload', err);
						Raven.captureMessage('Error while sending game replay to AWS', { extra: {
							error: err,
							params: params,
						}});
					}
					else {
						console.log('Uploaded game', data2, review.id);
						game.reviewId = review.id;
						this.gameStorageService.updateGame(game);
						if (progressMonitor) {
							progressMonitor.next('GAME_REPLAY_SENT');
						}
					}
				});
			});
		});
	}

	private extractFileName(path: string) {
		return path.replace(/\\/g, '/').replace(/\s/g, '_').replace(/\(/g, '_').replace(/\)/g, '_').split('\/').pop().split('\.')[0];
	}
}

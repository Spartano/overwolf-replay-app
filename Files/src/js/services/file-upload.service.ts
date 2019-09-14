import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import S3 from 'aws-sdk/clients/s3';
import AWS from 'aws-sdk/global';
import { BehaviorSubject } from 'rxjs';
import { Game } from '../models/game';
import { GameDbService } from './game-db.service';
import { OverwolfService } from './overwolf.service';

const GET_REVIEW_ENDPOINT = 'https://nx16sjfatc.execute-api.us-west-2.amazonaws.com/prod/get-review/';
const REVIEW_INIT_ENDPOINT = 'https://husxs4v58a.execute-api.us-west-2.amazonaws.com/prod';
const BUCKET = 'com.zerotoheroes.batch';

@Injectable()
export class FileUploadService {
	constructor(private http: HttpClient, private ow: OverwolfService, private gameDb: GameDbService) {}

	public getRemoteReview(reviewId: string, callback: Function) {
		console.log('getting remove review', reviewId);
		this.http.get(GET_REVIEW_ENDPOINT + reviewId).subscribe(res => {
			console.log('retrieved review', res);
			callback(res);
		});
	}

	public async uploadFromPath(filePath: string, game: Game, progressMonitor?: BehaviorSubject<string>) {
		console.log('Requesting reading file from disk', filePath);
		const user = await this.ow.getCurrentUser();
		const userId = user.userId || user.machineId || user.username || 'unauthenticated_user';

		// Build an empty review
		this.http.post(REVIEW_INIT_ENDPOINT, null).subscribe(res => {
			const reviewId: string = res as string;
			console.log('Created empty shell review', res, reviewId);
			if (progressMonitor) {
				progressMonitor.next('EMPTY_SHELL_CREATED');
			}

			// console.log('processing game');
			const bytes = game.replayBytes;
			// console.log('loaded bytes', bytes);

			// http://stackoverflow.com/questions/35038884/download-file-from-bytes-in-javascript
			const byteArray = new Uint8Array(bytes);
			const blob = new Blob([byteArray], { type: 'application/zip' });
			// console.log('built blob', blob);

			const fileName = this.extractFileName(filePath);
			// console.log('extracted filename', fileName);
			const fileKey = this.slugify(fileName) + '_' + reviewId + '.hszip';
			console.log('built file key', fileKey);

			// Configure The S3 Object
			AWS.config.region = 'us-west-2';
			AWS.config.httpOptions.timeout = 3600 * 1000 * 10;

			let rank = game.rank;
			if ('Arena' === game.gameMode) {
				if (game.arenaInfo) {
					rank = game.arenaInfo.Wins;
				} else {
					rank = null;
				}
			}
			// console.log('setting rank', rank);
			const s3 = new S3();
			const params = {
				Bucket: BUCKET,
				Key: fileKey,
				ACL: 'public-read-write',
				Body: blob,
				Metadata: {
					'review-id': reviewId,
					'application-key': 'overwolf',
					'user-key': userId,
					'file-type': 'hszip',
					'review-text': 'Created by [Overwolf](http://www.overwolf.com)',
					'game-rank': rank && rank !== 'legend' ? rank.toString() : '',
					'game-legend-rank': rank === 'legend' ? rank.toString() : '',
					'opponent-game-rank': game.opponentRank && game.opponentRank !== 'legend' ? game.opponentRank.toString() : '',
					'opponent-game-legend-rank': game.opponentRank === 'legend' ? game.opponentRank.toString() : '',
					'game-mode': game.gameMode,
					'game-format': game.gameMode !== 'Arena' ? game.gameFormat : '',
					'deckstring': game.deckstring,
					'deck-name': game.deckName,
				},
			};
			console.log('uploading with params', params);
			if (progressMonitor) {
				progressMonitor.next('SENDING_GAME_REPLAY');
			}
			s3.makeUnauthenticatedRequest('putObject', params, async (err, data2) => {
				// There Was An Error With Your S3 Config
				if (err) {
					if (progressMonitor) {
						progressMonitor.next('ERROR_SENDING_GAME_REPLAY');
					}

					console.warn('An error during upload', err);
					// Raven.captureMessage('Error while sending game replay to AWS', { extra: {
					// 	error: err,
					// 	params: params,
					// }});
				} else {
					console.log('Uploaded game', data2, reviewId);
					game.reviewId = reviewId;
					this.gameDb.save(game);
					if (progressMonitor) {
						progressMonitor.next('GAME_REPLAY_SENT');
					}
				}
			});
		});
	}

	private extractFileName(path: string) {
		return path
			.replace(/\\/g, '/')
			.replace(/\s/g, '_')
			.replace(/\(/g, '_')
			.replace(/\)/g, '_')
			.split('/')
			.pop()
			.split('.')[0];
	}

	private slugify(str: string): string {
		return str
			.toString()
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '') // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
			.replace(/[\s_-]+/g, '_') // swap any length of whitespace, underscore, hyphen characters with a single _
			.replace(/^-+|-+$/g, ''); // remove leading, trailing -
	}
}

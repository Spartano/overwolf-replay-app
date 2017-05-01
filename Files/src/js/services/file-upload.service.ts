import { Injectable } from '@angular/core';
import { Http } from "@angular/http";

import 'rxjs/add/operator/share';

import { Game } from '../models/game';
import { GameStorageService } from './game-storage.service';

declare var OverwolfPlugin: any;
declare var overwolf: any;
declare var AWS: any;


const REVIEW_INIT_ENDPOINT = 'http://www.zerotoheroes.com/api/hearthstone/upload/createEmptyReview/hearthstone';
const BUCKET = 'com.zerotoheroes.batch';

// const REVIEW_INIT_ENDPOINT = 'http://localhost:8080/api/hearthstone/upload/createEmptyReview/hearthstone';
// const BUCKET = 'com.zerotoheroes.test.batch';

@Injectable()
export class FileUploadService {

	private plugin: any;


	constructor(private http: Http, private gameStorageService: GameStorageService) {
		this.init();
	}

	public uploadFromPath(filePath: string, game: Game) {
		console.log('Requesting reading file from disk', filePath, Date.now());

		overwolf.profile.getCurrentUser((user) => {
			console.log('current user', user);
			let userId = user.userId || user.machineId || user.username || 'unauthenticated_user';

			// Build an empty review 
			this.http.post(REVIEW_INIT_ENDPOINT, null).subscribe((res) => {
				let review = res.json();
				console.debug('Created empty shell review', res, review);

				this.plugin.get().getBinaryFile(filePath, -1, (status, data) => {
					console.debug('reading binary file', filePath, status);
					let split = data.split(',');
					let bytes = [];
					for (let i = 0; i < split.length; i++) {
						bytes[i] = parseInt(split[i]);
					}
					console.debug('built byte array', bytes);
					let fileName = this.extractFileName(filePath);
					console.debug('extracted filename', fileName);
					let fileKey = fileName + Date.now() + '.hszip';
					console.debug('built file key', fileKey);

					// http://stackoverflow.com/questions/35038884/download-file-from-bytes-in-javascript
					let byteArray = new Uint8Array(bytes);
					let blob = new Blob([byteArray], { type: 'application/zip' });
					console.debug('built blob', blob);
					let file = new File([blob], fileKey);
					console.debug('built file', file);

					// Configure The S3 Object 
					AWS.config.region = 'us-west-2';
					AWS.config.httpOptions.timeout = 3600 * 1000 * 10;

					let s3 = new AWS.S3();
					let params = {
						Bucket: BUCKET,
						Key: fileKey,
						ACL: 'public-read-write',
						Body: blob,
						Metadata: {
							'application-key': 'overwolf',
							'user-key': userId,
							'review-id': review.id,
							'review-text': 'Created by [Overwolf](http://www.overwolf.com)',
							'file-type': 'hszip',
						},
					};
					console.debug('uploading with params', AWS, s3, params);
					s3.makeUnauthenticatedRequest('putObject', params, (err, data2) => {
						// There Was An Error With Your S3 Config
						if (err) {
							console.error('An error during upload', err);
						}
						else {
							console.log('Uploaded game', data2, review.id);
							game.reviewId = review.id;
							this.gameStorageService.updateGame(game);
						}
					});
				});
			});
		});
	}

	private init() {
		this.plugin = new OverwolfPlugin("simple-io-plugin-zip", true);

		this.plugin.initialize((status: boolean) => {
			if (status === false) {
				console.error("Plugin couldn't be loaded??");
				return;
			}
			console.log("Plugin " + this.plugin.get()._PluginName_ + " was loaded!", this.plugin.get());

			this.plugin.get().onOutputDebugString.addListener(function(first, second, third) {
				console.log('received global event', first, second, third);
			});
		});
	}

	private extractFileName(path: string) {
		return path.replace(/\\/g, '/').replace(/\s/g, '_').replace(/\(/g, '_').replace(/\)/g, '_').split('\/').pop().split('\.')[0];
	}
}

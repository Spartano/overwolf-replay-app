import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import 'rxjs/add/operator/share';

declare var OverwolfPlugin: any;
declare var overwolf: any;
declare var AWS: any;

@Injectable()
export class FileUploadService {

	private plugin: any;

	private REVIEW_INIT_ENDPOINT = 'http://www.zerotoheroes.com/api/hearthstone/upload/createEmptyReview/hearthstone';
	// private REVIEW_INIT_ENDPOINT = 'http://localhost:8080/api/hearthstone/upload/createEmptyReview/hearthstone';

	private creds = {
		bucket: 'com.zerotoheroes.batch',
		access_key: 'AKIAJHSXPMPE223KS7PA',
		secret_key: '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',
	};

	constructor(private http: Http) {
		this.init();
	}

	public uploadFromPath(filePath: string) {
		console.log('Requesting reading file from disk', filePath, Date.now());

		overwolf.profile.getCurrentUser((user) => {
			console.log('current user', user);
			let userId = user.userId || user.machineId || user.username || 'unauthenticated_user';

			// Build an empty review 
			this.http.post(this.REVIEW_INIT_ENDPOINT, null).subscribe((res) => {
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
					AWS.config.update({ accessKeyId: this.creds.access_key, secretAccessKey: this.creds.secret_key });
					AWS.config.region = 'us-west-2';
					AWS.config.httpOptions.timeout = 3600 * 1000 * 10;

					let s3 = new AWS.S3({ params: { Bucket: this.creds.bucket } });
					let params = {
						Key: fileKey,
						// ContentType: 'application/zip', 
						Body: blob,
						Metadata: {
							'application-key': 'overwolf',
							'user-key': userId,
							'review-id': review.id,
							'file-type': 'hszip',
						},
					};
					console.debug('uploading with params', AWS, s3, params);

					s3.upload(params, function(err, data2) {
						// There Was An Error With Your S3 Config
						if (err) {
							console.error('An error during upload', err);
						}
						else {
							console.log('Uploaded game', data2, review.id);
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

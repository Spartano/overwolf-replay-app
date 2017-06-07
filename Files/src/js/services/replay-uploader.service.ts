import { Injectable } from '@angular/core';
import { Events } from './events.service';
import { Game } from '../models/game';
import { FileUploadService } from './file-upload.service';

@Injectable()
export class ReplayUploader {

	// private ENDPOINT = 'http://localhost:8080/api/hearthstone/upload/game/overwolf/overwolf_testing/zip'

// TODO also make sure it's created when app starts
	constructor(private events: Events, private fileUpload: FileUploadService) {
		this.init();
		console.log('init replay uploader');
	}

	private init() {
		this.events.on(Events.REPLAY_SAVED)
			.subscribe(event => {
				console.log('ReplayUploader: saved game', event.data[0]);
				let path: string = event.data[0];
				let game: Game = event.data[1];
				this.fileUpload.uploadFromPath(path, game);
			});
	}
}

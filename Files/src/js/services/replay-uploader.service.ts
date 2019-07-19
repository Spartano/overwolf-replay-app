import { Injectable } from '@angular/core';
import { Events } from './events.service';
import { Game } from '../models/game';
import { FileUploadService } from './file-upload.service';
import { UserPreferences } from './user-preferences.service';

@Injectable()
export class ReplayUploader {

	constructor(
			private events: Events,
			private fileUpload: FileUploadService,
			private userPreferences: UserPreferences) {
		console.log('starting replay uploader service');
		this.init();
	}

	private init() {
		this.events.on(Events.REPLAY_SAVED)
			.subscribe(event => {
				console.log('ReplayUploader: saved game', event.data[0]);
				const path: string = event.data[0];
				const game: Game = JSON.parse(event.data[1]);
				this.fileUpload.uploadFromPath(path, game);
			});
	}
}

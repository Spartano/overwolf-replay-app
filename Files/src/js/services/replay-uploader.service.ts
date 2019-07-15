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
				if (this.userPreferences.isAutoUpload()) {
					console.log('ReplayUploader: saved game', event.data[0]);
					let path: string = event.data[0];
					let game: Game = JSON.parse(event.data[1]);
					this.fileUpload.uploadFromPath(path, game);
				}
				else {
					console.log('Preferences set to not auto-upload, so not uploading');
				}
			});
	}
}

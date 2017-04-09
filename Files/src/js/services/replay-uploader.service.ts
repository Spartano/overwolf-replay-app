import { Injectable } from '@angular/core';
import { Events } from './events.service';
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
		this.events.on<string>(Events.REPLAY_SAVED)
			.subscribe(path => {
				console.log('ReplayUploader: saved game', path);
				// this.fileUpload.uploadFromPath('C:\\Users\\Daedin\\AppData\\Local\\Overwolf\\ZeroToHeroes\\Replays\\Daedin(paladin)_vs_The Innkeeper(warrior)_1491764147603\\replay.xml');
				this.fileUpload.uploadFromPath(path);
			});
	}
}

import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

import { Preferences } from '../models/preferences';

@Injectable()
export class UserPreferences {

	constructor(private localStorageService: LocalStorageService) {
		let preferences: Preferences = this.getPreferences();
		if (!preferences) {
			preferences = new Preferences();
		}
		this.storePreferences(preferences);
	}

	isAutoUpload(): boolean {
		 return true; // this.getPreferences().autoUpload;
	}

	setAutoUpload(value: boolean): void {
		const preferences: Preferences = this.getPreferences();
		preferences.autoUpload = value;
		this.storePreferences(preferences);
		console.log('updated preferences', preferences);
	}

	isDontAskAutoUpload(): boolean {
		 return true; // this.getPreferences().dontAskAutoUpload;
	}

	setDontAskAutoUpload(value: boolean): void {
		const preferences: Preferences = this.getPreferences();
		preferences.dontAskAutoUpload = value;
		this.storePreferences(preferences);
		console.log('updated preferences', preferences);
	}

	private getPreferences(): Preferences {
		try {
			return JSON.parse(this.localStorageService.get<string>('preferences'));
		} catch (e) {
			console.error('exception when retrieving preferences', e);
			return new Preferences();
		}
	}

	private storePreferences(preferences: Preferences) {
		this.localStorageService.set('preferences', JSON.stringify(preferences));
	}
}

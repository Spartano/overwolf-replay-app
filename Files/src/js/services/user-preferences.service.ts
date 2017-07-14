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
		this.localStorageService.set('preferences', preferences);
	}

	isAutoUpload(): boolean {
		 return this.getPreferences().autoUpload;
	}

	setAutoUpload(value: boolean): void {
		let preferences: Preferences = this.getPreferences();
		preferences.autoUpload = value;
		this.localStorageService.set('preferences', preferences);
		console.log('updated preferences', preferences);
	}

	isDontAskAutoUpload(): boolean {
		 return this.getPreferences().dontAskAutoUpload;
	}

	setDontAskAutoUpload(value: boolean): void {
		let preferences: Preferences = this.getPreferences();
		preferences.dontAskAutoUpload = value;
		this.localStorageService.set('preferences', preferences);
		console.log('updated preferences', preferences);
	}

	private getPreferences(): Preferences {
		return this.localStorageService.get<Preferences>('preferences');
	}
}

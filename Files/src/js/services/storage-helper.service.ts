import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

import { Session } from '../models/storage';
import { Game } from '../models/game';

@Injectable()
export class StorageHelperService {

	constructor(private localStorageService: LocalStorageService) {
	}

	public getSession(sessionId: string): Session {
		sessionId = sessionId || this.localStorageService.get<string>('lastSessionId');
		if (!sessionId) return null;

		console.log('getting session', sessionId);
		let session: Session = this.localStorageService.get<Session>('session-' + sessionId) || new Session();
		session.id = sessionId;

		this.localStorageService.set('session-' + sessionId, session);
		this.localStorageService.set('lastSessionId', sessionId);
		return session;
	}

	public update(session: Session): void {
		this.localStorageService.set('session-' + session.id, session);
		console.log('updated session', session);
	}
}

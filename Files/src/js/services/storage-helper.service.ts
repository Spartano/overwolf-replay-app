import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

import { Session } from '../models/storage';
import { Game } from '../models/game';

@Injectable()
export class StorageHelperService {

	constructor(private localStorageService: LocalStorageService) {
	}

	public getSession(sessionId: string): Session {
		console.log('[storage] getting session', sessionId);
		if (!sessionId) {
			console.error('[storage] We should never call getSession with a null sessionId', sessionId);
			return null;
		}

		let session: Session = this.localStorageService.get<Session>('session-' + sessionId) || new Session();
		console.log('[storage] retrieved session', session);
		session.id = sessionId;

		this.localStorageService.set('session-' + sessionId, session);
		return session;
	}

	public update(session: Session): void {
		this.localStorageService.set('session-' + session.id, session);
		console.log('[storage] updated session', session);
	}
}

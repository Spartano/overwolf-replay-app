import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { AngularIndexedDB } from 'angular2-indexeddb';

import { Session } from '../models/storage';
import { Game } from '../models/game';

declare var LZString: any;

@Injectable()
export class StorageHelperService {

	private db: AngularIndexedDB;
	private dbInit: boolean;

	constructor(private localStorageService: LocalStorageService) {
		this.init();
	}

	public getSession(sessionId: string, callback: Function) {
		if (!this.dbInit) {
			setTimeout(() => {
				console.log('[storage] db isnt initialized, waiting...');
				this.getSession(sessionId, callback);
			}, 50);
			return;
		}

		this.db.getByKey('sessions', sessionId).then(
			(session) => {
				this.localStorageService.set('lastSessionId', sessionId);
			    if (!session) {
			    	console.log('[storage] creating a new session')
			    	session = new Session();
			    	session.id = sessionId;
			    	this.db.add('sessions', session).then(() => {
					    callback(session);
					}, (error) => {
					    console.log(error);
					});
			    }
			    else {
			    	console.log('[storage] retrieved from indexeddb', session.id, session.games.length);
			    	callback(session);
			    }
			},
			(error) => {
			    console.log(error);
			}
		);
	}

	public getLatestSessionId(): string {
		console.log('[storage] getting last session Id', this.localStorageService.get('lastSessionId'));
		return this.localStorageService.get('lastSessionId');
	}

	public update(session: Session, callback: Function): void {
		console.log('[storage] updating session', session.id, session.games.length);

		this.db.update('sessions', session).then(
			() => {
				console.log('[storage] updated in indexeddb', session.id, session.games.length);
			    callback(session);
			},
			(error) => {
			    console.log(error);
			}
		);
	}

	private init() {
		console.log('[storage] starting init of indexeddb');

		this.db = new AngularIndexedDB('manastorm-db', 1);
		this.db.openDatabase(1, (evt) => {
		    let objectStore = evt.currentTarget.result.createObjectStore('sessions', { keyPath: "id" });
		    this.dbInit = true;
		    console.log('[storage] objectstore created', objectStore);
		}).then(
			() => {
				console.log('[storage] openDatabase successful', this.db);
		    	this.dbInit = true;
			},
			(error) => {
				console.log('[storage] error in openDatabase', error);
			}
		);

	}
}

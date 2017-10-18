import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { AngularIndexedDB } from 'angular2-indexeddb';


import { Session } from '../models/storage';
import { Game } from '../models/game';

declare var OverwolfPlugin: any;
declare var LZString: any;

@Injectable()
export class StorageHelperService {

	// plugin: any;

	private db: AngularIndexedDB;
	private dbInit: boolean;

	constructor(private localStorageService: LocalStorageService) {
		this.init();
	}

	public getSession(sessionId: string, callback: Function) {
		// console.log('[storage] getting session', sessionId);
		// if (!sessionId) {
		// 	console.log('ERROR: [storage] We should never call getSession with a null sessionId', sessionId);
		// 	return null;
		// }
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

		// let fileName = this.plugin.get().LOCALAPPDATA + '/Overwolf/ZeroToHeroes/Sessions/' + sessionId;
		// this.plugin.get().getTextFile(fileName, false, (status, message) => {
		// 	let session: Session;
		// 	if (!status) {
		// 		console.log('[storage] Could not read file', fileName);
		// 		session = new Session();
		// 	}
		// 	else {
		// 		// let compressed = LZString.decompress(message);
		// 		console.log('[storage] retrieved compressed session');
		// 		session = JSON.parse(message);
		// 	}
		// 	session.id = sessionId;
		// 	console.log('[storage] retrieved session', session.id, session.games.length);

		// 	this.localStorageService.set('lastSessionId', sessionId);
		// 	this.update(session, callback);
		// });
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

		// let fileName = '/Overwolf/ZeroToHeroes/Sessions/' + session.id;
		// let strSession = JSON.stringify(session);
		// console.log('[storage] storing stringified session');
		// // let compressedSession = LZString.compress(strSession);
		// this.plugin.get().writeLocalAppDataFile(fileName, strSession, (status, message) => {
		// 	console.log('[storage] Session updated', status, message);
		// 	callback(session);
		// });
	}

	private init() {
		console.log('[storage] starting init of indexeddb');
		// this.plugin = new OverwolfPlugin("simple-io-plugin-zip", true);

		// this.plugin.initialize((status: boolean) => {
		// 	if (status === false) {
		// 		console.warn("[storage] Plugin couldn't be loaded??");
		// 		// Raven.captureMessage('simple-io-plugin could not be loaded');
		// 		return;
		// 	}
		// 	console.log("[storage] Plugin " + this.plugin.get()._PluginName_ + " was loaded!", this.plugin.get());

		// 	this.plugin.get().onOutputDebugString.addListener(function(first, second, third) {
		// 		console.log('[storage] received global event', first, second, third);
		// 	});
		// });
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

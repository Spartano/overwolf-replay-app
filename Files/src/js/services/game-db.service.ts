import { Injectable } from '@angular/core';
import { AngularIndexedDB } from 'angular2-indexeddb';
import { Game } from '../models/game';

@Injectable()
export class GameDbService {

	private dbInit: boolean;
	private db: AngularIndexedDB;

	constructor() {
		this.init();
	}

	public async getGame(id: string): Promise<Game> {
		await this.waitForDbInit();
		try {
			const game = await this.db.getByKey('games', id);
			return game;
		} catch (e) {
			console.error('[games] [storage] error while loading game', id, e.message, e.name, e);
		}
	}

	public async save(game: Game): Promise<Game> {
		await this.waitForDbInit();
		try {
			const result = await this.db.update('games', game);
			return result;
		} catch (e) {
			console.error('[games] [storage] error while saving game', game.id, game, e.message, e.name, e);
			return game;
		}
	}

	public async getOneGame(): Promise<Game> {
		await this.waitForDbInit();
		const all: Game[] = await this.db.getAll('games');
		return all[all.length - 1];
	}

	private init() {
		console.log('[games] [storage] starting init of indexeddb');
		this.db = new AngularIndexedDB('hs-games-db', 2);
		this.db.openDatabase(2, (evt) => {
			console.log('[games] [storage] opendb successful', evt);
			if (evt.oldVersion < 1) {
				console.log('[games] [storage] creating games store');
				evt.currentTarget.result.createObjectStore('games', { keyPath: 'id' });
			}
			console.log('[games] [storage] indexeddb upgraded');
			this.dbInit = true;
		}).then(
			() => {
				console.log('[games] [storage] openDatabase successful', this.db.dbWrapper.dbName);
				this.dbInit = true;
			},
			(e) => {
				console.log('[games] [storage] error in openDatabase', e.message, e.name, e);
			}
		);
	}

	private waitForDbInit(): Promise<void> {
		return new Promise<void>((resolve) => {
			const dbWait = () => {
				if (this.dbInit) {
					resolve();
				} else {
					setTimeout(() => dbWait(), 50);
				}
			};
			dbWait();
		});
	}
}

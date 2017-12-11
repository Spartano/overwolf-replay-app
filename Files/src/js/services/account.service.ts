import { Injectable, NgZone } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from "@angular/http";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { LocalStorageService } from 'angular-2-local-storage';

import { Events } from './events.service';

declare var overwolf: any;

const CLAIM_ACCOUNT_URL = "http://www.zerotoheroes.com/api/claimAccount/overwolf/";
const DISCONNECT_ACCOUNT_URL = "http://www.zerotoheroes.com/api/disconnectAccount/overwolf/";
// const CHECK_ACCOUNT_CLAIM_ENDPOINT = BASE_URL + '/api/claimAccount/overwolf/';

@Injectable()
export class AccountService {

	// accountClaimUrlSubject: Subject<String> = new Subject<String>();
	accountClaimStatusSubject: Subject<boolean> = new Subject<boolean>();

	private userId: string;

	constructor(
		private http: Http,
		private zone: NgZone,
		private events: Events,
		private localStorageService: LocalStorageService) {

		this.init();
	}

	private init() {
		overwolf.profile.getCurrentUser((user) => {
			console.log('current user', user);
			this.userId = user.userId || user.machineId || user.username;
			if (this.userId) {
				// this.accountClaimUrlSubject.next(CLAIM_ACCOUNT_URL + this.userId);
				this.checkAccountClaimedStatus();
			}
		});
	}

	public claimAccounts(authToken: string) {
		console.log('claiming accounts');
		overwolf.profile.getCurrentUser((user) => {
			console.log('claiming machineId account');

			let headers = new Headers();
			headers.append('x-auth-token', authToken);
			let options = new RequestOptions({ headers: headers });

			let machineIdUrl = CLAIM_ACCOUNT_URL + user.machineId;
			this.http.post(machineIdUrl, {}, options)
				.subscribe((data) => { this.accountClaimHandler(data, true) }, (err) => { this.accountClaimErrorHandler(err) });

			let accountUrl = CLAIM_ACCOUNT_URL + user.userId;
			this.http.post(accountUrl, {}, options)
				.subscribe((data) => { this.accountClaimHandler(data, true) }, (err) => { this.accountClaimErrorHandler(err) });
		});
	}

	public disconnect() {
		let authToken: string = this.localStorageService.get('auth-token');

		console.log('disconnecting accounts');
		overwolf.profile.getCurrentUser((user) => {
			console.log('disconnecting machineId account');

			let headers = new Headers();
			headers.append('x-auth-token', authToken);
			let options = new RequestOptions({ headers: headers });

			let machineIdUrl = DISCONNECT_ACCOUNT_URL + user.machineId;
			this.http.post(machineIdUrl, {}, options)
				.subscribe((data) => { this.accountClaimHandler(data, false) }, (err) => { this.accountDisconnectErrorHandler(err, user.machineId) });

			let accountUrl = DISCONNECT_ACCOUNT_URL + user.userId;
			this.http.post(accountUrl, {}, options)
				.subscribe((data) => { this.accountClaimHandler(data, false) }, (err) => { this.accountDisconnectErrorHandler(err, user.userId) });
		});
	}

	private checkAccountClaimedStatus() {
		let claimed = this.localStorageService.get<boolean>('account-claimed');
		if (claimed) {
			this.accountClaimStatusSubject.next(true);
			return;
		}

		let url = CLAIM_ACCOUNT_URL + this.userId;
		console.log('checking account claimed status', url);
		this.http.get(url)
			.subscribe(
				(response: Response) => {
					console.log('account claimed', this.userId, response);
					this.setAccountClaimed(true);
				},
				(err) => {
					console.log('account not claimed', this.userId, err);
					this.accountClaimStatusSubject.next(false);
				}
			);
	}

	private accountClaimHandler(data, isClaimed: boolean) {
		this.zone.run(() => {
			console.log('claim?', data, isClaimed);
			this.setAccountClaimed(isClaimed);
		})
	}

	private accountClaimErrorHandler(err) {
		this.zone.run(() => {
			if (err.status == 409) {
				console.log('account already claimed', err);
				this.setAccountClaimed(false);
				return;
			}
			this.events.broadcast(Events.GLOBAL_ERROR, 'CANT_CLAIM_ACCOUNT');
			console.error('Could not claim account', err);
		});
	}

	private accountDisconnectErrorHandler(err, id: string) {
		this.zone.run(() => {
			// if (err.status == 409) {
			// 	console.log('account already claimed', err);
			// 	this.setAccountClaimed(false);
			// 	return;
			// }
			this.events.broadcast(Events.GLOBAL_ERROR, 'CANT_DISCONNECT_ACCOUNT', id);
			console.error('Could not disconnect account', err);
		});
	}

	private setAccountClaimed(isClaimed: boolean) {
		this.accountClaimStatusSubject.next(isClaimed);
		this.localStorageService.set('account-claimed', isClaimed);
	}

	// public claimAccountUrl(): Observable<String> {
	// 	return this.accountClaimUrlSubject.asObservable();
	// }

	// public startListeningForClaimChanges() {
	// 	this.checkAccountClaimedStatus(true);
	// }
}

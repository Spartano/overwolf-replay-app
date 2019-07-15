import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Subject } from 'rxjs/Subject';

import { LocalStorageService } from 'angular-2-local-storage';

import { UserPreferences } from './user-preferences.service';
import { Events } from './events.service';
import { OverwolfService } from './overwolf.service';

const CLAIM_ACCOUNT_URL = "https://www.zerotoheroes.com/api/claimAccount/overwolf/";
const DISCONNECT_ACCOUNT_URL = "https://www.zerotoheroes.com/api/disconnectAccount/overwolf/";

@Injectable()
export class AccountService {

	accountClaimStatusSubject: Subject<boolean> = new Subject<boolean>();

	private userId: string;

	constructor(
            private http: Http,
            private events: Events,
            private ow: OverwolfService,
            private userPreferences: UserPreferences,
            private localStorageService: LocalStorageService) {
		this.init();
	}

	private async init() {
        const user = await this.ow.getCurrentUser();
        console.log('current user', user);
        this.userId = user.userId || user.machineId || user.username;
        if (this.userId) {
            // this.accountClaimUrlSubject.next(CLAIM_ACCOUNT_URL + this.userId);
            this.checkAccountClaimedStatus();
        }
	}

	public async claimAccounts(authToken: string) {
		console.log('claiming accounts');
        const user = await this.ow.getCurrentUser();
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
	}

	public async disconnect() {
		let authToken: string = this.localStorageService.get('auth-token');
		console.log('disconnecting accounts');
        const user = await this.ow.getCurrentUser();
        let headers = new Headers();
        headers.append('x-auth-token', authToken);
        let options = new RequestOptions({ headers: headers });

        let machineIdUrl = DISCONNECT_ACCOUNT_URL + user.machineId;
        this.http.post(machineIdUrl, {}, options)
            .subscribe((data) => { this.accountClaimHandler(data, false) }, (err) => { this.accountDisconnectErrorHandler(err, user.machineId) });

        let accountUrl = DISCONNECT_ACCOUNT_URL + user.userId;
        this.http.post(accountUrl, {}, options)
            .subscribe((data) => { this.accountClaimHandler(data, false) }, (err) => { this.accountDisconnectErrorHandler(err, user.userId) });

        // Setting auto-upload to false
        this.userPreferences.setAutoUpload(true);
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
        console.log('claim?', data, isClaimed);
        this.setAccountClaimed(isClaimed);
	}

	private accountClaimErrorHandler(err) {
        if (err.status == 409) {
            console.log('account already claimed', err);
            this.setAccountClaimed(true);
            return;
        }
        this.events.broadcast(Events.GLOBAL_ERROR, 'CANT_CLAIM_ACCOUNT');
        console.error('Could not claim account', err);
	}

	private accountDisconnectErrorHandler(err, id: string) {
        this.events.broadcast(Events.GLOBAL_ERROR, 'CANT_DISCONNECT_ACCOUNT', id);
        console.error('Could not disconnect account', err);
	}

	private setAccountClaimed(isClaimed: boolean) {
		this.accountClaimStatusSubject.next(isClaimed);
		this.localStorageService.set('account-claimed', isClaimed);
	}
}

import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

declare var overwolf: any;

const BASE_URL = 'http://www.zerotoheroes.com';
// const BASE_URL = 'http://localhost:8080';
const CLAIM_ACCOUNT_URL = BASE_URL + '/s/hearthstone/claimAccount/overwolf/';
const CHECK_ACCOUNT_CLAIM_ENDPOINT = BASE_URL + '/api/claimAccount/overwolf/';

@Injectable()
export class AccountService {

	accountClaimUrlSubject: Subject<String> = new Subject<String>();
	accountClaimStatusSubject: Subject<boolean> = new Subject<boolean>();

	private userId: string;

	constructor(private http: Http) {
		this.init();
	}

	public checkAccountClaimedStatus(poll: boolean) {
		let url = CHECK_ACCOUNT_CLAIM_ENDPOINT + this.userId;
		console.log('checking account claimed status', url);
		this.http.get(url)
			.subscribe(
				(response: Response) => {
					console.log('checkAccountClaimedStatus repsonse from server', response, poll);
					this.accountClaimStatusSubject.next(response.ok);
					if (!response.ok && poll) {
						setTimeout(() => this.checkAccountClaimedStatus(poll), 5000);
					}
				},
				(err) => {
					console.log('hopla', err, poll);
					this.accountClaimStatusSubject.next(false);
					if (poll) {
						setTimeout(() => this.checkAccountClaimedStatus(poll), 5000);
					}
				}
			);
	}

	public claimAccountUrl(): Observable<String> {
		return this.accountClaimUrlSubject.asObservable();
	}

	public startListeningForClaimChanges() {
		this.checkAccountClaimedStatus(true);
	}

	private init() {
		overwolf.profile.getCurrentUser((user) => {
			console.log('current user', user);
			this.userId = user.userId || user.machineId || user.username;
			if (this.userId) {
				this.accountClaimUrlSubject.next(CLAIM_ACCOUNT_URL + this.userId);
				this.checkAccountClaimedStatus(false);
			}
		});
	}
}

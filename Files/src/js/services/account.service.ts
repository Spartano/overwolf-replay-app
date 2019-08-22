import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';
import { LoginField } from '../models/shelf/login-field.type';
import { Events } from './events.service';
import { OverwolfService } from './overwolf.service';
import { UserPreferences } from './user-preferences.service';

const SIGN_IN_URL = 'https://www.zerotoheroes.com/api/login';
const SIGN_UP_URL = 'https://www.zerotoheroes.com/api/users';
const FORGOTTEN_PASSWORD_URL = 'https://www.zerotoheroes.com/api/users/password';

const CLAIM_ACCOUNT_URL = 'https://www.zerotoheroes.com/api/claimAccount/overwolf/';
const DISCONNECT_ACCOUNT_URL = 'https://www.zerotoheroes.com/api/disconnectAccount/overwolf/';

@Injectable()
export class AccountService {
	accountClaimStatusSubject: Subject<boolean> = new Subject<boolean>();

	private userId: string;

	constructor(
		private http: HttpClient,
		private events: Events,
		private ow: OverwolfService,
		private logger: NGXLogger,
		private userPreferences: UserPreferences,
		private localStorageService: LocalStorageService,
	) {
		this.init();
	}

	private async init() {
		const user = await this.ow.getCurrentUser();
		this.logger.debug('current user', user);
		this.userId = user.userId || user.machineId || user.username;
		if (this.userId) {
			// this.accountClaimUrlSubject.next(CLAIM_ACCOUNT_URL + this.userId);
			this.checkAccountClaimedStatus();
		}
	}

	public async claimAccounts(authToken: string) {
		this.logger.debug('claiming accounts');
		const user = await this.ow.getCurrentUser();
		this.logger.debug('claiming machineId account');

		const httpHeaders = new HttpHeaders().set('x-auth-token', authToken);

		const machineIdUrl = CLAIM_ACCOUNT_URL + user.machineId;
		this.http.post(machineIdUrl, {}, { headers: httpHeaders }).subscribe(
			data => {
				this.accountClaimHandler(data, true);
			},
			err => {
				this.accountClaimErrorHandler(err);
			},
		);

		const accountUrl = CLAIM_ACCOUNT_URL + user.userId;
		this.http.post(accountUrl, {}, { headers: httpHeaders }).subscribe(
			data => {
				this.accountClaimHandler(data, true);
			},
			err => {
				this.accountClaimErrorHandler(err);
			},
		);
	}

	public async disconnect() {
		const authToken: string = this.localStorageService.get('auth-token');
		this.logger.debug('disconnecting accounts');
		const user = await this.ow.getCurrentUser();
		const httpHeaders = new HttpHeaders().set('x-auth-token', authToken);

		const machineIdUrl = DISCONNECT_ACCOUNT_URL + user.machineId;
		this.http.post(machineIdUrl, {}, { headers: httpHeaders }).subscribe(
			data => {
				this.accountClaimHandler(data, false);
			},
			err => {
				this.accountDisconnectErrorHandler(err, user.machineId);
			},
		);

		const accountUrl = DISCONNECT_ACCOUNT_URL + user.userId;
		this.http.post(accountUrl, {}, { headers: httpHeaders }).subscribe(
			data => {
				this.accountClaimHandler(data, false);
			},
			err => {
				this.accountDisconnectErrorHandler(err, user.userId);
			},
		);

		this.localStorageService.remove('username', 'auth-token');
		this.userPreferences.setAutoUpload(true);
	}

	public async createAccount(credentials: {
		username: string;
		password: string;
		email: string;
	}): Promise<{ username?: string; error?: string; errorField?: LoginField }> {
		if (!this.validateEmail(credentials.email)) {
			return { error: 'This email address is invalid.', errorField: 'email' };
		} else if (!this.validatePassword(credentials.password)) {
			return { error: 'This password is not strong enough, please use at least 6 characters', errorField: 'password' };
		} else if (!this.validateUsername(credentials.username)) {
			return { error: 'This username is invalid', errorField: 'username' };
		}

		const accountInfo = {
			...credentials,
			registerLocation: 'overwolf-egs',
		};
		try {
			const result = await this.http.post(SIGN_UP_URL, accountInfo).toPromise();
			this.logger.debug('Create account result', result);
			const loginInfo = await this.login(credentials.username, credentials.password);
			return { username: loginInfo.username };
		} catch (e) {
			this.logger.warn('Could not create account', e);
			let errorMessage = '';
			let errorField: LoginField;
			switch (e.status) {
				case 422:
					const reason: string = e.error.reason;
					switch (reason) {
						case 'USERNAME':
							errorMessage = 'This username is already in use.';
							errorField = 'username';
							break;
						case 'EMAIL':
							errorMessage = 'This email address is already in use.';
							errorField = 'email';
							break;
						case 'PASSWORD':
							errorMessage = 'Please provide a password to secure your account.';
							errorField = 'password';
							break;
					}
					break;
				default:
					errorMessage = `createaccount_${e.status}_${e.error.message}`;
					this.logger.error('Unknown error while creating account', e);
			}
			return { error: errorMessage, errorField: errorField };
		}
	}

	public async login(username: string, password: string): Promise<{ username?: string; error?: string; errorField?: LoginField }> {
		const credentials = {
			username: username,
			password: password,
		};
		try {
			const result = await this.http.post(SIGN_IN_URL, credentials, { observe: 'response' }).toPromise();
			this.logger.debug('Login result', result);
			const authToken = result.headers.get('x-auth-token');
			this.localStorageService.set('auth-token', authToken);
			this.localStorageService.set('username', username);
			await this.claimAccounts(authToken);
			return { username: username };
		} catch (e) {
			this.logger.warn('Could not sign in', e);
			let errorMessage = '';
			let errorField: LoginField;
			switch (e.status) {
				case 401:
					errorMessage = 'Invalid login/password combination';
					errorField = 'loginId';
					break;
				default:
					errorMessage = `login_${e.status}_${e.error.message}`;
					this.logger.error('Unknown error while logging in', e);
			}
			return { error: errorMessage, errorField: errorField };
		}
	}

	public async resetPassword(username: string): Promise<{ error?: string; errorField?: LoginField }> {
		const credentials = {
			username: username,
		};
		try {
			const result = await this.http.post(FORGOTTEN_PASSWORD_URL, credentials, { observe: 'response' }).toPromise();
			this.logger.debug('Reset password result', result);
			return {};
		} catch (e) {
			this.logger.warn('Could not reste password', e);
			let errorMessage = '';
			let errorField: LoginField;
			switch (e.status) {
				case 404:
				case 406:
					errorMessage = "We couldn't find any account for this user";
					errorField = 'loginId';
					break;
				default:
					errorMessage = e.status;
					this.logger.error('Unknown error while resetting password', e);
			}
			return { error: errorMessage, errorField: errorField };
		}
	}

	public getLoggedInUser(): { loggedIn: boolean; username?: string } {
		const authToken: string = this.localStorageService.get('auth-token');
		const username: string = this.localStorageService.get('username');
		if (authToken && username) {
			return { loggedIn: true, username: username };
		}
		return { loggedIn: false };
	}

	private checkAccountClaimedStatus() {
		const claimed = this.localStorageService.get<boolean>('account-claimed');
		if (claimed) {
			this.accountClaimStatusSubject.next(true);
			return;
		}

		const url = CLAIM_ACCOUNT_URL + this.userId;
		this.logger.debug('checking account claimed status', url);
		this.http.get(url).subscribe(
			response => {
				this.logger.debug('account claimed', this.userId, response);
				this.setAccountClaimed(true);
			},
			err => {
				this.logger.debug('account not claimed', this.userId, err);
				this.accountClaimStatusSubject.next(false);
			},
		);
	}

	private accountClaimHandler(data, isClaimed: boolean) {
		this.logger.debug('claim?', data, isClaimed);
		this.setAccountClaimed(isClaimed);
	}

	private accountClaimErrorHandler(err) {
		if (err.status === 409) {
			this.logger.debug('account already claimed', err);
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

	private validateEmail(email: string): boolean {
		return /^[^\s]+@[^\s]+\.[^\s]+$/.test(email);
	}

	private validatePassword(passwordInput: string): boolean {
		return passwordInput && passwordInput.length >= 6;
	}

	private validateUsername(username): boolean {
		return username && username.length >= 3;
	}
}

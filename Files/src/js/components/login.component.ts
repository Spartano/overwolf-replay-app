import { Component, Output, EventEmitter } from '@angular/core';
import { Http } from "@angular/http";

import { LocalStorageService } from 'angular-2-local-storage';

import { Events } from '../services/events.service';
import { AccountService } from '../services/account.service';

const SIGN_IN_URL = "https://www.zerotoheroes.com/api/login";
const SIGN_UP_URL = "https://www.zerotoheroes.com/api/users";
const FORGOTTEN_PASSWORD_URL = "https://www.zerotoheroes.com/api/users/password";

@Component({
	selector: 'login',
	styleUrls: [
		`../../css/global/_vars.scss`,
		`../../css/global/fonts.scss`,
		`../../css/global/forms.scss`,
		`../../css/global/modal-inner.scss`,
		`../../css/global/modal-window.scss`,
		`../../css/global/tooltip.scss`,
		`../../css/global/component-global.scss`,
		`../../css/component/login.component.scss`,
	],
	// See https://stackoverflow.com/questions/45216306/angular-4-email-validator-in-formgroup to improve the design
	template: `
		<div class="login-container">
			<div class="modal modal-connect active">
				<div class="modal-window modal-window-connect">
					<section class="sign-in-section" *ngIf="state == 'SIGN_IN'">
						<aside class="modal-window-connect-aside">
							<i class="cloud-icon">
								<i class="cloud-sun">
									<svg class="cloud-sun-bg">
										<use xlink:href="/Files/assets/svg/sprite.svg#cloud-sun-bg" />
									</svg>

									<svg>
										<use xlink:href="/Files/assets/svg/sprite.svg#cloud-sun" />
									</svg>
								</i>

								<svg>
									<use xlink:href="/Files/assets/svg/sprite.svg#cloud" />
								</svg>
							</i>
							<h1>Zero to Heroes<br>Sign in</h1>

							<p class="error-message" *ngIf="errorMessage">{{errorMessage}}</p>
						</aside>


						<form #signInForm="ngForm">
							<section class="form-section">
								<label for="login_field"><span>Username or Email</span></label>
								<input class="input-text" id="login_field" name="identifier" tabindex="1" type="text" [(ngModel)]="identifier">
							</section>

							<section class="form-section">
								<label for="password">
									<span>Password</span>
									<a class="label-link" (click)="switchState('FORGOTTEN_PASSWORD')">Forgot password?</a>
								</label>
								<input class="input-text" id="password" name="password" tabindex="2" type="password" [(ngModel)]="password">
							</section>

							<button type="submit" class="btn" tabindex="3" (click)="login()">
								<span class="Button-Content" tabindex="-1">Sign in</span>
							</button>
							<p>Don't have an account? <a class="switch-to-sign-up text-link" (click)="switchState('SIGN_UP')">Sign up</a></p>
						</form>
					</section>

					<section class="sign-up-section" *ngIf="state == 'SIGN_UP'">
						<aside class="modal-window-connect-aside">
							<i class="cloud-icon">
								<i class="cloud-sun">
									<svg class="cloud-sun-bg">
										<use xlink:href="/Files/assets/svg/sprite.svg#cloud-sun-bg" />
									</svg>

									<svg>
										<use xlink:href="/Files/assets/svg/sprite.svg#cloud-sun" />
									</svg>
								</i>

								<svg>
									<use xlink:href="/Files/assets/svg/sprite.svg#cloud" />
								</svg>
							</i>
							<h1>Zero to Heroes<br>Sign up</h1>
							<p>Create your account to start earning reputation points, unlock special features, and share your game replays</p>

							<p class="error-message" *ngIf="errorMessage">{{errorMessage}}</p>
						</aside>


						<form>
							<section class="form-section">
								<label for="login_field"><span>Username</span></label>
								<input class="input-text" id="login_field" name="login" tabindex="1" type="text" [(ngModel)]="username">
							</section>

							<section class="form-section" [ngClass]="{'invalid': !validEmail}">
								<label for="email_field"><span>Email</span></label>
								<p class="invalid-text" *ngIf="!validEmail">This doesn't look like a valid email</p>
								<input class="input-text" id="email_field" name="email" tabindex="2" type="email" (blur)="validateEmail()" [(ngModel)]="email">
							</section>

							<section class="form-section">
								<label for="password">
									<span>Password</span>
								</label>
								<input class="input-text" id="password" name="password" tabindex="3" type="password" [(ngModel)]="passwordInput">
							</section>

							<section class="form-section" [ngClass]="{'invalid': !passwordsMatch}">
								<label for="passwordConfirm">
									<span>Password, again</span>
								</label>
								<p class="invalid-text" *ngIf="!passwordsMatch">Passwords don't match</p>
								<input class="input-text" id="passwordConfirm" name="passwordConfirm" tabindex="4" type="password" (blur)="validatePasswords()" [(ngModel)]="confirmPasswordInput">
							</section>

							<button type="submit" class="btn" tabindex="5" (click)="signUp()">
								<span class="Button-Content" tabindex="-1">Sign up</span>
							</button>
							<p>Already have an account? <a class="switch-to-sign-in text-link" (click)="switchState('SIGN_IN')">Sign in</a></p>
						</form>
					</section>

					<section class="forgotten-password-section" *ngIf="state == 'FORGOTTEN_PASSWORD'">
						<aside class="modal-window-connect-aside">
							<i class="cloud-icon">
								<i class="cloud-sun">
									<svg class="cloud-sun-bg">
										<use xlink:href="/Files/assets/svg/sprite.svg#cloud-sun-bg" />
									</svg>

									<svg>
										<use xlink:href="/Files/assets/svg/sprite.svg#cloud-sun" />
									</svg>
								</i>

								<svg>
									<use xlink:href="/Files/assets/svg/sprite.svg#cloud" />
								</svg>
							</i>
							<h1>Zero to Heroes</h1>
							<p>Forgot password</p>

							<p class="error-message" *ngIf="errorMessage">{{errorMessage}}</p>
							<p class="info-message" *ngIf="infoMessage">{{infoMessage}}</p>
						</aside>


						<form #forgottenPasswordForm="ngForm">
							<section class="form-section">
								<label for="login_field"><span>Enter your Username or Email</span></label>
								<input class="input-text" id="login_field" name="identifier" tabindex="1" type="text" [(ngModel)]="identifier">
							</section>

							<button type="submit" class="btn" tabindex="3" (click)="forgotPassword()">
								<span class="Button-Content" tabindex="-1">Send me instructions</span>
							</button>
							<p *ngIf="!sentInstructions">Don't have an account? <a class="switch-to-sign-up text-link" (click)="switchState('SIGN_UP')">Sign up</a></p>
							<p *ngIf="sentInstructions">Instructions received? <a class="switch-to-sign-up text-link" (click)="switchState('SIGN_IN')">Sign in!</a></p>
						</form>
					</section>

					<button class="window-control window-control-close" (click)="closeWindow()">
						<svg class="svg-icon-fill">
							<use xlink:href="/Files/assets/svg/sprite.svg#window-control_close" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	`,
})
export class LoginComponent {

	@Output() close = new EventEmitter();

	state = 'SIGN_IN';

	private sentInstructions: boolean;
	private errorMessage: string;
	private infoMessage: string;

	private identifier: string;
	private password: string;

	private username: string;
	private email: string;
	private passwordInput: string;
	private confirmPasswordInput: string;

	private passwordsMatch = true;
	private validEmail = true;

	constructor(
		private http: Http,
		private accountService: AccountService,
		private localStorageService: LocalStorageService,
		private events: Events) {
	}

	closeWindow() {
		this.close.emit(null);
	}

	private forgotPassword() {
		this.errorMessage = null;
		this.password = null;
		this.infoMessage = 'Working on it';
		let credentials = {
			username: this.identifier,
		}
		this.http.post(FORGOTTEN_PASSWORD_URL, credentials)
			.subscribe(
				(data) => {
					this.infoMessage = null;
					if (data.status === 200) {
						this.infoMessage = `Instructions on how to reset your password have been sent to your email address (promise, it's super easy)`;
						this.sentInstructions = true;
					}
					else {
						this.errorMessage = `Damned! An unknown error has happened. Please try again in a few minutes, or contact the support with: ${data}`;
						console.log('could not reset password', data);
					}

				},
				(err) => {
					this.infoMessage = null;
					switch (err.status) {
						case 404:
							this.errorMessage = `Sorry, we couldn\'t find any account for this identifier`
							break;
						case 406:
							this.errorMessage = `Please give us your username or email address so we can find and help you`
							break;
						default:
							this.errorMessage = `Damned! An unknown error has happened. Please try again in a few minutes, or contact the support with: Code ${err.status} with message ${err.statusText}`;
							console.log('Got an unknown on user management', err);
					}

				}
			)
	}

	private login(pIdentifier?: string, pPassword?: string) {
		this.errorMessage = null;
		this.infoMessage = 'Working on it';
		let credentials = {
			username: pIdentifier || this.identifier,
			password: pPassword || this.password
		}
		console.log('logging in with', credentials);
		this.http.post(SIGN_IN_URL, credentials)
			.subscribe(
				(data) => {
					this.infoMessage = null;
					if (data.status === 200) {
						console.log('successful account creation', data);
						let authToken = data.headers.get('x-auth-token');
						this.localStorageService.set('auth-token', authToken);
						this.accountService.claimAccounts(authToken);
						this.close.emit(null);
					}
					else {
						this.errorMessage = `Damned! An unknown error has happened. Please try again in a few minutes, or contact the support with: ${data}`;
						console.log('unsuccessful login', data);
					}
				},
				(err) => {
					this.infoMessage = null;
					console.log('unsuccessful login', err);
					switch (err.status) {
						case 401:
							this.errorMessage = 'Sorry, we couldn\'t find any account for this identifier'
							break;
						case 504:
							this.errorMessage = 'The servers are busy and temporarily unavailable. Please try again in a few minutes.'
							break;
						default:
							this.errorMessage = `Damned! An unknown error has happened. Please try again in a few minutes, or contact the support with: Code ${err.status} with message ${err.statusText}`;
							console.log('Got an unknown on user management', err);
					}
				}
			);
	}

	private validatePasswords(): boolean {
		console.log('validating passwords', this.passwordInput, this.confirmPasswordInput);
		if (this.passwordInput !== this.confirmPasswordInput) {
			this.passwordsMatch = false;
			return false;
		}
		this.passwordsMatch = true;
		return true;
	}

	private validateEmail(): boolean {
		console.log('validating email', this.email);
		const pureEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		 if (!pureEmail.test(this.email)) {
		 	this.validEmail = false;
		 	return false;
		 }
		 this.validEmail = true;
		 return true;
	}

	private signUp() {
		this.errorMessage = null;
		this.infoMessage = 'Working on it';
		let valid: boolean = true;
		valid = valid && this.validatePasswords();
		valid = valid && this.validateEmail();
		if (!valid) {
			return;
		}

		let credentials = {
			username: this.username,
			password: this.passwordInput,
			email: this.email,
			registerLocation: 'overwolf-egs',
		}
		console.log('creating account with', credentials);
		this.http.post(SIGN_UP_URL, credentials)
			.subscribe(
				(data) => {
					this.infoMessage = null;
					if (data.status === 200) {
						this.errorMessage = undefined;
						console.log('successful registration', data);
						this.login(this.username, this.passwordInput);
					}
					else {
						this.errorMessage = `Damned! An unknown error has happened. Please try again in a few minutes, or contact the support with: ${data}`;
						console.log('unsuccessful login', data);
					}
				},
				(err) => {
					this.infoMessage = null;
					switch (err.status) {
						case 422:
							let reason: string = JSON.parse(err._body).reason;
							switch(reason) {
								case 'USERNAME':
									this.errorMessage = 'An account with this username already exists. Please choose another username.'
									break;
								case 'EMAIL':
									this.errorMessage = 'An account with this email address already exists. Please use another email address.'
									break;
								case 'PASSWORD':
									this.errorMessage = 'Please provide a password to secure your account.'
									break;
							}
							break;
						default:
							this.errorMessage = `Damned! An unknown error has happened. Please try again in a few minutes, or contact the support with: Code ${err.status} with message ${err.statusText}`;
							console.log('Got an unknown on user management', err);
					}
				}
			);
	}

	private switchState(newState: string) {
		this.state = newState;
		this.infoMessage = null;
		this.errorMessage = null;
	}
}

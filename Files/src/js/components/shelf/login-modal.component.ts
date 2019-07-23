import { Component, ChangeDetectionStrategy, Input, HostListener, ElementRef, AfterViewInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ShelfStoreService } from '../../services/shelf/store/shelf-store.service';
import { LoginModalToggleEvent } from '../../services/shelf/store/events/login-modal-toggle-event';
import { CreateAccountEvent } from '../../services/shelf/store/events/create-account-event';
import { LoginModalInfo } from '../../models/shelf/login-modal-info';
import { LoginField } from '../../models/shelf/login-field.type';
import { LoginEvent } from '../../services/shelf/store/events/login-event';
import { ResetPasswordEvent } from '../../services/shelf/store/events/reset-password-event';

@Component({
	selector: 'login-modal',
	styleUrls: [
		`../../../css/global.scss`,
		`../../../css/component/shelf/manastorm-themes.scss`,
		`../../../css/component/shelf/manastorm-fonts.scss`,
		`../../../css/component/shelf/manastorm-scrollbar.scss`,
		`../../../css/component/shelf/manastorm-forms.scss`,
		`../../../css/component/shelf/manastorm-window-controls.scss`,
		`../../../css/component/shelf/tooltips.scss`,
		`../../../css/component/shelf/manastorm-modal.scss`,
		`../../../css/component/shelf/manastorm-modal-log-in.scss`,
		`../../../css/component/shelf/login-modal.component.scss`,
	],
	template: `
		<div class="modal-wrapper modal-wrapper-log-in active">
			<div class="modal-inner modal-log-in">
				<aside class="modal-log-in-aside">
					aside illustration
				</aside>
				<main class="modal-log-in-main" spellcheck="false">
					<ul class="log-in-sections">
						<!-- sign up -->
						<li id="sign-up" class="log-in-item">
							<form action="" class="log-in-form">
								<fieldset class="log-in-form-fieldset">
									<legend class="log-in-form-legend">
										<h1 class="log-in-item-h1">Sign up to Zero to Heroes</h1>
									</legend>
									<section class="log-in-form-section input-hint-tooltip-container">
										<label class="log-in-form-label" for="email">Email</label>
										<input class="input-text" tabindex="0" type="email"
												id="email" name="email" placeholder=""
												[ngClass]="{ 'invalid': errorField === 'email' }"
												(blur)="resetErrorMessage('email')"
												[(ngModel)]="email">
										<div class="hint-tooltip hint-tooltip-bottom hint-tooltip-aligned-right dark-theme">
											<span [innerHTML]="emailErrorMessage"></span>
										</div>
									</section>
									<section class="log-in-form-section input-hint-tooltip-container">
										<label class="log-in-form-label" for="username">Username</label>
										<input class="input-text" tabindex="0" type="text" id="username"
												name="username" placeholder="" pattern=".{3,}"
												[ngClass]="{ 'invalid': errorField === 'username' }"
												(blur)="resetErrorMessage('username')"
												[(ngModel)]="username">
										<div class="hint-tooltip hint-tooltip-bottom hint-tooltip-aligned-right dark-theme">
											<span [innerHTML]="usernameErrorMessage"></span>
										</div>
									</section>
									<section class="log-in-form-section input-hint-tooltip-container">
										<label class="log-in-form-label" for="password">Password</label>
										<input class="input-text" type="password" id="password"
												name="password" placeholder="" pattern=".{6,}"
												[ngClass]="{ 'invalid': errorField === 'password' }"
												(blur)="resetErrorMessage('password')"
												[(ngModel)]="passwordInput">
										<div class="hint-tooltip hint-tooltip-bottom hint-tooltip-aligned-right dark-theme">
											<span [innerHTML]="passwordErrorMessage"></span>
										</div>
									</section>
									<button class="btn btn-red" (click)="signUp()">Sign up</button>
								</fieldset>
							</form>
							<footer class="log-in-item-footer">
								<p class="log-in-item-p log-in-item-footer-text">
									Already have an account? <a class="text-link" href="#log-in">Log in</a>
								</p>
							</footer>
						</li>

						<!-- log in -->
						<li id="log-in" class="log-in-item">
							<form action="" class="log-in-form">
								<fieldset class="log-in-form-fieldset">
									<legend class="log-in-form-legend">
										<h1 class="log-in-item-h1">Log in to Zero to Heroes</h1>
									</legend>
									<section class="log-in-form-section input-hint-tooltip-container">
										<label class="log-in-form-label" for="username">Username or Email</label>
										<input class="input-text" tabindex="0"
												id="loginId" name="loginId" placeholder=""
												[ngClass]="{ 'invalid': errorField === 'loginId' }"
												(blur)="resetErrorMessage('loginId')"
												[(ngModel)]="loginId">
										<div class="hint-tooltip hint-tooltip-bottom hint-tooltip-aligned-right dark-theme">
											<span [innerHTML]="loginIdErrorMessage"></span>
										</div>
									</section>
									<section class="log-in-form-section input-hint-tooltip-container">
										<label class="log-in-form-label" for="password">
											<span>Password</span>
											<a class="text-link" href="#reset-password">Forgot password?</a>
										</label>
										<input class="input-text" type="password" id="password"
												name="password" placeholder="" pattern=".{6,}"
												[ngClass]="{ 'invalid': errorField === 'password' }"
												(blur)="resetErrorMessage('password')"
												[(ngModel)]="passwordInput">
										<div class="hint-tooltip hint-tooltip-bottom hint-tooltip-aligned-right dark-theme">
											<span [innerHTML]="passwordErrorMessage"></span>
										</div>
									</section>
									<button class="btn btn-red" (click)="logIn()">Log in</button>
								</fieldset>
							</form>
							<footer class="log-in-item-footer">
								<p class="log-in-item-p log-in-item-footer-text">
									Don't have an account? <a class="text-link" href="#sign-up">Sign up</a>
								</p>
							</footer>
						</li>

						<!-- reset password -->
						<li id="reset-password" class="log-in-item">
							<form action="" class="log-in-form">
								<fieldset class="log-in-form-fieldset">
									<legend class="log-in-form-legend">
										<h1 class="log-in-item-h1">Reset password</h1>
									</legend>
									<section class="log-in-form-section input-hint-tooltip-container">
										<label class="log-in-form-label" for="username">Username or Email</label>
										<input class="input-text" tabindex="0"
												id="loginId" name="loginId" placeholder=""
												[ngClass]="{ 'invalid': errorField === 'loginId' }"
												(blur)="resetErrorMessage('loginId')"
												[(ngModel)]="loginId">
										<div class="hint-tooltip hint-tooltip-bottom hint-tooltip-aligned-right dark-theme">
											<span [innerHTML]="loginIdErrorMessage"></span>
										</div>
									</section>
									<button class="btn btn-red" (click)="forgotPassword()">Submit</button>

									<!-- display after submit -->
									<p class="log-in-form-text-box" *ngIf="passwordResetSent">An email with instractions was sent to this
											address. <button class="text-link" (click)="forgotPassword()">Send again</button></p>
								</fieldset>
							</form>
							<footer class="log-in-item-footer">
								<p class="log-in-item-p log-in-item-footer-text">
									Don't have an account? <a class="text-link" href="#sign-up">Sign up</a>
								</p>
							</footer>
						</li>

						<!-- server error -->
						<li id="server-error" class="log-in-item log-in-item-error">
							<h1 class="log-in-item-h1">Something went wrong</h1>
							<p class="log-in-item-p">An unknown error has happened. Please try again in a
							few minutes, or contact the support with: Code {{errorCode}}</p>
						</li>
					</ul>
				</main>

				<div class="gs-window-controls-group">
					<button class="gs-icon gs-window-control gs-window-control-close light-theme" (click)="close()">
						<svg>
							<use xlink:href="/Files/assets/svg/window-controls.svg#window-control_close" />
						</svg>
					</button>
				</div>
			</div>
		</div>
    `,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginModalComponent implements AfterViewInit {

	private static readonly EMAIL_DEFAULT_MESSAGE = 'This doesn\'t look<br>like a valid email';
	private static readonly USERNAME_DEFAULT_MESSAGE = 'Username must be<br>at least 3 characters long';
	private static readonly PASSWORD_DEFAULT_MESSAGE = 'Password must be<br>at least 6 characters long';

	email: string;
	username: string;
	passwordInput: string;
	loginId: string;
	passwordResetSent: boolean;

	errorField: string;
	emailErrorMessage = LoginModalComponent.EMAIL_DEFAULT_MESSAGE;
	usernameErrorMessage = LoginModalComponent.USERNAME_DEFAULT_MESSAGE;
	passwordErrorMessage = LoginModalComponent.PASSWORD_DEFAULT_MESSAGE;
	loginIdErrorMessage: string = undefined;
	errorCode: string = undefined;

	private errorDiv;

	constructor(private logger: NGXLogger, private store: ShelfStoreService, private el: ElementRef) { }

	ngAfterViewInit() {
		this.errorDiv = this.el.nativeElement.querySelector('#server-error');
	}

	@Input('info') set info(value: LoginModalInfo) {
		this.logger.debug('[login-modal] setting info', value);
		this.emailErrorMessage = LoginModalComponent.EMAIL_DEFAULT_MESSAGE;
		this.usernameErrorMessage = LoginModalComponent.USERNAME_DEFAULT_MESSAGE;
		this.passwordErrorMessage = LoginModalComponent.PASSWORD_DEFAULT_MESSAGE;
		this.loginIdErrorMessage = undefined;
		this.errorCode = undefined;

		this.errorField = value.errorField;
		switch (value.errorField) {
			case 'username':
				this.usernameErrorMessage = value.errorMessage;
				break;
			case 'password':
				this.passwordErrorMessage = value.errorMessage;
				break;
			case 'email':
				this.emailErrorMessage = value.errorMessage;
				break;
			case 'loginId':
				this.loginIdErrorMessage = value.errorMessage;
				break;
			default:
				if (value.errorMessage) {
					this.logger.debug('No error field, showing generic error message', this.errorDiv);
					this.errorCode = value.errorMessage;
					this.errorDiv.scrollIntoView({behavior: 'smooth'});
				}
		}

		this.passwordResetSent = value.passwordResetSent;
	}

	resetErrorMessage(field: LoginField) {
		this.errorField = undefined;
		switch (field) {
			case 'email':
				this.emailErrorMessage = LoginModalComponent.EMAIL_DEFAULT_MESSAGE;
				break;
			case 'username':
				this.usernameErrorMessage = LoginModalComponent.USERNAME_DEFAULT_MESSAGE;
				break;
			case 'password':
				this.passwordErrorMessage = LoginModalComponent.PASSWORD_DEFAULT_MESSAGE;
				break;
			case 'loginId':
				this.loginIdErrorMessage = undefined;
				break;
		}
	}

	signUp() {
		const valid = this.validateEmail() && this.validatePassword() && this.validateUsername();
		if (!valid) {
			this.logger.warn('trying to sign up with invalid email, username or password', this.username, this.email);
			return;
		}
		const credentials = {
			username: this.username,
			password: this.passwordInput,
			email: this.email
		};
		this.store.publishEvent(new CreateAccountEvent(credentials));
	}

	logIn() {
		const credentials = {
			loginId: this.loginId,
			password: this.passwordInput,
		};
		this.store.publishEvent(new LoginEvent(credentials));
	}

	forgotPassword() {
		const credentials = {
			loginId: this.loginId,
		};
		this.store.publishEvent(new ResetPasswordEvent(credentials));

	}

	@HostListener('wheel', ['$event'])
	handleWheelEvent(event) {
	  	event.preventDefault();
	}

	close() {
		this.store.publishEvent(new LoginModalToggleEvent(false));
	}

	private validateEmail(): boolean {
		this.logger.debug('validating email', this.email);
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
	}

	private validatePassword(): boolean {
		return this.passwordInput && this.passwordInput.length >= 6;
	}

	private validateUsername(): boolean {
		return this.username && this.username.length >= 3;
	}
}

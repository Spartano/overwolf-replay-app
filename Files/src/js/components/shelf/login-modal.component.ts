import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { LoginField } from '../../models/shelf/login-field.type';
import { LoginModalInfo } from '../../models/shelf/login-modal-info';
import { LoginModalSection } from '../../models/shelf/login-modal-section.type';
import { ChangeLoginActiveSectionEvent } from '../../services/shelf/store/events/change-login-active-section-event';
import { CreateAccountEvent } from '../../services/shelf/store/events/create-account-event';
import { LoginEvent } from '../../services/shelf/store/events/login-event';
import { LoginModalToggleEvent } from '../../services/shelf/store/events/login-modal-toggle-event';
import { ResetPasswordEvent } from '../../services/shelf/store/events/reset-password-event';
import { ShelfStoreService } from '../../services/shelf/store/shelf-store.service';

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
					<svg
						class="modal-log-in-aside-illustration"
						xmlns="http://www.w3.org/2000/svg"
						width="200"
						height="240"
						viewBox="0 0 200 240"
					>
						<path
							d="M86.32,114.37l-8.16-8.73-4.07,5.24,4.07,11.06ZM152.73,144a20.24,20.24,0,0,0-10.07-14.34,17.67,17.67,0,0,0-4.68-1.86c-1.62-.35-3.28-.28-4.79-1a31.72,31.72,0,0,1-4.1-2.82c-1.61-1.14-3.28-2.21-4.92-3.31l-13.4,8.74L98,114.21,82.82,134,67.4,122.39v0A23,23,0,0,0,47,144.07a23,23,0,0,0,11.32,43.69c7.78,12.75,26.11,14.7,36.37,3.82a30.28,30.28,0,0,0,41.51-4.8A23,23,0,0,0,152.73,144ZM99.21,111.34h0v0Zm12.07-20.6a140.31,140.31,0,0,0,6-13c-5.08-.49-10.19-.74-15.3-.79s-10.27.29-15.41.29a139.59,139.59,0,0,0,12.59,34.08A230.5,230.5,0,0,0,111.28,90.74ZM90.17,58.09c5.14.22,10.29.24,15.43,0,2.48-.11,5-.29,7.43-.52,1.2-.11,2.39-.2,3.58-.37a14.08,14.08,0,0,1,3.64-.46,20.75,20.75,0,0,0-17.19-13.91c-4.13-.47-10.12-.54-13,2.94s-4.18,7.74-4.72,12C86.92,57.93,88.54,58,90.17,58.09Zm30.38-.32c-.09-.35-.19-.69-.3-1C120.36,57.08,120.46,57.43,120.55,57.77Zm.25,1ZM77.56,63.67c0-.5,0-1,.1-1.49a21.12,21.12,0,0,0-.08,3.28C77.55,64.87,77.54,64.27,77.56,63.67ZM110.77,66c0-3.75-5.82-3.75-5.82,0S110.77,69.8,110.77,66ZM99.2,111.36l-.07.1ZM93.3,66c0-3-4.65-3-4.65,0S93.3,69,93.3,66Z"
							fill="#fff"
						/>
						<path
							d="M117.83,153.29c-8,3.9-17.63,4-26,1.53-7.73-2.23-13.94-8.3-17.79-15.21a26.71,26.71,0,0,1-3.63-15l-2.95-2.22c.35,9.85,2.93,20.35,10.34,27.32s17.81,9.14,27.55,8.47c6.05-.41,12.14-2.23,16.89-6.12l0,0c7.61-6.21,10.54-16.13,11.47-25.14l-.11-.07C132,140,127.92,148.35,117.83,153.29ZM139,47.7c-2.45-1-3.31,4.71-3.78,6.11.49-1.46.94-2.94,1.47-4.39.36-1,1.07-2.17,1-3.29-.21-1.85-3.35-1.8-3,.13a1.61,1.61,0,0,0-2.84-.16,8.06,8.06,0,0,0-.82,2.39c-.31,1-.67,2-1,3-.89-.36-5-2.56-4.66,0-.89,1.5,1.87,2.11,2.81,2.33a58.39,58.39,0,0,1,6.63,1.91c.78.29,2,.88,2.79.41s.92-2.17,1.23-3C139.27,51.83,141.07,48.52,139,47.7ZM75.25,55a1.31,1.31,0,0,0-.58-1.75c.36-2.54-3.76-.36-4.66,0-.33-1-.69-2-1-3a7.74,7.74,0,0,0-.83-2.41,1.61,1.61,0,0,0-2.83.17c0-.83,0-1.79-1-2.09a1.55,1.55,0,0,0-2,1.55,9.46,9.46,0,0,0,1,3.33c.49,1.38.94,2.79,1.4,4.19-.56-1.69-.64-3.6-1.65-5.12a1.87,1.87,0,0,0-1.92-1c-1.41.28-1.21,1.77-.94,2.83.39,1.55,1,3.06,1.28,4.63.24,1.15.38,2.37,1.82,2.34s3.12-.89,4.5-1.33q2.82-.9,5.65-1.74A1.3,1.3,0,0,0,75.25,55ZM72.92,78.27c-.33-2.29-.56-4.59-1.11-6.84a39.35,39.35,0,0,1-1.3-6.19c-.17-2-.23-5.53-2.73-6.08-1.44-.32-3.32.5-3.57,2.06s1.14,3.22,1.87,4.56C68.35,70,70.56,74.14,72.92,78.27ZM133,57.93l-.14,0,.58-.58c-3.12-1.84-3.93,3-4.23,5.09-.74,5.13-1.83,10.2-2.76,15.29,2.16-4.31,4.19-8.69,6.36-13C133.75,62.91,136.29,58.85,133,57.93Zm-18.77,50,4.65-4.08L116,102.15l-5.82,1.74ZM88.68,95.21c3.95,6.88,8,12.84,10.45,16.25l.08-.12A139.59,139.59,0,0,1,86.62,77.26a203.13,203.13,0,0,1,30.71.5,158.71,158.71,0,0,1-8.2,17c9.57,1.62,18.37,5.73,23.77,12l-6.61-25.25q-1.67-6.36-3.34-12.72c-.52-2-1.12-3.94-1.55-5.94a60.56,60.56,0,0,0-1.15-6.15,20.81,20.81,0,0,0-4.07.52c-1.43.19-2.87.31-4.31.43-3,.25-5.92.41-8.88.5-5.9.17-11.81,0-17.69-.38C86,52.05,88,47.27,91.69,44.05a21.63,21.63,0,0,0-13,13.18h0c-.14.41-.26.83-.38,1.24h-.19l-9.9,48.92C73,101,80.43,97.05,88.68,95.21Zm19.18-32.08c3.76,0,3.75,5.82,0,5.82S104.1,63.13,107.86,63.13ZM91,63.71c3,0,3,4.66,0,4.66S88,63.71,91,63.71ZM77.66,62.18a21.12,21.12,0,0,0-.08,3.28A21.12,21.12,0,0,1,77.66,62.18Z"
							fill="#dedede"
						/>
					</svg>
				</aside>
				<main class="modal-log-in-main" spellcheck="false">
					<ul class="log-in-sections smooth-scroll">
						<!-- sign up -->
						<li id="sign-up" class="log-in-item" cdkTrapFocus="_activeSection === 'sign-up'">
							<form action="" class="log-in-form">
								<fieldset class="log-in-form-fieldset">
									<legend class="log-in-form-legend">
										<h1 class="log-in-item-h1">Sign up to Zero to Heroes</h1>
									</legend>
									<section class="log-in-form-section input-hint-tooltip-container">
										<label class="log-in-form-label" for="email">Email</label>
										<input
											class="input-text"
											tabindex="0"
											type="email"
											id="email"
											name="email"
											placeholder=""
											[ngClass]="{ 'invalid': errorField === 'email' }"
											(blur)="resetErrorMessage('email')"
											[(ngModel)]="email"
										/>
										<div class="hint-tooltip hint-tooltip-bottom hint-tooltip-aligned-right dark-theme">
											<span [innerHTML]="emailErrorMessage"></span>
										</div>
									</section>
									<section class="log-in-form-section input-hint-tooltip-container">
										<label class="log-in-form-label" for="username">Username</label>
										<input
											class="input-text"
											tabindex="0"
											type="text"
											id="username"
											name="username"
											placeholder=""
											pattern=".{3,}"
											[ngClass]="{ 'invalid': errorField === 'username' }"
											(blur)="resetErrorMessage('username')"
											[(ngModel)]="username"
										/>
										<div class="hint-tooltip hint-tooltip-bottom hint-tooltip-aligned-right dark-theme">
											<span [innerHTML]="usernameErrorMessage"></span>
										</div>
									</section>
									<section class="log-in-form-section input-hint-tooltip-container">
										<label class="log-in-form-label" for="password">Password</label>
										<input
											class="input-text"
											type="password"
											id="password"
											name="password"
											placeholder=""
											pattern=".{6,}"
											[ngClass]="{ 'invalid': errorField === 'password' }"
											(blur)="resetErrorMessage('password')"
											[(ngModel)]="passwordInput"
										/>
										<div class="hint-tooltip hint-tooltip-bottom hint-tooltip-aligned-right dark-theme">
											<span [innerHTML]="passwordErrorMessage"></span>
										</div>
									</section>
									<button class="btn btn-red" (click)="signUp()">Sign up</button>
								</fieldset>
							</form>
							<footer class="log-in-item-footer">
								<p class="log-in-item-p log-in-item-footer-text">
									Already have an account?
									<a class="text-link" (click)="changeActiveSection('sign-in')">Log in</a>
								</p>
							</footer>
						</li>

						<!-- log in -->
						<li id="sign-in" class="log-in-item" cdkTrapFocus="_activeSection === 'sign-in'">
							<form action="" class="log-in-form">
								<fieldset class="log-in-form-fieldset">
									<legend class="log-in-form-legend">
										<h1 class="log-in-item-h1">Log in to Zero to Heroes</h1>
									</legend>
									<section class="log-in-form-section input-hint-tooltip-container">
										<label class="log-in-form-label" for="username">Username or Email</label>
										<input
											class="input-text"
											tabindex="0"
											id="loginId"
											name="loginId"
											placeholder=""
											[ngClass]="{ 'invalid': errorField === 'loginId' }"
											(blur)="resetErrorMessage('loginId')"
											[(ngModel)]="loginId"
										/>
										<div class="hint-tooltip hint-tooltip-bottom hint-tooltip-aligned-right dark-theme">
											<span [innerHTML]="loginIdErrorMessage"></span>
										</div>
									</section>
									<section class="log-in-form-section input-hint-tooltip-container">
										<label class="log-in-form-label" for="password">
											<span>Password</span>
											<a class="text-link" (click)="changeActiveSection('reset-password')">Forgot password?</a>
										</label>
										<input
											class="input-text"
											type="password"
											id="password"
											name="password"
											placeholder=""
											pattern=".{6,}"
											[ngClass]="{ 'invalid': errorField === 'password' }"
											(blur)="resetErrorMessage('password')"
											[(ngModel)]="passwordInput"
										/>
										<div class="hint-tooltip hint-tooltip-bottom hint-tooltip-aligned-right dark-theme">
											<span [innerHTML]="passwordErrorMessage"></span>
										</div>
									</section>
									<button class="btn btn-red" (click)="logIn()">Log in</button>
								</fieldset>
							</form>
							<footer class="log-in-item-footer">
								<p class="log-in-item-p log-in-item-footer-text">
									Don't have an account?
									<a class="text-link" (click)="changeActiveSection('sign-up')">Sign up</a>
								</p>
							</footer>
						</li>

						<!-- reset password -->
						<li id="reset-password" class="log-in-item" cdkTrapFocus="_activeSection === 'reset-password'">
							<form action="" class="log-in-form">
								<fieldset class="log-in-form-fieldset">
									<legend class="log-in-form-legend">
										<h1 class="log-in-item-h1">Reset password</h1>
									</legend>
									<section class="log-in-form-section input-hint-tooltip-container">
										<label class="log-in-form-label" for="username">Username or Email</label>
										<input
											class="input-text"
											tabindex="0"
											id="loginId"
											name="loginId"
											placeholder=""
											[ngClass]="{ 'invalid': errorField === 'loginId' }"
											(blur)="resetErrorMessage('loginId')"
											[(ngModel)]="loginId"
										/>
										<div class="hint-tooltip hint-tooltip-bottom hint-tooltip-aligned-right dark-theme">
											<span [innerHTML]="loginIdErrorMessage"></span>
										</div>
									</section>
									<button class="btn btn-red" (click)="forgotPassword()">Submit</button>

									<!-- display after submit -->
									<p class="log-in-form-text-box" *ngIf="passwordResetSent">
										An email with instractions was sent to this address.
										<button class="text-link" (click)="forgotPassword()">Send again</button>
									</p>
								</fieldset>
							</form>
							<footer class="log-in-item-footer">
								<p class="log-in-item-p log-in-item-footer-text">
									Don't have an account?
									<a class="text-link" (click)="changeActiveSection('sign-up')">Sign up</a>
								</p>
							</footer>
						</li>

						<!-- server error -->
						<li id="error" class="log-in-item log-in-item-error" cdkTrapFocus="_activeSection === 'error'">
							<h1 class="log-in-item-h1">Something went wrong</h1>
							<p class="log-in-item-p">
								An unknown error has happened. Please try again in a few minutes, or contact the support with: Code
								{{ errorCode }}
							</p>
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
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginModalComponent implements AfterViewInit {
	private static readonly EMAIL_DEFAULT_MESSAGE = "This doesn't look<br>like a valid email";
	private static readonly USERNAME_DEFAULT_MESSAGE = 'Username must be<br>at least 3 characters long';
	private static readonly PASSWORD_DEFAULT_MESSAGE = 'Password must be<br>at least 6 characters long';

	_activeSection: string = 'sign-up';

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
	private previouslyVisible = false;

	constructor(private logger: NGXLogger, private store: ShelfStoreService, private el: ElementRef, private cdr: ChangeDetectorRef) {}

	ngAfterViewInit() {
		this.errorDiv = this.el.nativeElement.querySelector('#error');
	}

	@Input('info') set info(value: LoginModalInfo) {
		this.logger.debug('[shelf] [login-modal] setting info', value);
		this.emailErrorMessage = LoginModalComponent.EMAIL_DEFAULT_MESSAGE;
		this.usernameErrorMessage = LoginModalComponent.USERNAME_DEFAULT_MESSAGE;
		this.passwordErrorMessage = LoginModalComponent.PASSWORD_DEFAULT_MESSAGE;
		this.loginIdErrorMessage = undefined;
		this.errorCode = undefined;

		this.logger.debug('[shelf] [login-modal] setting active section', value, this._activeSection);
		if (value.currentSection && this._activeSection !== value.currentSection) {
			this._activeSection = value.currentSection;
			// We're not scrolling, so we want to directly show the new element
			if (!this.previouslyVisible && value.toggled) {
				const listElement: HTMLElement = this.el.nativeElement.querySelector(`ul`);
				this.logger.debug('[shelf] [login-modal] list element', listElement);
				listElement.classList.remove('smooth-scroll');
				this.logger.debug('[shelf] [login-modal] quickly changing active section');
				document.location.href = `#${this._activeSection}`;
				listElement.classList.add('smooth-scroll');
			} else if (value.toggled) {
				const element: HTMLElement = this.el.nativeElement.querySelector(`#${this._activeSection}`);
				this.logger.debug('[shelf] [login-modal] retrieved section element', element, `#${this._activeSection}`);
				// I'm not sure why we need the timeout. Without the timeout I can properly
				// switch between sign-up and sign-in, but it doesn't work for reset-password
				setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }));
			}
		}
		this.previouslyVisible = value.toggled;
		this._activeSection = value.currentSection;

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
					this.logger.debug('[shelf] [login-modal] No error field, showing generic error message', this.errorDiv);
					this.errorCode = value.errorMessage;
					// this.store.publishEvent(new ChangeLoginActiveSectionEvent('error'));
					this.errorDiv.scrollIntoView({ behavior: 'smooth' });
					this._activeSection = 'error';
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
			this.logger.warn('[shelf] [login-modal] trying to sign up with invalid email, username or password', this.username, this.email);
			return;
		}
		const credentials = {
			username: this.username,
			password: this.passwordInput,
			email: this.email,
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

	changeActiveSection(newSection: LoginModalSection): void {
		this.logger.debug('[shelf] [login-modal] changing active section', newSection);
		// this._activeSection = newSection;
		this.store.publishEvent(new ChangeLoginActiveSectionEvent(newSection));
		// if (!(this.cdr as ViewRef).destroyed) {
		// 	this.cdr.detectChanges();
		// }
	}

	@HostListener('wheel', ['$event'])
	handleWheelEvent(event) {
		event.preventDefault();
	}

	close() {
		// this._activeSection = 'sign-up';
		this.store.publishEvent(new LoginModalToggleEvent(false, 'sign-up'));
	}

	private validateEmail(): boolean {
		this.logger.debug('[shelf] [login-modal] validating email', this.email);
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
	}

	private validatePassword(): boolean {
		return this.passwordInput && this.passwordInput.length >= 6;
	}

	private validateUsername(): boolean {
		return this.username && this.username.length >= 3;
	}
}

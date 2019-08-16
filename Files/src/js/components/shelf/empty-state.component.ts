import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { GlobalErrorType } from '../../models/shelf/global-error.type';
import { User } from '../../models/shelf/user';
import { LoginModalToggleEvent } from '../../services/shelf/store/events/login-modal-toggle-event';
import { ShelfStoreService } from '../../services/shelf/store/shelf-store.service';

@Component({
	selector: 'empty-state',
	styleUrls: [
		`../../../css/component/shelf/manastorm-themes.scss`,
		`../../../css/component/shelf/manastorm-fonts.scss`,
		`../../../css/global.scss`,
		`../../../css/component/shelf/empty-state.component.scss`,
	],
	template: `
		<div class="modal-empty-state" [ngClass]="{ 'active': _error }">
			<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
				<polygon points="30 20 62 40 30 60 30 20" fill="#b6b6b6" />
				<path
					d="M40,0A40,40,0,1,0,80,40,40,40,0,0,0,40,0Zm0,4a35.89,35.89,0,0,1,24,9.18L13.18,64A36,36,0,0,1,40,4Zm0,72a35.89,35.89,0,0,1-24-9.18L66.82,16A36,36,0,0,1,40,76Z"
					fill="#dedede"
				/>
			</svg>

			<!-- old sessions error - not logged in -->
			<ng-container *ngIf="_error === 'old-session' && !_user.loggedIn">
				<h1 class="empty-state-h1">This session is only available online</h1>
				<p class="empty-state-p">
					This session is not supported in the new player,<br />but you can still view it on the Zero to Heroes site
				</p>
				<p class="empty-state-p"><strong>Please sign up to continue</strong></p>
				<button class="btn btn-red" (click)="signup()">Sign up</button>
				<p class="empty-state-p">Already have an accoun? <a class="text-link" (click)="login()">Log in</a></p>
			</ng-container>

			<!-- old sessions error - logged in -->
			<ng-container *ngIf="_error === 'old-session' && _user.loggedIn">
				<h1 class="empty-state-h1">This session is only available online</h1>
				<p class="empty-state-p">
					This session is not supported in the new player,<br />but you can still view it on the Zero to Heroes site
				</p>
				<a href="https://www.zerotoheroes.com/s/hearthstone/myVideos/" target="_blank" class="btn btn-red">View online</a>
			</ng-container>

			<!-- general error -->
			<ng-container *ngIf="_error === 'no-match-found'">
				<h1 class="empty-state-h1">No replay was found for this match</h1>
				<p class="empty-state-p">
					Something went wrong with this replay. If you did play<br />a match, try getting support at our
					<strong>Discord channel</strong>
				</p>
				<a href="https://discord.gg/v2a4uR7" target="_blank" class="btn btn-red">Get support</a>
			</ng-container>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
	_error: GlobalErrorType;
	_user: User;

	constructor(private logger: NGXLogger, private store: ShelfStoreService) {}

	@Input('error') set error(value: GlobalErrorType) {
		this.logger.debug('[error-modal] setting error', value);
		this._error = value;
	}

	@Input('user') set user(value: User) {
		this.logger.debug('[header] setting user', value);
		this._user = value;
	}

	login() {
		this.store.publishEvent(new LoginModalToggleEvent(true, 'sign-in'));
	}

	signup() {
		this.store.publishEvent(new LoginModalToggleEvent(true, 'sign-up'));
	}
}

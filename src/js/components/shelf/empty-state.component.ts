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
			<empty-state-illustration></empty-state-illustration>

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

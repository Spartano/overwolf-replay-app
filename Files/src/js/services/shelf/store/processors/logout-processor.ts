import { NGXLogger } from 'ngx-logger';
import { LoginModalInfo } from '../../../../models/shelf/login-modal-info';
import { SettingsMenu } from '../../../../models/shelf/settings-menu';
import { ShelfState } from '../../../../models/shelf/shelf-state';
import { User } from '../../../../models/shelf/user';
import { AccountService } from '../../../account.service';
import { LoginEvent } from '../events/login-event';
import { Processor } from '../processor';

export class LogoutProcessor implements Processor {
	constructor(private account: AccountService, private logger: NGXLogger) {}

	public async process(event: LoginEvent, currentState: ShelfState): Promise<ShelfState> {
		await this.account.disconnect();
		// Force close all open modals
		return Object.assign(new ShelfState(), currentState, {
			user: Object.assign(new User(), currentState.user, {
				loggedIn: false,
				username: undefined,
			} as User),
			loginModalInfo: Object.assign(new LoginModalInfo(), currentState.loginModalInfo, {
				toggled: false,
			} as LoginModalInfo),
			settingsMenu: Object.assign(new SettingsMenu(), currentState.settingsMenu, {
				toggled: false,
			} as SettingsMenu),
		} as ShelfState);
	}
}

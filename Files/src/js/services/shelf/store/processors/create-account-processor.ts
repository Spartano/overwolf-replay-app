import { Processor } from '../processor';
import { ShelfState } from '../../../../models/shelf/shelf-state';
import { SettingsMenu } from '../../../../models/shelf/settings-menu';
import { CreateAccountEvent } from '../events/create-account-event';
import { AccountService } from '../../../account.service';
import { NGXLogger } from 'ngx-logger';
import { User } from '../../../../models/shelf/user';
import { LoginModalInfo } from '../../../../models/shelf/login-modal-info';

export class CreateAccountProcessor implements Processor {

	constructor(private account: AccountService, private logger: NGXLogger) { }

	public async process(event: CreateAccountEvent, currentState: ShelfState): Promise<ShelfState> {
		const result = await this.account.createAccount(event.value);
		return result.error
			? Object.assign(new ShelfState(), currentState, {
						loginModalInfo: Object.assign(new LoginModalInfo(), currentState.loginModalInfo, {
									errorMessage: result.error,
									errorField: result.errorField,
								} as LoginModalInfo),
					} as ShelfState)
			: Object.assign(new ShelfState(), currentState, {
						user: Object.assign(new User(), currentState.user, {
									loggedIn: true,
									username: result.username,
								} as User),
						loginModalInfo: Object.assign(new LoginModalInfo(), currentState.loginModalInfo, {
									toggled: false,
									errorMessage: undefined,
								} as LoginModalInfo),
					} as ShelfState);
	}
}

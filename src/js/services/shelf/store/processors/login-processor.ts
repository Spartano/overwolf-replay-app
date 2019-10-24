import { Processor } from '../processor';
import { ShelfState } from '../../../../models/shelf/shelf-state';
import { AccountService } from '../../../account.service';
import { NGXLogger } from 'ngx-logger';
import { User } from '../../../../models/shelf/user';
import { LoginModalInfo } from '../../../../models/shelf/login-modal-info';
import { LoginEvent } from '../events/login-event';

export class LoginProcessor implements Processor {
	constructor(private account: AccountService, private logger: NGXLogger) {}

	public async process(event: LoginEvent, currentState: ShelfState): Promise<ShelfState> {
		const result = await this.account.login(event.value.loginId, event.value.password);
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

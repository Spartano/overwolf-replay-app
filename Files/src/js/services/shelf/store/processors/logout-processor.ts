import { Processor } from '../processor';
import { ShelfState } from '../../../../models/shelf/shelf-state';
import { AccountService } from '../../../account.service';
import { NGXLogger } from 'ngx-logger';
import { User } from '../../../../models/shelf/user';
import { LoginEvent } from '../events/login-event';

export class LogoutProcessor implements Processor {

	constructor(private account: AccountService, private logger: NGXLogger) { }

	public async process(event: LoginEvent, currentState: ShelfState): Promise<ShelfState> {
		const result = await this.account.disconnect();
		return Object.assign(new ShelfState(), currentState, {
						user: Object.assign(new User(), currentState.user, {
									loggedIn: false,
									username: undefined,
								} as User),
					} as ShelfState);
	}
}

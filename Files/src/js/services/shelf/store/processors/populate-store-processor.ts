import { Processor } from '../processor';
import { PopulateStoreEvent } from '../events/populate-store-event';
import { ShelfState } from '../../../../models/shelf/shelf-state';
import { AccountService } from '../../../account.service';
import { User } from '../../../../models/shelf/user';

export class PopulateStoreProcessor implements Processor {

	constructor(private account: AccountService) { }

	public async process(event: PopulateStoreEvent, currentState: ShelfState): Promise<ShelfState> {
		// Check login status
		const loggedInUser = this.account.getLoggedInUser();
		return Object.assign(new ShelfState(), currentState, {
			user: Object.assign(new User(), currentState.user, {
				loggedIn: loggedInUser.loggedIn,
				username: loggedInUser.username
			} as User)
		} as ShelfState);
	}
}

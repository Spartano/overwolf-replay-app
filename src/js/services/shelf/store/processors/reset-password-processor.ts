import { Processor } from '../processor';
import { ShelfState } from '../../../../models/shelf/shelf-state';
import { AccountService } from '../../../account.service';
import { NGXLogger } from 'ngx-logger';
import { LoginModalInfo } from '../../../../models/shelf/login-modal-info';
import { ResetPasswordEvent } from '../events/reset-password-event';

export class ResetPasswordProcessor implements Processor {
	constructor(private account: AccountService, private logger: NGXLogger) {}

	public async process(event: ResetPasswordEvent, currentState: ShelfState): Promise<ShelfState> {
		const result = await this.account.resetPassword(event.value.loginId);
		return result.error
			? Object.assign(new ShelfState(), currentState, {
					loginModalInfo: Object.assign(new LoginModalInfo(), currentState.loginModalInfo, {
						errorMessage: result.error,
						errorField: result.errorField,
					} as LoginModalInfo),
			  } as ShelfState)
			: Object.assign(new ShelfState(), currentState, {
					loginModalInfo: Object.assign(new LoginModalInfo(), currentState.loginModalInfo, {
						passwordResetSent: true,
					} as LoginModalInfo),
			  } as ShelfState);
	}
}

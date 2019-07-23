import { Processor } from '../processor';
import { ShelfState } from '../../../../models/shelf/shelf-state';
import { LoginModalToggleEvent } from '../events/login-modal-toggle-event';
import { SettingsMenu } from '../../../../models/shelf/settings-menu';
import { LoginModalInfo } from '../../../../models/shelf/login-modal-info';

export class LoginModalToggleProcessor implements Processor {

	public async process(event: LoginModalToggleEvent, currentState: ShelfState): Promise<ShelfState> {
		return Object.assign(new ShelfState(), currentState, {
			settingsMenu: Object.assign(new SettingsMenu(), currentState.settingsMenu, {
						toggled: false
					} as SettingsMenu),
			loginModalInfo: Object.assign(new LoginModalInfo(), currentState.loginModalInfo, {
						toggled: event.value,
						errorMessage: undefined,
					} as LoginModalInfo)
		} as ShelfState);
	}
}

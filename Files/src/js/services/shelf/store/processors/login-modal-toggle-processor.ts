import { LoginModalInfo } from '../../../../models/shelf/login-modal-info';
import { SettingsMenu } from '../../../../models/shelf/settings-menu';
import { ShelfState } from '../../../../models/shelf/shelf-state';
import { LoginModalToggleEvent } from '../events/login-modal-toggle-event';
import { Processor } from '../processor';

export class LoginModalToggleProcessor implements Processor {
	public async process(event: LoginModalToggleEvent, currentState: ShelfState): Promise<ShelfState> {
		return Object.assign(new ShelfState(), currentState, {
			settingsMenu: Object.assign(new SettingsMenu(), currentState.settingsMenu, {
				toggled: false,
			} as SettingsMenu),
			loginModalInfo: Object.assign(new LoginModalInfo(), currentState.loginModalInfo, {
				toggled: event.value,
				errorMessage: undefined,
				passwordResetSent: undefined,
				currentSection: event.activeSection,
			} as LoginModalInfo),
		} as ShelfState);
	}
}

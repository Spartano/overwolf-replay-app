import { LoginModalInfo } from '../../../../models/shelf/login-modal-info';
import { SettingsMenu } from '../../../../models/shelf/settings-menu';
import { ShelfState } from '../../../../models/shelf/shelf-state';
import { ChangeLoginActiveSectionEvent } from '../events/change-login-active-section-event';
import { Processor } from '../processor';

export class ChangeLoginActiveSectionProcessor implements Processor {
	public async process(event: ChangeLoginActiveSectionEvent, currentState: ShelfState): Promise<ShelfState> {
		return Object.assign(new ShelfState(), currentState, {
			settingsMenu: Object.assign(new SettingsMenu(), currentState.settingsMenu, {
				toggled: false,
			} as SettingsMenu),
			loginModalInfo: Object.assign(new LoginModalInfo(), currentState.loginModalInfo, {
				currentSection: event.value,
			} as LoginModalInfo),
		} as ShelfState);
	}
}

import { Processor } from '../processor';
import { ShelfState } from '../../../../models/shelf/shelf-state';
import { SettingsMenuToggleEvent } from '../events/settings-menu-toggle-event';
import { SettingsMenu } from '../../../../models/shelf/settings-menu';

export class SettingsMenuToggleProcessor implements Processor {

	public async process(event: SettingsMenuToggleEvent, currentState: ShelfState): Promise<ShelfState> {
		const newMenu = Object.assign(new SettingsMenu(), currentState.settingsMenu, {
			toggled: !currentState.settingsMenu.toggled
		} as SettingsMenu);
		return Object.assign(new ShelfState(), currentState, {
			settingsMenu: newMenu
		} as ShelfState);
	}
}

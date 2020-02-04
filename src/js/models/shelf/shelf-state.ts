import { Game } from '../game';
import { GlobalErrorType } from './global-error.type';
import { SettingsMenu } from './settings-menu';

export class ShelfState {
	readonly currentGame: Game;
	readonly settingsMenu: SettingsMenu = new SettingsMenu();
	readonly globalError: GlobalErrorType;
}

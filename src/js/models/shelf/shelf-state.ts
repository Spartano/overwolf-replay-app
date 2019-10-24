import { Game } from '../game';
import { GlobalErrorType } from './global-error.type';
import { LoginModalInfo } from './login-modal-info';
import { SettingsMenu } from './settings-menu';
import { User } from './user';

export class ShelfState {
	readonly currentGame: Game;
	readonly user: User = new User();
	readonly settingsMenu: SettingsMenu = new SettingsMenu();
	readonly loginModalInfo: LoginModalInfo = new LoginModalInfo();
	readonly globalError: GlobalErrorType;
}

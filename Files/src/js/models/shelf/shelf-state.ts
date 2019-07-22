import { Game } from '../game';
import { User } from './user';
import { SettingsMenu } from './settings-menu';

export class ShelfState {
	readonly currentGame: Game;
	readonly user: User = new User();
	readonly settingsMenu: SettingsMenu = new SettingsMenu();
}

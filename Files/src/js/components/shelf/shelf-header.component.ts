import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Game } from '../../models/game';
import { SettingsMenu } from '../../models/shelf/settings-menu';
import { User } from '../../models/shelf/user';

@Component({
	selector: 'shelf-header',
	styleUrls: [
		`../../../css/component/shelf/manastorm-themes.scss`,
		`../../../css/component/shelf/manastorm-fonts.scss`,
		`../../../css/global.scss`,
		`../../../css/component/shelf/header.component.scss`,
	],
	template: `
		<header class="manastorm-header">
			<h1 class="manastorm-header-title">{{ title }}</h1>
			<social-share class="ignored-wrapper" [game]="_game"></social-share>
			<div class="gs-icon-divider"></div>
			<settings-menu class="ignored-wrapper" [user]="_user" [menu]="_menu"></settings-menu>
		</header>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShelfHeaderComponent {
	_game: Game;
	_user: User;
	_menu: SettingsMenu;

	title: string;

	constructor(private logger: NGXLogger) {}

	@Input('game') set game(value: Game) {
		this.logger.debug('[header] setting game', value);
		this._game = value;
		this.title = this.buildTitle(value);
	}

	@Input('user') set user(value: User) {
		this.logger.debug('[header] setting user', value);
		this._user = value;
	}

	@Input('menu') set menu(value: SettingsMenu) {
		this.logger.debug('[settings-menu] setting menu', value);
		this._menu = value;
	}

	private buildTitle(game: Game) {
		return game && `${game.player.name} Vs. ${game.opponent.name}`;
	}
}

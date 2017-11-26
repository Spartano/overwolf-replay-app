import { Component, Input } from '@angular/core';

import { ShareProvider, ShareButton } from 'ng2-sharebuttons-ow';

import { Game } from '../models/game';

@Component({
	selector: 'info-zone',
	styleUrls: [`../../css/component/info-zone.component.scss`],
	template: `
		<div class="info-zone">
			<!--<game-info [game]="game"></game-info>-->
			<sharing-zone [game]="game"></sharing-zone>
		</div>
	`,
})

export class InfoZoneComponent {

	@Input() game: Game;
}

import { Injectable } from '@angular/core';
import { LogUtils } from './log-utils.service';

declare var parseCardsText: any;

// const BOSS_IDS = 
// 	[
// 		'BRMA01_1H', 'BRMA01_1', // Coren Direbrew
// 		'BRMA02_1H', // High Justice Grimstone
// 	]

@Injectable()
export class GameModeParser {

	constructor(private logUtils: LogUtils) {

	}

	inferGameMode(currentMode: string, logLine: string): string {
		if (logLine.indexOf('TB_') !== -1) {
			return 'tavern-brawl';
		}
		else if (!currentMode) {
			let cardId = this.logUtils.extractCardId(logLine);
			let card: any = parseCardsText.getCard(cardId);
			if (card && card.set && card.type === 'Hero' && ['core', 'hero_skins'].indexOf(card.set.toLowerCase()) === -1) {
				return 'adventure ' + card.set.toLowerCase();
			}
		}
		return currentMode;
	}
}

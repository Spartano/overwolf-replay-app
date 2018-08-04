import { Injectable } from '@angular/core';

import { LZStringService } from 'ng-lz-string';

import { Game } from '../../models/game';

@Injectable()
export class GameHelper {

	constructor(private lz: LZStringService) {

	}

	public setXmlReplay(game: Game, xml: string) {
		var compressed = this.lz.compress(xml);
		// console.log("Compressed from " + xml.length + " to " + compressed.length);
		game.replay = compressed;
	}

	public getXmlReplay(game: Game): string {
		return this.lz.decompress(game.replay);
	}
}

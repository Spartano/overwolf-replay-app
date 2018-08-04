import { Injectable } from '@angular/core';

import { Game } from '../../models/game';

declare var LZString: any;

@Injectable()
export class GameHelper {

	public setXmlReplay(game: Game, xml: string) {
		var compressed = LZString.compress(xml);
		// console.log("Compressed from " + xml.length + " to " + compressed.length);
		game.replay = compressed;
	}

	public getXmlReplay(game: Game): string {
		return LZString.decompress(game.replay);
	}
}

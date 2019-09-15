import { Injectable } from '@angular/core';
import { SimpleIOService } from '../hs-integration/services/simple-io.service';
import { Game } from '../models/game';
import { Events } from './events.service';
import { GameDbService } from './game-db.service';
import { GameHelper } from './gameparsing/game-helper.service';

@Injectable()
export class ReplayManager {
	constructor(private events: Events, private gameHelper: GameHelper, private gameDb: GameDbService, private plugin: SimpleIOService) {
		console.log('starting replay-manager service');
	}

	public async saveLocally(game: Game) {
		console.log('ready to save game locally');
		if (!game.player || !game.opponent) {
			console.error('[replay-manager] Could not find player and opponent, not saving replay', game.player, game.opponent, game);
			return;
		}
		const plugin = await this.plugin.get();
		const directory = plugin.LOCALAPPDATA + '/Overwolf/ZeroToHeroes/Replays/';
		const playerName = game.player.name.replace('"', '');
		const opponentName = game.opponent.name.replace('"', '');
		const matchupName = `${playerName}(${game.player.class})_vs_${opponentName}(${game.opponent.class})`;
		const fileName = `${matchupName}_${new Date().getTime()}.hszip`;
		console.log('saving locally', directory + fileName);
		plugin.writeLocalAppDataZipFile(
			directory + fileName,
			'replay.xml',
			this.gameHelper.getXmlReplay(game),
			false,
			(status, message) => {
				console.log('local zip file saved', status, message);
				game.path = directory + fileName;

				plugin.getBinaryFile(game.path, -1, async (binaryStatus, data) => {
					console.log('reading binary file before storing it in localstorage', game.path, binaryStatus);
					const split = data.split(',');
					const bytes = [];
					for (let i = 0; i < split.length; i++) {
						bytes[i] = parseInt(split[i]);
					}
					game.replayBytes = bytes;
					await this.gameDb.save(game);
					this.events.broadcast(Events.REPLAY_SAVED, directory + fileName, JSON.stringify(game));
				});
			},
		);
	}
}

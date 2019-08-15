import { Injectable } from '@angular/core';
import { Game, Player } from '../models/game';
import { AllCardsService } from './all-cards.service';
import { GameHelper } from './gameparsing/game-helper.service';

declare var OverwolfPlugin: any;

@Injectable()
export class GameParserService {
	plugin: any;
	initialized: boolean;

	constructor(private gameHelper: GameHelper, private cards: AllCardsService) {
		this.init();
	}

	init(): void {
		// console.log('init game conevrter plugin');
		const plugin = (this.plugin = new OverwolfPlugin('overwolf-replay-converter', true));
		// console.log('plugin', plugin);
		// let that = this;

		plugin.initialize((status: boolean) => {
			if (status === false) {
				console.warn("Plugin couldn't be loaded??");
				// Raven.captureMessage('overwolf-replay-converter plugin could not be loaded');
				return;
			}
			this.initialized = true;
			console.log('Plugin ' + plugin.get()._PluginName_ + ' was loaded!');

			// plugin.get().onGlobalEvent.addListener(function(first, second) {
			// 	console.log('received global event', first, second);
			// });
		});
	}

	// Not externalized, as this will be done inline later on
	convertLogsToXml(stringLogs: string, callback: Function): void {
		if (!this.initialized) {
			// console.log('waiting for game converter plugin initialization');
			setTimeout(() => {
				this.convertLogsToXml(stringLogs, callback);
			}, 100);
			return;
		}

		console.log('converting');
		this.plugin.get().convertLogsToXml(stringLogs, (replayXml: string) => {
			callback(replayXml);
		});
	}

	extractDuration(game: Game) {
		const parser = new DOMParser();
		const replayXml = parser.parseFromString(this.gameHelper.getXmlReplay(game), 'text/xml');
		console.log('parsed', replayXml);

		const timestampedNodes = replayXml.querySelectorAll('[ts]');
		console.log('timestampedNodes', timestampedNodes);
		const firstTimestampInSeconds = this.toTimestamp(timestampedNodes[0].getAttribute('ts'));
		console.log('firstTimestampInSeconds', firstTimestampInSeconds);
		const lastTimestampInSeconds = this.toTimestamp(timestampedNodes[timestampedNodes.length - 1].getAttribute('ts'));
		console.log('lastTimestampInSeconds', lastTimestampInSeconds);
		const durationInSeconds = lastTimestampInSeconds - firstTimestampInSeconds;
		game.durationTimeSeconds = durationInSeconds;

		const tagChangeNodes = replayXml.querySelectorAll('TagChange[entity="1"][tag="19"][value="6"]');
		console.log('tagChangeNodes', tagChangeNodes);
		// Count the number of times the player gets a turn
		game.durationTurns = (tagChangeNodes.length + 1) / 2;
	}

	toTimestamp(ts: string): number {
		const split = ts.split(':');
		const total = parseInt(split[0]) * 3600 + parseInt(split[1]) * 60 + parseInt(split[2].split('.')[0]);
		return total;
	}

	extractMatchup(game: Game): void {
		const parser = new DOMParser();
		const replayXml = parser.parseFromString(this.gameHelper.getXmlReplay(game), 'text/xml');
		console.log('parsed', replayXml);
		// console.log('replayXML', replayXml);
		if (!replayXml) {
			console.warn('invalid game, not adding any meta data');
			// Raven.captureMessage('Could not extract matchup', { extra: {
			// 	game: game
			// }});
			return;
		}

		const mainPlayerId: number = this.getMainPlayerId(replayXml);
		console.log('main player ID', mainPlayerId);
		const mainPlayerEntityId: number = mainPlayerId + 1;
		console.log('mainPlayerEntityId: ', mainPlayerEntityId);

		const gamePlayers: Player[] = this.extractPlayers(replayXml, mainPlayerId);
		console.log('players', gamePlayers);

		game.player = gamePlayers[0];
		game.opponent = gamePlayers[1];

		game.title = game.player.name.replace('"', '') + ' vs ' + game.opponent.name.replace('"', '');

		game.result = this.extractResult(replayXml, mainPlayerEntityId);
		console.log('parsed game');
	}

	extractPlayers(replayXml: any, mainPlayerId: number): Player[] {
		const gamePlayers: Player[] = [];
		const players = replayXml.getElementsByTagName('Player');
		for (const player of players) {
			const gamePlayer: Player = new Player();
			gamePlayer.name = this.extractName(player.getAttribute('name'));
			gamePlayer.hero = this.extractClassCard(replayXml, player);
			gamePlayer.class = this.extractClassFromHero(gamePlayer.hero);
			// console.log('is main player', gamePlayer.name, mainPlayerId, parseInt(player.getAttribute('playerID')), gamePlayer);
			if (parseInt(player.getAttribute('playerID')) === mainPlayerId) {
				// console.log('matching player to', gamePlayer, player);
				gamePlayers[0] = gamePlayer;
			} else {
				// console.log('matching opponent to', gamePlayer, player);
				gamePlayers[1] = gamePlayer;
			}
		}
		return gamePlayers;
	}

	private extractName(nameOrBTag: string): string {
		if (!nameOrBTag) {
			return null;
		}
		return nameOrBTag.indexOf('#') !== -1 ? nameOrBTag.split('#')[0] : nameOrBTag;
	}

	getMainPlayerId(replayXml: any): number {
		const showEntities = replayXml.getElementsByTagName('ShowEntity');
		// console.log('there are ' + showEntities.length + ' ShowEntity elements')
		const fullEntities = replayXml.getElementsByTagName('FullEntity');
		// console.log('there are ' + fullEntities.length + ' FullEntity elements')

		for (const entity of showEntities) {
			// console.log('going over', entity, parseInt(entity.getAttribute('entity')));
			if (entity.getAttribute('cardID')) {
				for (const fullEntity of fullEntities) {
					// console.log('\ttrying to match with', parseInt(fullEntity.getAttribute('id')));
					if (parseInt(fullEntity.getAttribute('id')) === parseInt(entity.getAttribute('entity'))) {
						// console.log('\t\tmatch')
						// CARDTYPE is 202
						const cardType: number = this.getTagValue(fullEntity, 202);
						const zone: number = this.getTagValue(fullEntity, 49);
						// console.log('\t\tcardType', cardType)
						// ENCHANTMENT and SETASIDE
						if (cardType !== 6 && zone !== 6) {
							// CONTROLLER
							const controllerId: number = this.getTagValue(fullEntity, 50);
							// console.log('foundit', controllerId);
							return controllerId;
						}
					}
				}
			}
		}
		// console.log('still hidden')
		return null;
	}

	getTagValue(fullEntity: any, type: number): number {
		const tags = fullEntity.getElementsByTagName('Tag');
		for (const tag of tags) {
			if (parseInt(tag.getAttribute('tag')) === type) {
				return parseInt(tag.getAttribute('value'));
			}
		}
		return null;
	}

	extractClassCard(replayXml: any, player: any) {
		// console.log('building playerClass for ', player, replayXml);
		let playerId: any;
		const nodes = player.childNodes;
		// console.log('\tchildNodes ', nodes)
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			if (node.nodeName === 'Tag' && node.getAttribute('tag') === '27') {
				playerId = node.getAttribute('value');
			}
		}
		// console.log('playerId', playerId);

		let cardId: any;
		const entities = replayXml.getElementsByTagName('FullEntity');
		// console.log('entities', entities.length, entities)
		for (let i = 0; i < entities.length; i++) {
			const entity = entities[i];
			if (entity.getAttribute('id') === playerId) {
				cardId = entity.getAttribute('cardID');
			}
		}
		// console.log('cardId', cardId);

		return cardId;
	}

	extractClassFromHero(hero: string) {
		const heroCard = this.cards.getCard(hero);
		const playerClass = heroCard && heroCard.playerClass && heroCard.playerClass.toLowerCase();
		console.log('extractClassFromHero', hero, playerClass);
		return playerClass;
	}

	extractResult(replayXml: any, mainPlayerId: number): string {
		const tagChanges = replayXml.getElementsByTagName('TagChange');
		// console.log('found ' + tagChanges.length + ' tag changes');
		let winnerTag: any;
		for (const tagChange of tagChanges) {
			// if (tagChange.getAttribute('tag') === '17') {
			// 	console.log('considering', tagChange.getAttribute('tag'), tagChange.getAttribute('value'), tagChange);
			// }
			// PLAYSTATE and WON
			if (parseInt(tagChange.getAttribute('tag')) === 17 && parseInt(tagChange.getAttribute('value')) === 4) {
				winnerTag = tagChange;
				// console.log('\t==================found a winner', winnerTag);
				break;
			}
		}

		// console.log('finding winner', winnerTag, mainPlayerId);
		let status = 'unknown';
		if (winnerTag) {
			if (mainPlayerId === parseInt(winnerTag.getAttribute('entity'))) {
				status = 'won';
			} else {
				status = 'lost';
			}
		} else {
			let tiedTag: any;
			for (const tagChange of tagChanges) {
				// PLAYSTATE and TIED
				if (parseInt(tagChange.getAttribute('value')) === 6) {
					tiedTag = tagChange;
					break;
				}
			}
			if (tiedTag) {
				status = 'tied';
			}
		}
		return status;
	}
}

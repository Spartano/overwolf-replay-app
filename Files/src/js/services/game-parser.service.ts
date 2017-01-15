import { Injectable } from '@angular/core';
import { Game, Player } from '../models/game';

declare var $: any;
declare var parseCardsText: any;

declare var OverwolfPlugin: any;
declare var overwolf: any;

@Injectable()
export class GameParserService {

	plugin: any;
	initialized: boolean;

	constructor() {
		this.init();
	}

	init(): void {
		// console.log('init game conevrter plugin');
		let plugin = this.plugin = new OverwolfPlugin("overwolf-replay-converter", true);
		// console.log('plugin', plugin);
		// let that = this;

		plugin.initialize((status: boolean) => {
			if (status === false) {
				console.error("Plugin couldn't be loaded??");
				return;
			}
			this.initialized = true;
			console.log("Plugin " + plugin.get()._PluginName_ + " was loaded!");

			// plugin.get().onGlobalEvent.addListener(function(first, second) {
			// 	console.log('received global event', first, second);
			// });
		});
	}

	// Not externalized, as this will be done inline later on
	convertLogsToXml(stringLogs: string, game: Game, callbacks: Function[]): void {

		// console.log('trying to convert');

		if (!this.initialized) {
			// console.debug('waiting for game converter plugin initialization');
			setTimeout(() => {
				this.convertLogsToXml(stringLogs, game, callbacks);
			}, 100);
			return;
		}

		// console.log('converting');
		this.plugin.get().convertLogsToXml(stringLogs, (replayXml: string) => {
				// console.debug('received conversion response');
				game.replay = replayXml;
				if (!replayXml) {
					console.warn('could not convert replay', game, stringLogs);
				}
				this.extractMatchup(game);
				// console.log('converted', response
				// console.debug('extracted matchup into', game)
				for (let callback of callbacks) {
					callback(game);
				}
		});
	}

	extractMatchup(game: Game): void {
		let replayXml = $.parseXML(game.replay);
		// console.log('replayXML', replayXml);
		if (!replayXml) {
			console.warn('invalid game, not adding any meta data', game);
			return;
		}

		let mainPlayerId: number = this.getMainPlayerId(replayXml);
		// console.log('main player ID', mainPlayerId);
		let mainPlayerEntityId: number = mainPlayerId + 1;
		// console.log('mainPlayerEntityId: ', mainPlayerEntityId);

		let gamePlayers: Player[] = this.extractPlayers(replayXml, mainPlayerId);
		// console.debug('players', gamePlayers);

		game.player = gamePlayers[0];
		game.opponent = gamePlayers[1];

		game.title = game.player.name + ' vs ' + game.opponent.name;

		game.result = this.extractResult(replayXml, mainPlayerEntityId);
		console.log('parsed game', game);
	}

	extractPlayers(replayXml: any, mainPlayerId: number): Player[] {
		let gamePlayers: Player[] = [];
		let players = replayXml.getElementsByTagName('Player');
		for (let player of players) {
			let gamePlayer: Player = new Player();
			gamePlayer.name = player.getAttribute('name');
			gamePlayer.hero = this.extractClassCard(replayXml, player);
			gamePlayer.class = this.extractClassFromHero(gamePlayer.hero);
			// console.log('is main player', gamePlayer.name, mainPlayerId, parseInt(player.getAttribute('playerID')), gamePlayer);
			if (parseInt(player.getAttribute('playerID')) === mainPlayerId) {
				// console.log('matching player to', gamePlayer, player);
				gamePlayers[0] = gamePlayer;
			}
			else {
				// console.log('matching opponent to', gamePlayer, player);
				gamePlayers[1] = gamePlayer;
			}
		}
		return gamePlayers;
	}

	getMainPlayerId(replayXml: any): number {
		let showEntities = replayXml.getElementsByTagName('ShowEntity');
		// console.log('there are ' + showEntities.length + ' ShowEntity elements')
		let fullEntities = replayXml.getElementsByTagName('FullEntity');
		// console.log('there are ' + fullEntities.length + ' FullEntity elements')

		for (let entity of showEntities) {
			// console.log('going over', entity, parseInt(entity.getAttribute('entity')));
			if (entity.getAttribute('cardID')) {

				for (let fullEntity of fullEntities) {
					// console.log('\ttrying to match with', parseInt(fullEntity.getAttribute('id')));
					if (parseInt(fullEntity.getAttribute('id')) === parseInt(entity.getAttribute('entity'))) {
						// console.log('\t\tmatch')
						// CARDTYPE is 202
						let cardType: number = this.getTagValue(fullEntity, 202);
						// console.log('\t\tcardType', cardType)
						// ENCHANTMENT
						if (cardType !== 6) {
							// CONTROLLER
							let controllerId: number = this.getTagValue(fullEntity, 50);
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
		let tags = fullEntity.getElementsByTagName('Tag');
		for (let tag of tags) {
			if (parseInt(tag.getAttribute('tag')) === type) {
				return parseInt(tag.getAttribute('value'));
			}
		}
		return null;
	}

	extractClassCard(replayXml: any, player: any) {
		// console.debug('building playerClass for ', player, replayXml);
		let playerId: any;
		let nodes = player.childNodes;
		// console.debug('\tchildNodes ', nodes)
		for (let i = 0; i < nodes.length; i++) {
			let node = nodes[i];
			if (node.nodeName === 'Tag' && node.getAttribute('tag') === '27') {
				playerId = node.getAttribute('value');
			}
		}
		// console.debug('playerId', playerId);

		let cardId: any;
		let entities = replayXml.getElementsByTagName('FullEntity');
		// console.debug('entities', entities.length, entities)
		for (let i = 0; i < entities.length; i++) {
			let entity = entities[i];
			if (entity.getAttribute('id') === playerId) {
				cardId = entity.getAttribute('cardID');
			}
		}
		// console.log('cardId', cardId);

		return cardId;
	}

	extractClassFromHero(hero: string) {
		// console.debug('cardId', cardId)
		// console.log('extractClassFromHero', hero, parseCardsText.getCard(hero));

		let playerClass = parseCardsText.getCard(hero).playerClass.toLowerCase();
		// console.debug('playerClass', playerClass);
		return playerClass;
	}

	extractResult(replayXml: any, mainPlayerId: number): string {

		let tagChanges = replayXml.getElementsByTagName('TagChange');
		// console.log('found ' + tagChanges.length + ' tag changes');
		let winnerTag: any;
		for (let tagChange of tagChanges) {
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
			}
			else {
				status = 'lost';
			}
		}
		else {
			let tiedTag: any;
			for (let tagChange of tagChanges) {
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

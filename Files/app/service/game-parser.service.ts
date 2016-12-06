import { Injectable } from '@angular/core';
import { Game, Player } from '../model/game';

declare var $:any
declare var parseCardsText:any

@Injectable()
export class GameParserService {
	// Not externalized, as this will be done inline later on
	convertLogsToXml(stringLogs:string, game:Game, callbacks:Function[]):void {
		// console.log('converting')
		var data = new FormData()
		data.append('data', stringLogs)
		let _this = this;
		$.ajax({
			url: 'http://www.zerotoheroes.com/api/hearthstone/converter/replay',
			data: data,
		    cache: false,
		    contentType: false,
		    processData: false,
		    type: 'POST',
			// dataType: 'xml',
			success: function(response:any) {
				// console.debug('received conversion response')
				game.replay = response
				_this.extractMatchup(game);
				// console.log('converted', response
				// console.debug('extracted matchup into', game)
				for (let callback of callbacks) {
					callback(game);
				}
			}
		})
	}

	extractMatchup(game:Game):void {
		var replayXml = $.parseXML(game.replay);
		// console.log('replayXML', replayXml);

		// console.debug('parsing replay', replayXml)
		let mainPlayerId = this.getMainPlayerId(replayXml);
		// console.log('main player ID', mainPlayerId);

		// console.debug('players', players)
		let gamePlayers:Player[] = this.extractPlayers(replayXml, mainPlayerId);

		game.player = gamePlayers[0];
		game.opponent = gamePlayers[1];

		game.title = game.player.name + ' vs ' + game.opponent.name;

		game.result = this.extractResult(replayXml, mainPlayerId);
		console.log('parsed game', game);
	}

	extractPlayers(replayXml:any, mainPlayerId:number):Player[] {
		let gamePlayers:Player[] = [];
		var players = replayXml.getElementsByTagName('Player')
		for (let player of players) {
			let gamePlayer:Player = new Player();
			gamePlayer.name = player.getAttribute('name');
			gamePlayer.hero = this.extractClassCard(replayXml, player);
			gamePlayer.class = this.extractClassFromHero(gamePlayer.hero);
			// console.log('is main player', gamePlayer.name, mainPlayerId, parseInt(player.getAttribute('playerID')), gamePlayer)
			if (parseInt(player.getAttribute('playerID')) == mainPlayerId) {
				gamePlayers[0] = gamePlayer;
			}
			else {
				gamePlayers[1] = gamePlayer;
			}
		}
		return gamePlayers;
	} 

	getMainPlayerId(replayXml:any) {
		let showEntities = replayXml.getElementsByTagName('ShowEntity');
		// console.log('there are ' + showEntities.length + ' ShowEntity elements')
		let fullEntities = replayXml.getElementsByTagName('FullEntity');
		// console.log('there are ' + fullEntities.length + ' FullEntity elements')

		for (let entity of showEntities) {
			// console.log('going over', entity, parseInt(entity.getAttribute('entity')));
			if (entity.getAttribute('cardID')) {

				for (let fullEntity of fullEntities) {
					// console.log('\ttrying to match with', parseInt(fullEntity.getAttribute('id')));
					if (parseInt(fullEntity.getAttribute('id')) == parseInt(entity.getAttribute('entity'))) {
						// console.log('\t\tmatch')
						// CARDTYPE is 202
						let cardType:number = this.getTagValue(fullEntity, 202);
						// console.log('\t\tcardType', cardType)
						// ENCHANTMENT
						if (cardType != 6) {
							// CONTROLLER
							let controllerId = this.getTagValue(fullEntity, 50);
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

	getTagValue(fullEntity:any, type:number):number {
		let tags = fullEntity.getElementsByTagName('Tag');
		for (let tag of tags) {
			if (parseInt(tag.getAttribute('tag')) == type) {
				return parseInt(tag.getAttribute('value'));
			}
		}
		return null;
	}

	extractClassCard(replayXml:any, player:any) {
		// console.debug('building playerClass for ', player, replayXml)
		var playerId:any
		var nodes = player.childNodes
		// console.debug('\tchildNodes ', nodes)
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i]
			if (node.nodeName == 'Tag' && node.getAttribute('tag') == '27') {
				playerId = node.getAttribute('value')
			}
		}
		// console.debug('playerId', playerId)

		var cardId:any;
		var entities = replayXml.getElementsByTagName('FullEntity')
		// console.debug('entities', entities.length, entities)
		for (var i = 0; i < entities.length; i++) {
			var entity = entities[i]
			if (entity.getAttribute('id') == playerId) {
				cardId = entity.getAttribute('cardID')
			}
		}

		return cardId;
	}

	extractClassFromHero(hero:string) {
		// console.debug('cardId', cardId)

		var playerClass = parseCardsText.getCard(hero).playerClass.toLowerCase()
		// console.debug('playerClass', playerClass)
		return playerClass
	}

	extractResult(replayXml:any, mainPlayerId:number):string {

		let tagChanges = replayXml.getElementsByTagName('TagChange');
		// console.log('found ' + tagChanges.length + ' tag changes');
		let winnerTag:any;
		for (let tagChange of tagChanges) {
			// if (tagChange.getAttribute('tag') == '17') {
			// 	console.log('considering', tagChange.getAttribute('tag'), tagChange.getAttribute('value'), tagChange);
			// }
			// PLAYSTATE and WON
			if (parseInt(tagChange.getAttribute('value')) == 4) {
				// console.log('\t==================found a winner', winnerTag);
				winnerTag = tagChange;
				break;
			} 
		}

		let status:string = 'unknown';
		if (winnerTag) {
			if (mainPlayerId == parseInt(winnerTag.getAttribute('entity'))) {
				status = 'won';
			}
			else {
				status = 'lost';
			}
		}
		else {
			let tiedTag:any;
			for (let tagChange of tagChanges) {
				// PLAYSTATE and TIED
				if (parseInt(tagChange.getAttribute('value')) == 6) {
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
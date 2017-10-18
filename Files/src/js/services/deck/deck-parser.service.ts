import { Injectable } from '@angular/core';

// import * as Raven from 'raven-js';

import { encode } from 'deckstrings';

import { Deck, Card } from '../../models/deck';

declare var OverwolfPlugin: any;
declare var overwolf: any;
declare var parseCardsText: any;

@Injectable()
export class DeckParserService {
	plugin: any;
	mindvisionPlugin: any;

	public activeDeckstring: string;

	constructor() {
		console.log("loading mindvision");
		this.mindvisionPlugin = new OverwolfPlugin("mindvision", true);
		this.mindvisionPlugin.initialize((status: boolean) => {
			if (status === false) {
				console.warn("Plugin mindvision couldn't be loaded");
				// Raven.captureMessage('mindvision plugin could not be loaded');
				return;
			}
			console.log("Plugin " + this.mindvisionPlugin.get()._PluginName_ + " was loaded!", this.mindvisionPlugin.get());
			this.mindvisionPlugin.get().onGlobalEvent.addListener(function(first, second) {
				console.log('received global event mindvision', first, second);
			});
		});
	}

	public detectActiveDeck() {
		this.mindvisionPlugin.get().getActiveDeck((activeDeck) => {
			// console.log('activeDeck', activeDeck);
			try {
				let jsonDeck = JSON.parse(activeDeck);
				if (jsonDeck.Hero) {
					let deck: Deck = <Deck>jsonDeck;
					console.log('deck', deck);
					let name = deck.Name;
					let hero = deck.Hero;
					let isWild = deck.IsWild;
					let cards = deck.Cards;

					console.log('parsing with', parseCardsText);

					let hearthDbDeck = {
						cards: [],
						heroes: [parseCardsText.getCard(hero).dbfId],
						format: isWild ? 1 : 2,
					}

					for (let card of cards) {
						let dbfId = parseCardsText.getCard(card.Id).dbfId;
						hearthDbDeck.cards.push([dbfId, card.Count]);
					}

					console.log('hearthDbDeck', hearthDbDeck);

					this.activeDeckstring = encode(hearthDbDeck);
					console.log('deckstring', this.activeDeckstring);
				}
			}
			catch (e) {
				console.log('Could not parse deck', e, activeDeck);
			}
		});
	}
}

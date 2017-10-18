import { Injectable } from '@angular/core';

// import * as Raven from 'raven-js';

import { encode } from 'deckstrings';

import { MemoryInspectionService } from '../plugins/memory-inspection.service';
import { Deck, Card } from '../../models/deck';

declare var OverwolfPlugin: any;
declare var overwolf: any;
declare var parseCardsText: any;

@Injectable()
export class DeckParserService {
	plugin: any;

	public activeDeckstring: string;

	constructor(private memoryInspectionService: MemoryInspectionService) {
	}

	public detectActiveDeck() {
		console.log('detecting active deck');
		this.memoryInspectionService.getActiveDeck((activeDeck) => {
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

import { Injectable } from '@angular/core';

// import * as Raven from 'raven-js';
import * as _ from "lodash";

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
		this.memoryInspectionService.getActiveDeck((activeDeck) => {
			try {
				let jsonDeck = JSON.parse(activeDeck);
				if (jsonDeck.Hero) {
					let deck: Deck = <Deck>jsonDeck;
					let name = deck.Name;
					let hero = deck.Hero;
					let isWild = deck.IsWild;
					let cards = deck.Cards;

					let hearthDbDeck = {
						cards: [],
						heroes: [parseCardsText.getCard(hero).dbfId],
						format: isWild ? 1 : 2,
					}

					for (let card of cards) {
						let dbfId = parseCardsText.getCard(card.Id).dbfId;
						hearthDbDeck.cards.push([dbfId, card.Count]);
					}

					hearthDbDeck.cards = _.sortBy(hearthDbDeck.cards, [o => o[0]]);

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

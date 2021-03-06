import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

const CARDS_CDN_URL = 'https://static.zerotoheroes.com/hearthstone/jsoncards/cards.json';

@Injectable()
export class AllCardsService {
	private allCards: any[];

	constructor(private http: HttpClient, private logger: NGXLogger) {
		// We don't call it in the constructor because we want the app to be in control
		// of how they load the cards, and for it to be aware of when cards have been loaded
		// this.retrieveAllCards();
	}

	// We keep this synchronous because we ensure, in the game init pipeline, that loading cards
	// is the first thing we do
	public getCard(id: string): any {
		const candidates = this.allCards.filter(card => card.id === id);
		if (!candidates || candidates.length === 0) {
			console.debug('Could not find card for id', id);
			return {};
		}
		return candidates[0];
	}

	public async initializeCardsDb(): Promise<void> {
		this.logger.debug('[all-cards] initializing card db');
		return new Promise<void>((resolve, reject) => {
			if (this.allCards) {
				this.logger.debug('[all-cards] already loaded all cards');
				resolve();
				return;
			}
			this.logger.debug('[all-cards] retrieving local cards');
			this.http
				.get('./cards.json')
				.pipe(
					timeout(200),
					catchError((error, caught) => {
						this.logger.debug('[all-cards] Could not retrieve cards locally, getting them from CDN', error);
						this.http.get(CARDS_CDN_URL).subscribe(
							(result: any[]) => {
								this.logger.debug('[all-cards] retrieved all cards from CDN');
								this.allCards = result;
								resolve();
								return of(null);
							},
							error => {
								this.logger.debug('[all-cards] Could not retrieve cards from CDN', error);
								return of(null);
							},
						);
						return of(null);
					}),
				)
				.subscribe(
					(result: any[]) => {
						if (result) {
							this.logger.debug('[all-cards] retrieved all cards locally');
							this.allCards = result;
							resolve();
						}
					},
					error => {},
				);
		});
	}
}

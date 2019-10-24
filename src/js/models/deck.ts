export interface Deck {
	Id: number;
	Name: string;
	Hero: string;
	IsWild: boolean;
	Type: number;
	SeasonId: number;
	CardBackId: number;
	HeroPremium: number;

	Cards: Card[];
}

export interface Card {
	Id: string;
	Count: number;
	Premium: boolean;
}

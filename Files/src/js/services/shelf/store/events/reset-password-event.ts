import { ShelfStoreEvent } from '../shelf-store-event';

export class ResetPasswordEvent implements ShelfStoreEvent {

	constructor(public value: { loginId: string }) { }

	public static eventName(): string {
		return 'ResetPasswordEvent';
	}

	public eventName(): string {
		return 'ResetPasswordEvent';
	}
}

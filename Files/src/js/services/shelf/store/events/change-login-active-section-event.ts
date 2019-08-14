import { LoginModalSection } from '../../../../models/shelf/login-modal-section.type';
import { ShelfStoreEvent } from '../shelf-store-event';

export class ChangeLoginActiveSectionEvent implements ShelfStoreEvent {
	constructor(public value: LoginModalSection) {}

	public static eventName(): string {
		return 'ChangeLoginActiveSectionEvent';
	}

	public eventName(): string {
		return 'ChangeLoginActiveSectionEvent';
	}
}

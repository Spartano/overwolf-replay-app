import { ShelfStoreEvent } from '../shelf-store-event';

export class SettingsMenuToggleEvent implements ShelfStoreEvent {
	public static eventName(): string {
		return 'SettingsMenuToggleEvent';
	}

	public eventName(): string {
		return 'SettingsMenuToggleEvent';
	}
}

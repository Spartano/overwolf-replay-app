import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ShelfStoreEvent } from './shelf-store-event';
import { ShelfState } from '../../../models/shelf/shelf-state';
import { Processor } from './processor';
import { NGXLogger } from 'ngx-logger';
import { PopulateStoreEvent } from './events/populate-store-event';
import { Map } from 'immutable';
import { PopulateStoreProcessor } from './processors/populate-store-processor';
import { GameSelectedEvent } from './events/game-selected-event';
import { GameSelectedProcessor } from './processors/game-selected-processor';
import { SettingsMenuToggleEvent } from './events/settings-menu-toggle-event';
import { SettingsMenuToggleProcessor } from './processors/settings-menu-toggle-processor';
import { LoginModalToggleEvent } from './events/login-modal-toggle-event';
import { LoginModalToggleProcessor } from './processors/login-modal-toggle-processor';
import { CreateAccountEvent } from './events/create-account-event';
import { CreateAccountProcessor } from './processors/create-account-processor';
import { AccountService } from '../../account.service';
import { LoginEvent } from './events/login-event';
import { LoginProcessor } from './processors/login-processor';
import { LogoutEvent } from './events/logout-event';
import { LogoutProcessor } from './processors/logout-processor';
import { ResetPasswordEvent } from './events/reset-password-event';
import { ResetPasswordProcessor } from './processors/reset-password-processor';

@Injectable()
export class ShelfStoreService {
	private state: ShelfState = new ShelfState();
	private stateUpdater = new EventEmitter<ShelfStoreEvent>();
	private stateEmitter = new BehaviorSubject<ShelfState>(this.state);

	private processors: Map<string, Processor>;
	private eventQueue: ShelfStoreEvent[] = [];
	private isProcessing = false;

	constructor(private logger: NGXLogger, private accountService: AccountService) {
		this.processors = this.buildProcessors();
		this.stateUpdater.subscribe((event: ShelfStoreEvent) => {
			this.eventQueue.push(event);
			// So that we don't wait for the next tick in case the event can be processed right away
			this.processQueue();
		});
		setInterval(() => this.processQueue(), 50);
		this.stateUpdater.next(new PopulateStoreEvent());
	}

	public onStateChanged(listener) {
		this.stateEmitter.subscribe(data => listener(data));
	}

	public publishEvent(event: ShelfStoreEvent) {
		this.stateUpdater.next(event);
	}

	// We want events to be processed sequentially
	private async processQueue() {
		if (this.isProcessing || this.eventQueue.length === 0) {
			return;
		}
		this.isProcessing = true;
		const event = this.eventQueue.shift();
		this.logger.debug('[store] processing event', event.eventName(), event);
		const processor: Processor = this.processors.get(event.eventName());
		const newState = await processor.process(event, this.state);
		if (newState) {
			this.state = newState;
			this.stateEmitter.next(this.state);
		} else {
			this.logger.debug('[store] no new state to emit');
		}
		this.isProcessing = false;
	}

	private buildProcessors(): Map<string, Processor> {
		return Map.of(
			PopulateStoreEvent.eventName(),
			new PopulateStoreProcessor(this.accountService),
			GameSelectedEvent.eventName(),
			new GameSelectedProcessor(),
			SettingsMenuToggleEvent.eventName(),
			new SettingsMenuToggleProcessor(),
			LoginModalToggleEvent.eventName(),
			new LoginModalToggleProcessor(),
			CreateAccountEvent.eventName(),
			new CreateAccountProcessor(this.accountService, this.logger),
			LoginEvent.eventName(),
			new LoginProcessor(this.accountService, this.logger),
			LogoutEvent.eventName(),
			new LogoutProcessor(this.accountService, this.logger),
			ResetPasswordEvent.eventName(),
			new ResetPasswordProcessor(this.accountService, this.logger),
		);
	}
}

import { EventEmitter, Injectable } from '@angular/core';
import { Map } from 'immutable';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';
import { ShelfState } from '../../../models/shelf/shelf-state';
import { GameSelectedEvent } from './events/game-selected-event';
import { GlobalErrorEvent } from './events/global-error-event';
import { PopulateStoreEvent } from './events/populate-store-event';
import { SettingsMenuToggleEvent } from './events/settings-menu-toggle-event';
import { Processor } from './processor';
import { GameSelectedProcessor } from './processors/game-selected-processor';
import { GlobalEventProcessor } from './processors/global-event-processor';
import { PopulateStoreProcessor } from './processors/populate-store-processor';
import { SettingsMenuToggleProcessor } from './processors/settings-menu-toggle-processor';
import { ShelfStoreEvent } from './shelf-store-event';

@Injectable()
export class ShelfStoreService {
	private state: ShelfState = new ShelfState();
	private stateUpdater = new EventEmitter<ShelfStoreEvent>();
	private stateEmitter = new BehaviorSubject<ShelfState>(this.state);

	private processors: Map<string, Processor>;
	private eventQueue: ShelfStoreEvent[] = [];
	private isProcessing = false;

	constructor(private logger: NGXLogger) {
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
		if (this.eventQueue.length === 0) {
			return;
		}
		if (this.isProcessing) {
			// this.logger.debug('[store] queue already processing, returning');
			return;
		}
		// this.logger.debug('[store] will process event');
		this.isProcessing = true;
		const event = this.eventQueue.shift();
		this.logger.debug('[store] processing event', event.eventName());
		const processor: Processor = this.processors.get(event.eventName());
		const newState = await processor.process(event, this.state);
		if (newState) {
			this.state = newState;
			// this.logger.debug('[store] emitted new state', this.state);
			this.stateEmitter.next(this.state);
		} else {
			this.logger.debug('[store] no new state to emit');
		}
		this.isProcessing = false;
		// this.logger.debug('[store] processing event over', event.eventName());
	}

	private buildProcessors(): Map<string, Processor> {
		return Map.of(
			PopulateStoreEvent.eventName(),
			new PopulateStoreProcessor(),

			GameSelectedEvent.eventName(),
			new GameSelectedProcessor(),

			SettingsMenuToggleEvent.eventName(),
			new SettingsMenuToggleProcessor(),

			GlobalErrorEvent.eventName(),
			new GlobalEventProcessor(),
		);
	}
}

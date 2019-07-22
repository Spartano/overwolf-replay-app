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

@Injectable()
export class ShelfStoreService {

	private state: ShelfState = new ShelfState();
	private stateUpdater = new EventEmitter<ShelfStoreEvent>();
	private stateEmitter = new BehaviorSubject<ShelfState>(this.state);

	private processors: Map<String, Processor>;
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

	private buildProcessors(): Map<String, Processor> {
		return Map.of(
			PopulateStoreEvent.eventName(), new PopulateStoreProcessor(),
			GameSelectedEvent.eventName(), new GameSelectedProcessor(),
			SettingsMenuToggleEvent.eventName(), new SettingsMenuToggleProcessor(),
		);
	}
}

import { NgModule, ErrorHandler }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';

// import * as Raven from 'raven-js';

import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import { LZStringModule, LZStringService } from 'ng-lz-string';

import { AppComponent }  from '../../components/app.component';

// import { GameService } from './game.service';
import { GameStorageService } from '../../services/game-storage.service';
import { OwCommunicationService	} from '../../services/ow-communcation.service';
// import { GameRetrieveService } from './service/game-retrieve.service';
import { LogListenerService } from '../../services/log-listener.service';
import { PublicEventsService } from '../../services/public-events.service';
import { StorageHelperService } from '../../services/storage-helper.service';
import { GameParserService } from '../../services/game-parser.service';
import { GameModeParser } from '../../services/gameparsing/game-mode-parser.service';
import { ReplayManager } from '../../services/replay-manager.service';
import { GameHelper } from '../../services/gameparsing/game-helper.service';
import { LogUtils } from '../../services/gameparsing/log-utils.service';
import { Events } from '../../services/events.service';
import { ReplayUploader } from '../../services/replay-uploader.service';
import { FileUploadService } from '../../services/file-upload.service';
import { GameEvents } from '../../services/game-events.service';
import { GameMonitorService } from '../../services/gameparsing/game-monitor.service';
import { UserPreferences } from '../../services/user-preferences.service';
import { DeckLogListenerService } from '../../services/deck/deck-log-listener.service';
import { DeckParserService } from '../../services/deck/deck-parser.service';
import { DebugService } from '../../services/debug.service';
import { MemoryInspectionService } from '../../services/plugins/memory-inspection.service';
import { SimpleIOService } from '../../services/plugins/simple-io.service';

// console.log('configuring Raven'),
// Raven
//   	.config('https://c08a7bdf3f174ff2b45ad33bcf8c48f6@sentry.io/202626')
//   	.install();
// console.log('Raven configured');

//  export class RavenErrorHandler implements ErrorHandler {
//   	handleError(err: any) : void {
// 	  	console.log('error captured by Raven', err);
// 	    // Raven.captureException(err);
//   	}
// }

@NgModule({
	imports: [
		BrowserModule,
		HttpModule,
		LocalStorageModule.withConfig({
			prefix: 'replay-viewer',
			storageType: 'localStorage',
		}),
		LZStringModule,
	],
	declarations: [
		AppComponent,
	],
	bootstrap: [
		AppComponent,
	],
	providers: [
		GameParserService,
		GameStorageService,
		LogListenerService,
		PublicEventsService,
		UserPreferences,
		LocalStorageService,
		GameModeParser,
		ReplayManager,
		LogUtils,
		Events,
		ReplayUploader,
		FileUploadService,
		OwCommunicationService,
		DeckLogListenerService,
		DeckParserService,
		StorageHelperService,
		GameHelper,
		MemoryInspectionService,
		SimpleIOService,
		DebugService,
		GameEvents,
		GameMonitorService,
		LZStringService,
		// { provide: ErrorHandler, useClass: RavenErrorHandler },
	],
})

export class AppModule { }

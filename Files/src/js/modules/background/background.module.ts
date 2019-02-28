import { NgModule, Injectable, ErrorHandler }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';

import { init, captureException } from "@sentry/browser";

import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import { LZStringModule, LZStringService } from 'ng-lz-string';

import { AppComponent }  from '../../components/app.component';

import { GameStorageService } from '../../services/game-storage.service';
import { OwCommunicationService	} from '../../services/ow-communcation.service';
import { LogListenerService } from '../../services/log-listener.service';
import { PublicEventsService } from '../../services/public-events.service';
import { StorageHelperService } from '../../services/storage-helper.service';
import { GameParserService } from '../../services/game-parser.service';
import { ReplayManager } from '../../services/replay-manager.service';
import { GameHelper } from '../../services/gameparsing/game-helper.service';
import { LogUtils } from '../../services/gameparsing/log-utils.service';
import { Events } from '../../services/events.service';
import { ReplayUploader } from '../../services/replay-uploader.service';
import { FileUploadService } from '../../services/file-upload.service';
import { GameEvents } from '../../services/game-events.service';
import { GameMonitorService } from '../../services/gameparsing/game-monitor.service';
import { UserPreferences } from '../../services/user-preferences.service';
import { DeckParserService } from '../../services/deck/deck-parser.service';
import { DebugService } from '../../services/debug.service';
import { MemoryInspectionService } from '../../services/plugins/memory-inspection.service';
import { SimpleIOService } from '../../services/plugins/simple-io.service';
import { LogRegisterService } from '../../services/log-register.service';

init({
	dsn: "https://04ea3bd09a4643afa04bce95efcd80b1@sentry.io/1405254",
	enabled: process.env.NODE_ENV === 'production'
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  	constructor() {}
  	handleError(error) {
    	captureException(error.originalError || error);
    	throw error;
  	}
}

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
		{ provide: ErrorHandler, useClass: SentryErrorHandler },

		GameParserService,
		GameStorageService,
		LogListenerService,
		PublicEventsService,
		UserPreferences,
		LocalStorageService,
		ReplayManager,
		LogUtils,
		Events,
		ReplayUploader,
		FileUploadService,
		OwCommunicationService,
		LogRegisterService,
		DeckParserService,
		StorageHelperService,
		GameHelper,
		MemoryInspectionService,
		SimpleIOService,
		DebugService,
		GameEvents,
		GameMonitorService,
		LZStringService,
	],
})

export class AppModule { }

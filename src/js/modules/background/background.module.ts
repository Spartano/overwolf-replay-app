import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserOptions, captureException, init } from '@sentry/browser';
import { LocalStorageModule, LocalStorageService } from 'angular-2-local-storage';
import { LZStringModule, LZStringService } from 'ng-lz-string';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { AppComponent } from '../../components/app.component';
import { DeckParserService } from '../../hs-integration/services/deck-parser.service';
import { GameEventsEmitterService } from '../../hs-integration/services/game-events-emitter.service';
import { GameEventsPluginService } from '../../hs-integration/services/game-events-plugin.service';
import { GameEvents } from '../../hs-integration/services/game-events.service';
import { LogsUploaderService } from '../../hs-integration/services/logs-uploader.service';
import { MemoryInspectionService } from '../../hs-integration/services/memory-inspection.service';
import { OverwolfService } from '../../hs-integration/services/overwolf.service';
import { PlayersInfoService } from '../../hs-integration/services/players-info.service';
import { S3FileUploadService } from '../../hs-integration/services/s3-file-upload.service';
import { SimpleIOService } from '../../hs-integration/services/simple-io.service';
import { AllCardsService } from '../../services/all-cards.service';
import { DebugService } from '../../services/debug.service';
import { EndGameUploaderService } from '../../services/endgame/end-game-uploader.service';
import { Events } from '../../services/events.service';
import { FileUploadService } from '../../services/file-upload.service';
import { GameDbService } from '../../services/game-db.service';
import { GameParserService } from '../../services/game-parser.service';
import { GameHelper } from '../../services/gameparsing/game-helper.service';
import { GameMonitorService } from '../../services/gameparsing/game-monitor.service';
import { LogUtils } from '../../services/gameparsing/log-utils.service';
import { LogListenerService } from '../../services/log-listener.service';
import { LogRegisterService } from '../../services/log-register.service';
import { ReplayManager } from '../../services/replay-manager.service';
import { ReplayUploader } from '../../services/replay-uploader.service';

console.log('version is ' + process.env.APP_VERSION);
console.log('env is', process.env.NODE_ENV);

init({
	dsn: 'https://04ea3bd09a4643afa04bce95efcd80b1@sentry.io/1405254',
	enabled: process.env.NODE_ENV === 'production',
	release: process.env.APP_VERSION,
} as BrowserOptions);

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
		HttpClientModule,
		LocalStorageModule.forRoot({
			prefix: 'replay-viewer',
			storageType: 'localStorage',
		}),
		LZStringModule,
		LoggerModule.forRoot({ level: NgxLoggerLevel.DEBUG }),
	],
	declarations: [AppComponent],
	bootstrap: [AppComponent],
	providers: [
		{ provide: ErrorHandler, useClass: SentryErrorHandler },

		GameEventsEmitterService,
		PlayersInfoService,
		LogsUploaderService,

		GameParserService,
		GameDbService,
		LogListenerService,
		LocalStorageService,
		ReplayManager,
		LogUtils,
		MemoryInspectionService,
		Events,
		ReplayUploader,
		FileUploadService,
		LogRegisterService,
		DeckParserService,
		GameHelper,
		SimpleIOService,
		DebugService,
		GameEvents,
		GameMonitorService,
		EndGameUploaderService,
		LZStringService,
		S3FileUploadService,
		GameEventsPluginService,

		AllCardsService,
		OverwolfService,
	],
})
export class AppModule {}

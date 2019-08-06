import { NgModule, Injectable, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { init, captureException, BrowserOptions } from '@sentry/browser';
import { ShareModule } from '@ngx-share/core';

import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import { LZStringModule, LZStringService } from 'ng-lz-string';

import { ShelfComponent } from '../../components/shelf/shelf.component';

import { GameParserService } from '../../services/game-parser.service';
import { AccountService } from '../../services/account.service';
import { UserPreferences } from '../../services/user-preferences.service';
import { FileUploadService } from '../../services/file-upload.service';
import { GameUploadService } from '../../services/game-upload.service';
import { DebugService } from '../../services/debug.service';
import { Events } from '../../services/events.service';
import { SharingService } from '../../services/sharing.service';
import { GameHelper } from '../../services/gameparsing/game-helper.service';
import { OverwolfService } from '../../services/overwolf.service';
import { GameReplayComponent } from '../../components/shelf/game-replay.component';
import { ShelfApiService } from '../../services/shelf/shelf-api.service';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { ShelfHeaderComponent } from '../../components/shelf/shelf-header.component';
import { SocialShareComponent } from '../../components/shelf/social-share.component';
import { SettingsMenuComponent } from '../../components/shelf/settings-menu.component';
import { ShelfStoreService } from '../../services/shelf/store/shelf-store.service';
import { ShelfApiListenerService } from '../../services/shelf/shelf-api-listener.service';
import { LoginModalComponent } from '../../components/shelf/login-modal.component';
import { GameDbService } from '../../services/game-db.service';

console.log('version is ' + process.env.APP_VERSION);

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
		// For ShareButtons, need to use https://www.npmjs.com/package/ngx-social-button instead
		LocalStorageModule.forRoot({
			prefix: 'replay-viewer',
			storageType: 'localStorage',
		}),
		FormsModule,
		ReactiveFormsModule,
		LZStringModule,
		LoggerModule.forRoot({ level: NgxLoggerLevel.DEBUG }),
		ShareModule,
	],
	declarations: [
		ShelfComponent,
		GameReplayComponent,
		ShelfHeaderComponent,
		SocialShareComponent,
		SettingsMenuComponent,
		LoginModalComponent,
	],
	bootstrap: [ShelfComponent],
	providers: [
		GameDbService,
		GameParserService,
		UserPreferences,
		LocalStorageService,
		AccountService,
		FileUploadService,
		Events,
		GameHelper,
		GameUploadService,
		DebugService,
		SharingService,
		LZStringService,
		OverwolfService,

		ShelfApiService,
		ShelfStoreService,
		ShelfApiListenerService,
	],
})
export class ShelfModule {}

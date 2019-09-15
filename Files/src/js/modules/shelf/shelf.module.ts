import { A11yModule } from '@angular/cdk/a11y';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, Injectable, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ShareModule } from '@ngx-share/core';
import { BrowserOptions, captureException, init } from '@sentry/browser';
import { LocalStorageModule, LocalStorageService } from 'angular-2-local-storage';
import { LZStringModule, LZStringService } from 'ng-lz-string';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { EmptyStateIllustrationComponent } from '../../components/shelf/empty-state-illustration.component';
import { EmptyStateComponent } from '../../components/shelf/empty-state.component';
import { GameReplayComponent } from '../../components/shelf/game-replay.component';
import { LoginModalComponent } from '../../components/shelf/login-modal.component';
import { SettingsMenuComponent } from '../../components/shelf/settings-menu.component';
import { ShelfHeaderComponent } from '../../components/shelf/shelf-header.component';
import { ShelfComponent } from '../../components/shelf/shelf.component';
import { SocialShareComponent } from '../../components/shelf/social-share.component';
import { OverwolfService } from '../../hs-integration/services/overwolf.service';
import { AccountService } from '../../services/account.service';
import { DebugService } from '../../services/debug.service';
import { Events } from '../../services/events.service';
import { FileUploadService } from '../../services/file-upload.service';
import { GameDbService } from '../../services/game-db.service';
import { GameUploadService } from '../../services/game-upload.service';
import { GameHelper } from '../../services/gameparsing/game-helper.service';
import { SharingService } from '../../services/sharing.service';
import { ShelfApiService } from '../../services/shelf/shelf-api.service';
import { ShelfStoreService } from '../../services/shelf/store/shelf-store.service';
import { UserPreferences } from '../../services/user-preferences.service';

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
		A11yModule,
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
		EmptyStateComponent,
		EmptyStateIllustrationComponent,
	],
	bootstrap: [ShelfComponent],
	providers: [
		{ provide: ErrorHandler, useClass: SentryErrorHandler },

		GameDbService,
		// GameParserService,
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
	],
})
export class ShelfModule {}

import { NgModule, Injectable, ErrorHandler }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { init, captureException } from "@sentry/browser";

import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import { LZStringModule, LZStringService } from 'ng-lz-string';
import { ShareButtonsModule } from 'ng2-sharebuttons-ow';

import { ShelfComponent }  from '../../components/shelf.component';
import { ShelfWithGamesComponent }  from '../../components/shelf-with-games.component';
import { LoadingComponent } from '../../components/loading.component';
import { GlobalErrorComponent } from '../../components/global-error.component';
import { FirstTimeComponent } from '../../components/first-time.component';
import { EmptyShelfComponent }  from '../../components/empty-shelf.component';
import { GameReplayComponent } from '../../components/game-replay.component';
import { CarouselComponent } from '../../components/carousel.component';
import { SharingZoneComponent } from '../../components/sharing-zone.component';
import { InfoZoneComponent } from '../../components/info-zone.component';
import { GameInfoComponent } from '../../components/game-info.component';
import { GameThumbnailComponent } from '../../components/game-thumbnail.component';
import { HeroAvatarComponent } from '../../components/hero-avatar.component';
import { UploadProgressComponent } from '../../components/upload-progress.component';
import { UploadSocialComponent } from '../../components/upload-social.component';
import { LoginComponent } from '../../components/login.component';

import { GameRetrieveService } from '../../services/game-retrieve.service';
import { StorageHelperService } from '../../services/storage-helper.service';
import { GameParserService } from '../../services/game-parser.service';
import { AccountService } from '../../services/account.service';
import { UserPreferences } from '../../services/user-preferences.service';
import { FileUploadService } from '../../services/file-upload.service';
import { GameStorageService } from '../../services/game-storage.service';
import { GameUploadService } from '../../services/game-upload.service';
import { DebugService } from '../../services/debug.service';
import { Events } from '../../services/events.service';
import { SharingService } from '../../services/sharing.service';
import { GameHelper } from '../../services/gameparsing/game-helper.service';
import { OverwolfService } from '../../services/overwolf.service';
import { HttpModule } from '@angular/http';

console.log('version is ' + process.env.APP_VERSION);

init({
	dsn: "https://04ea3bd09a4643afa04bce95efcd80b1@sentry.io/1405254",
	enabled: process.env.NODE_ENV === 'production',
	release: process.env.APP_VERSION
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
	imports:      [
		BrowserModule,
        HttpClientModule,
        HttpModule, // For ShareButtons, need to use https://www.npmjs.com/package/ngx-social-button instead
		LocalStorageModule.withConfig({
			prefix: 'replay-viewer',
			storageType: 'localStorage',
		}),
		ShareButtonsModule.forRoot(),
		FormsModule,
		ReactiveFormsModule,
		LZStringModule,
	],
	declarations: [
		CarouselComponent,
		GameReplayComponent,
		SharingZoneComponent,
		InfoZoneComponent,
		GameInfoComponent,
		GameThumbnailComponent,
		HeroAvatarComponent,
		ShelfComponent,
		ShelfWithGamesComponent,
		EmptyShelfComponent,
		GlobalErrorComponent,
		FirstTimeComponent,
		LoadingComponent,
		LoginComponent,
		UploadProgressComponent,
		UploadSocialComponent,
	],
	bootstrap: [
		ShelfComponent,
	],
	providers: [
		GameRetrieveService,
		GameParserService,
		UserPreferences,
		LocalStorageService,
		AccountService,
		FileUploadService,
		GameStorageService,
		Events,
		GameHelper,
		StorageHelperService,
		GameUploadService,
		DebugService,
		SharingService,
		LZStringService,
		OverwolfService,
	],
})

export class ShelfModule { }

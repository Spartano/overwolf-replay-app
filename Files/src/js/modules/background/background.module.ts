import { NgModule, ErrorHandler }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';

import * as Raven from 'raven-js';

import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';

import { AppComponent }  from '../../components/app.component';
import { GameReplayComponent } from '../../components/game-replay.component';
import { CarouselComponent } from '../../components/carousel.component';
import { GameThumbnailComponent } from '../../components/game-thumbnail.component';
import { HeroAvatarComponent } from '../../components/hero-avatar.component';

// import { GameService } from './game.service';
import { GameStorageService } from '../../services/game-storage.service';
import { OwCommunicationService	} from '../../services/ow-communcation.service';
// import { GameRetrieveService } from './service/game-retrieve.service';
import { LogListenerService } from '../../services/log-listener.service';
import { StorageHelperService } from '../../services/storage-helper.service';
import { GameParserService } from '../../services/game-parser.service';
import { LogParserService } from '../../services/gameparsing/log-parser.service';
import { GameModeParser } from '../../services/gameparsing/game-mode-parser.service';
import { ReplayManager } from '../../services/replay-manager.service';
import { LogUtils } from '../../services/gameparsing/log-utils.service';
import { Events } from '../../services/events.service';
import { ReplayUploader } from '../../services/replay-uploader.service';
import { FileUploadService } from '../../services/file-upload.service';
import { UserPreferences } from '../../services/user-preferences.service';
import { DeckLogListenerService } from '../../services/deck/deck-log-listener.service';
import { DeckParserService } from '../../services/deck/deck-parser.service';

console.log('configuring Raven'),
Raven
  	.config('https://c08a7bdf3f174ff2b45ad33bcf8c48f6@sentry.io/202626')
  	.install();
console.log('Raven configured');

 export class RavenErrorHandler implements ErrorHandler {
  	handleError(err: any) : void {
	  	console.log('error captured by Raven', err);
	    // Raven.captureException(err);
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
	],
	declarations: [
		AppComponent,
		CarouselComponent,
		GameReplayComponent,
		GameThumbnailComponent,
		HeroAvatarComponent,
	],
	bootstrap: [
		AppComponent,
	],
	providers: [
		GameStorageService,
		UserPreferences,
		LogListenerService,
		GameParserService,
		LogParserService,
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
		{ provide: ErrorHandler, useClass: RavenErrorHandler },
	],
})

export class AppModule { }

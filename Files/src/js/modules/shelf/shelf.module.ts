import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';

import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import { ShareButtonsModule } from 'ng2-sharebuttons';

import { ShelfComponent }  from '../../components/shelf.component';
import { EmptyShelfComponent }  from '../../components/empty-shelf.component';
import { GameReplayComponent } from '../../components/game-replay.component';
import { CarouselComponent } from '../../components/carousel.component';
import { SharingZoneComponent } from '../../components/sharing-zone.component';
import { InfoZoneComponent } from '../../components/info-zone.component';
import { GameInfoComponent } from '../../components/game-info.component';
import { GameThumbnailComponent } from '../../components/game-thumbnail.component';
import { HeroAvatarComponent } from '../../components/hero-avatar.component';

import { GameRetrieveService } from '../../services/game-retrieve.service';
import { LogListenerService } from '../../services/log-listener.service';
import { GameParserService } from '../../services/game-parser.service';
import { AccountService } from '../../services/account.service';

@NgModule({
	imports:      [
		BrowserModule,
		HttpModule,
		LocalStorageModule.withConfig({
			prefix: 'replay-viewer',
			storageType: 'localStorage',
		}),
		ShareButtonsModule.forRoot(),
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
		EmptyShelfComponent,
	],
	bootstrap: [
		ShelfComponent,
	],
	providers: [
		GameRetrieveService,
		LogListenerService,
		GameParserService,
		LocalStorageService,
		AccountService,
	],
})

export class ShelfModule { }

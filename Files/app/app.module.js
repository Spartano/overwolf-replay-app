"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var http_1 = require('@angular/http');
var app_component_1 = require('./component/app/app.component');
var game_replay_component_1 = require('./component/game-replay/game-replay.component');
var carousel_component_1 = require('./component/carousel/carousel.component');
var game_thumbnail_component_1 = require('./component/game-thumbnail/game-thumbnail.component');
var hero_avatar_component_1 = require('./component/game-thumbnail/hero-avatar.component');
// import { GameService } from './game.service';
var game_service_1 = require('./service/game.service');
var log_listener_service_1 = require('./service/log-listener.service');
var game_parser_service_1 = require('./service/game-parser.service');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                http_1.HttpModule
            ],
            declarations: [
                app_component_1.AppComponent,
                game_replay_component_1.GameReplayComponent,
                carousel_component_1.CarouselComponent,
                game_thumbnail_component_1.GameThumbnailComponent,
                hero_avatar_component_1.HeroAvatarComponent
            ],
            bootstrap: [
                app_component_1.AppComponent
            ],
            providers: [
                game_service_1.GameService,
                log_listener_service_1.LogListenerService,
                game_parser_service_1.GameParserService
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
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
var game_replay_component_1 = require('../game-replay/game-replay.component');
var carousel_component_1 = require('../carousel/carousel.component');
// import { GameService } from './game.service';
var game_service_1 = require('../../service/game.service');
var AppComponent = (function () {
    function AppComponent(gameService) {
        this.gameService = gameService;
        this.name = 'Hearthstone Replay Viewer';
        this.games = [];
        // console.log('in AppComponent constructor', gameService)
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.zone = new core_1.NgZone({ enableLongStackTrace: false });
        this.gameService.getGames().subscribe(function (game) {
            // http://stackoverflow.com/questions/31706948/angular2-view-not-changing-after-data-is-updated
            _this.zone.run(function () {
                // console.debug('loading game via subscription', game);
                _this.games.push(game);
                _this.games.push(game);
                _this.games.push(game);
                _this.games.push(game);
                _this.games.push(game);
                _this.games.push(game);
                _this.games.push(game);
                _this.games.push(game);
                _this.carouselComponent.newGame(game);
            });
        });
    };
    AppComponent.prototype.onGameSelected = function (game) {
        console.log('reloading game', game);
        this.selectedGame = game;
        this.gameReplayComponent.reload(game.replay);
    };
    __decorate([
        core_1.ViewChild(carousel_component_1.CarouselComponent), 
        __metadata('design:type', carousel_component_1.CarouselComponent)
    ], AppComponent.prototype, "carouselComponent", void 0);
    __decorate([
        core_1.ViewChild(game_replay_component_1.GameReplayComponent), 
        __metadata('design:type', game_replay_component_1.GameReplayComponent)
    ], AppComponent.prototype, "gameReplayComponent", void 0);
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'zh-app',
            styleUrls: ["app.css"],
            template: "\n\t\t<div class=\"shelf-container\">\n\t\t\t<div class=\"replay-zone\">\n\t\t\t\t<h1 class=\"matchup-title\" *ngIf=\"selectedGame && selectedGame.player\">{{selectedGame.player.name}} Vs. {{selectedGame.opponent.name}}</h1>\n\t\t\t\t<game-replay [game]=\"selectedGame\"></game-replay>\n\t\t\t</div>\n\t\t\t<carousel [games]=\"games\" (onGameSelected)=onGameSelected($event)></carousel>\n\t\t</div>\n\t"
        }), 
        __metadata('design:paramtypes', [game_service_1.GameService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map
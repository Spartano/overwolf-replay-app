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
var Subject_1 = require('rxjs/Subject');
var game_1 = require('../model/game');
var GameService = (function () {
    function GameService() {
        // @Input()
        this.games = [];
        this.subject = new Subject_1.Subject();
        console.log('in mock GameService constructor');
        this.init();
    }
    GameService.prototype.init = function () {
        var _this = this;
        setTimeout(function () {
            for (var i = 0; i < 11; i++) {
                var game = new game_1.Game();
                game.result = i % 2 == 0 ? "won" : "lost";
                game.player.name = "Player";
                game.player.class = "warrior";
                game.player.hero = "HERO_01";
                game.opponent.name = "Opponent";
                game.opponent.class = "mage";
                game.opponent.hero = "HERO_08a";
                game.title = game.player.name + i + " Vs. " + game.opponent.name;
                _this.games.push(game);
                _this.subject.next(game);
            }
        }, 2000);
    };
    GameService.prototype.getGames = function () {
        return this.subject.asObservable();
    };
    GameService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], GameService);
    return GameService;
}());
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map
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
var game_1 = require('../../model/game');
var GameThumbnailComponent = (function () {
    function GameThumbnailComponent() {
    }
    GameThumbnailComponent.prototype.getGameResultString = function (result) {
        var resultString;
        switch (result) {
            case "won":
                resultString = "Victory";
                break;
            case "lost":
                resultString = "Defeat";
                break;
            default:
                resultString = "Tie";
                break;
        }
        return resultString;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', game_1.Game)
    ], GameThumbnailComponent.prototype, "game", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], GameThumbnailComponent.prototype, "selected", void 0);
    GameThumbnailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'game-thumbnail',
            styleUrls: ['game-thumbnail.css'],
            template: "\n\t\t<div class=\"game {{game.result}}\" [class.selected]=\"selected\" *ngIf=\"game\">\n\t\t\t<div class=\"matchup\">\n\t\t\t\t<div class=\"highlighter\"></div>\n\t\t\t\t<hero-avatar [hero]=\"game.player.hero\" [won]=\"game.result == 'won'\"></hero-avatar>\n\t\t\t\t<div class=\"separator\">VS</div>\n\t\t\t\t<hero-avatar [hero]=\"game.opponent.hero\" [won]=\"game.result == 'lost'\"></hero-avatar>\n\t\t\t</div>\n\t\t\t<div class=\"game-info\">\n\t\t\t\t<span class=\"title\">{{game.title}}</span>\n\t\t\t\t<span class=\"result\">{{getGameResultString(game.result)}}</span>\n\t\t\t</div>\n\t\t</div>\n\t"
        }), 
        __metadata('design:paramtypes', [])
    ], GameThumbnailComponent);
    return GameThumbnailComponent;
}());
exports.GameThumbnailComponent = GameThumbnailComponent;
//# sourceMappingURL=game-thumbnail.component.js.map
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
var log_listener_service_1 = require('../../service/log-listener.service');
var AppComponent = (function () {
    function AppComponent(logListenerService) {
        this.logListenerService = logListenerService;
        this.init();
    }
    AppComponent.prototype.init = function () {
        var _this = this;
        console.log('init gameservice', overwolf.egs);
        this.logListenerService.addGameCompleteListener(function (game) {
            if (!_this.requestedDisplayOnShelf) {
                _this.requestDisplayOnShelf();
            }
        });
    };
    AppComponent.prototype.requestDisplayOnShelf = function () {
        console.log('requesting display on shelf', overwolf.egs);
        overwolf.egs.isEnabled(function (result) {
            console.log('egs is enabled', result);
            // result.status == ["success"| "error"]
            // result.isEnabled == [true | false]
            if (result.status == 'success' && result.isEnabled) {
                console.log('requesting to display', result);
                overwolf.egs.requestToDisplay(function (result) {
                    // result.status == ["success" | "error"]
                    // result.reason == [undefined | "EndGameScreen is disabled" | "Not accepting shelves"]
                    console.log('requestToDisplay result', result);
                    if (result.status == 'success') {
                        console.log('request to display is a success, OW should call shelf.html which will trigger status listening process updates on its side');
                        this.requestedDisplayOnShelf = true;
                    }
                });
            }
            // else {
            // 	// Debug only
            // 	this.showShelfWindow();
            // }
        });
    };
    AppComponent.prototype.showShelfWindow = function () {
        console.log('opening shelf window');
        overwolf.windows.obtainDeclaredWindow('ShelfWindow', function (result) {
            if (result.status == "success") {
                overwolf.windows.restore(result.window.id, function (result) {
                    console.log(result);
                });
            }
        });
    };
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'zh-app',
            styleUrls: ["app.css"],
            template: "\n\t\t<div></div>\n\t"
        }), 
        __metadata('design:paramtypes', [log_listener_service_1.LogListenerService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map
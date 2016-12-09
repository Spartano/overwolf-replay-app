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
var game_1 = require('../model/game');
var game_parser_service_1 = require('./game-parser.service');
var HEARTHSTONE_GAME_ID = 8032; //9898;
var LogListenerService = (function () {
    function LogListenerService(gameParserService) {
        this.gameParserService = gameParserService;
        // games: Game[] = [];
        this.gameCompleteListeners = [];
        // console.log('in LogListener constructor');
        this.init();
    }
    LogListenerService.prototype.init = function () {
        console.log('initializing LogListenerService', this.plugin);
        this.monitoring = false;
        this.gameStarted = false;
        this.fullLogs = '';
        // this.logsLocation = 'F:\\Games\\Hearthstone\\Logs\\Power.log';
        var plugin = this.plugin = new OverwolfPlugin("simple-io-plugin", true);
        console.log('plugin', plugin);
        var that = this;
        plugin.initialize(function (status) {
            if (status == false) {
                console.error("Plugin couldn't be loaded??");
                return;
            }
            console.log("Plugin " + plugin.get()._PluginName_ + " was loaded!");
            // Registering game listener
            overwolf.games.onGameInfoUpdated.addListener(function (res) {
                console.log("onGameInfoUpdated: " + JSON.stringify(res));
                if (that.gameLaunched(res)) {
                    // registerEvents()
                    that.logsLocation = res.gameInfo.executionPath.split('Hearthstone.exe')[0] + 'Logs\\Power.log';
                    console.log('getting logs from', that.logsLocation);
                    that.registerLogMonitor();
                }
            });
            overwolf.games.getRunningGameInfo(function (res) {
                console.log("getRunningGameInfo: " + JSON.stringify(res));
                if (res && res.isRunning && res.id && Math.floor(res.id / 10) == HEARTHSTONE_GAME_ID) {
                    console.log('running!', res);
                    that.logsLocation = res.executionPath.split('Hearthstone.exe')[0] + 'Logs\\Power.log';
                    console.log('getting logs from', that.logsLocation);
                    // registerEvents()
                    that.registerLogMonitor();
                }
            });
        });
    };
    LogListenerService.prototype.addGameCompleteListener = function (listener) {
        this.gameCompleteListeners.push(listener);
    };
    LogListenerService.prototype.registerLogMonitor = function () {
        if (this.monitoring) {
            console.log('log hooks already registered, returning');
            return;
        }
        console.log('registering hooks');
        var logItemIndex = 0;
        this.listenOnFile(this.logsLocation);
        this.monitoring = true;
    };
    LogListenerService.prototype.listenOnFile = function (logsLocation) {
        console.log('starting to listen on file', logsLocation);
        this.listenOnFileCreation(logsLocation);
    };
    LogListenerService.prototype.listenOnFileCreation = function (logsLocation) {
        var that = this;
        this.plugin.get().fileExists(logsLocation, function (status) {
            if (status === true) {
                that.listenOnFileUpdate(logsLocation);
            }
            else {
                setTimeout(function () { that.listenOnFileCreation(logsLocation); }, 1000);
            }
        });
    };
    LogListenerService.prototype.listenOnFileUpdate = function (logsLocation) {
        var fileIdentifier = "hs-logs-file";
        var that = this;
        // Register file listener
        this.plugin.get().onFileListenerChanged.addListener(function (id, status, data) {
            if (!status) {
                console.error("received an error on file: " + id + ": " + data);
                return;
            }
            if (id == fileIdentifier) {
                // Don't use the PowerTaskList
                if (data.indexOf('PowerTaskList') != -1 || data.indexOf('PowerProcessor') != -1) {
                    return;
                }
                // console.log('file listening callback', fieldId, status, data)
                // New game
                if (data.indexOf('CREATE_GAME') != -1) {
                    console.log('reinit game');
                    that.fullLogs = '';
                    that.gameStarted = true;
                }
                that.fullLogs += data + '\n';
                // that's how we know a game is finished
                if (data.indexOf('GOLD_REWARD_STATE') != -1 && that.gameStarted) {
                    console.log('game ended');
                    that.gameStarted = false;
                    var game = new game_1.Game();
                    // Will be synchronous later on
                    that.gameParserService.convertLogsToXml(that.fullLogs, game, that.gameCompleteListeners);
                    that.fullLogs = '';
                }
            }
            else {
                console.error('could not listen to file callback');
            }
        });
        this.plugin.get().listenOnFile(fileIdentifier, logsLocation, false, function (id, status, initData) {
            if (id == fileIdentifier) {
                if (status) {
                    console.log("[" + id + "] now streaming...");
                }
                else {
                    console.log("something bad happened with: " + id);
                }
            }
        });
    };
    LogListenerService.prototype.gameLaunched = function (gameInfoResult) {
        if (!gameInfoResult) {
            return false;
        }
        if (!gameInfoResult.gameInfo) {
            return false;
        }
        if (!gameInfoResult.runningChanged && !gameInfoResult.gameChanged) {
            return false;
        }
        if (!gameInfoResult.gameInfo.isRunning) {
            return false;
        }
        // NOTE: we divide by 10 to get the game class id without it's sequence number
        if (Math.floor(gameInfoResult.gameInfo.id / 10) != HEARTHSTONE_GAME_ID) {
            return false;
        }
        console.log("HS Launched");
        return true;
    };
    LogListenerService.prototype.gameRunning = function (gameInfo) {
        if (!gameInfo) {
            return false;
        }
        if (!gameInfo.isRunning) {
            return false;
        }
        // NOTE: we divide by 10 to get the game class id without it's sequence number
        if (Math.floor(gameInfo.id / 10) != HEARTHSTONE_GAME_ID) {
            return false;
        }
        console.log("HS running");
        return true;
    };
    LogListenerService = __decorate([
        //9898;
        core_1.Injectable(), 
        __metadata('design:paramtypes', [game_parser_service_1.GameParserService])
    ], LogListenerService);
    return LogListenerService;
}());
exports.LogListenerService = LogListenerService;
//# sourceMappingURL=log-listener.service.js.map
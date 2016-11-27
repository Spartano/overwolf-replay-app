function gameLaunched(gameInfoResult) {
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
	if (Math.floor(gameInfoResult.gameInfo.id/10) != 9898) {
		return false;
	}

	console.log("HS Launched");
	return true;
}

function gameRunning(gameInfo) {

	if (!gameInfo) {
		return false;
	}

	if (!gameInfo.isRunning) {
		return false;
	}

	// NOTE: we divide by 10 to get the game class id without it's sequence number
	if (Math.floor(gameInfo.id/10) != 9898) {
		return false;
	}

	console.log("HS running");
	return true;
}

var monitoring = false
var fullLogs = ''
var gameStarted = false

// ========================
// TODOs:
// * Unhardcode the Power.log path
// * Doesn't work when stop then start game once again
// * Use offline parser instead of WS call
// * Get a code review - looks dirty, thanks no JS experience :) Mainly interested in how to handle the listen of file if files doesn't exist yet
// * Don't hardcode line separator?
// * And work on the user flows
// * Don't re-upload a game when exiting / launching HS back again
// ========================

function registerLogMonitor() {
	if (monitoring) {
		console.log('log hooks already registered, returning')
		return
	}
	console.log('registering hooks')
	// TODO: deduce this from the game's running path
	var logsLocation = 'F:\\Games\\Hearthstone\\Logs\\Power.log'

	var logItemIndex = 0
    listenOnFile(logsLocation)

	monitoring = true
}

function listenOnFile(logsLocation) {
	console.log('starting to listen on file')
    var fileId = "hs-logs-file"
	plugin.get().listenOnFile(fileId, logsLocation, false, function(id, status, data) { 
		console.log('listenOnFile', id, status, data)

		if (status) {
  			// console.log("[" + fileId + "] ", id, status);
  			plugin.get().onFileListenerChanged.addListener(function(fieldId, status, data) {
				if (status) {
					// Don't use the PowerTaskList
					if (data.indexOf('PowerTaskList') != -1 || data.indexOf('PowerProcessor') != -1) {
						return
					}
					console.log('file listening callback', fieldId, status, data)
					// New game
					if (data.indexOf('CREATE_GAME') != -1) {
						console.log('reinit game')
						fullLogs = ''
						gameStarted = true
					}
					fullLogs += data + '\n'
					// That's how we know a game is finished
					if (data.indexOf('GOLD_REWARD_STATE') != -1 && gameStarted) {
						console.log('game ended')
						gameStarted = false
						var xml = convertLogsToXml(fullLogs)
						fullLogs = ''
					}
				}
				else {
					console.error('could not listen to file callback')
				}
			})
		} 
		else {
  			console.log('something bad happened: ', id, status);
  			// Power.log is only created once the first game starts
  			setTimeout(function() { listenOnFile() }, 10000)
		}
	});
}

// Start here
var plugin = new OverwolfPlugin("simple-io-plugin", true);
// console.log('initializing plugin')
plugin.initialize(function(status) {
	// console.log('init done', status, plugin)
  	if (status == false) {
    	console.error("Plugin couldn't be loaded??")
    	return;
  	}
  	// console.log("Plugin " + plugin.get()._PluginName_ + " was loaded!");

  	// Registering game listener
	overwolf.games.onGameInfoUpdated.addListener(function (res) {
		console.log("onGameInfoUpdated: " + JSON.stringify(res));
		if (gameLaunched(res)) {
			// registerEvents()
			registerLogMonitor()
		}
	})

	overwolf.games.getRunningGameInfo(function (res) {
		console.log("getRunningGameInfo: " + JSON.stringify(res));
		if (res && res.isRunning && res.id && Math.floor(res.id / 10) == 9898) {
			console.log('running!', res)
			// registerEvents()
			registerLogMonitor()
		}
	})
})

function convertLogsToXml(stringLogs) {
	console.log('converting', stringLogs)
	var data = new FormData()
	data.append('data', stringLogs)
	$.ajax({
		url: 'http://localhost:8080/api/hearthstone/converter/replay',
		data: data,
	    cache: false,
	    contentType: false,
	    processData: false,
	    type: 'POST',
		// dataType: 'xml',
		success: function(response) {
			// console.log('converted', response
			manastorm.reload(response)
		}
	})
}
function registerEvents() {
	// general events errors
	overwolf.games.events.onError.addListener(function(info) {
		console.log("Error: " + JSON.stringify(info));
	});

	// This will also be triggered the first time we register
	// for events and will contain all the current information
	overwolf.games.events.onInfoUpdates2.addListener(function(info) {
		console.log("Info UPDATE: " + JSON.stringify(info));
	});

	// an event triggerd
	overwolf.games.events.onNewEvents.addListener(function(info) {
		console.log("EVENT FIRED: " + JSON.stringify(info));
	});
}

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

function registerLogMonitor() {
	// TODO: deduce this from the game's running path
	var logsLocation = 'F:\\Games\\Hearthstone\\Logs\\Power.log'

	plugin.get().fileExists(logsLocation, function(status) {
		if (status === true) {
	    	console.log(logsLocation + ' exists on disk')	
    	} 
    	else {
    		console.error(logsLocation + ' DOES NOT exists on disk')	
    		return
    	}
    })

    plugin.get().getTextFile(logsLocation, false, function(status, data) {
    	if (!status) {
        	console.error('Could not retrieve ' + logsLocation + '')	
    		return
      	} 
      	else {
        	var fullLog = data
        	console.log('retrieved data')
      	}
  	});

	plugin.get().listenOnFile("hs-logs-file", filename, false, function(id, status, data) { 
		if (fileId == fileIdentifier) {
    		if (status) {
      			console.log("[" + fileId + "] " + data);
    		} 
    		else {
      			console.log('something bad happened: ' + data);
    		}
  		}
	});
}


// Start here
var plugin = new OverwolfPlugin("simple-io-plugin", true);
console.log('initializing plugin')
plugin.initialize(function(status) {
	console.log('init done', status, plugin)
  	if (status == false) {
    	console.error("Plugin couldn't be loaded??")
    	return;
  	}
  	console.log("Plugin " + plugin.get()._PluginName_ + " was loaded!");

  	// Registering game listener
	overwolf.games.onGameInfoUpdated.addListener(function (res) {
		console.log("onGameInfoUpdated: " + JSON.stringify(res));
		if (gameLaunched(res)) {
			registerEvents()
			registerLogMonitor()
		}
	})
})
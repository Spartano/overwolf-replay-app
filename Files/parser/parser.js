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

	var input;
	var lastMod;

	function startWatching() {
		var file;

		if (typeof window.FileReader !== 'function') {
			console.error("The file API isn't supported on this browser yet.");
			return;
		}

		input = document.getElementById('filename');
		if (!input) {
			display("Um, couldn't find the filename element.");
		}
		else if (!input.files) {
			display("This browser doesn't seem to support the `files` property of file inputs.");
		}
		else if (!input.files[0]) {
			display("Please select a file before clicking 'Show Size'");
		}
		else {
			file = input.files[0];
			lastMod = file.lastModifiedDate;
			display("Last modified date: " + lastMod);
			display("Change the file");
			setInterval(tick, 250);
		}
	}

	function tick() {
		var file = input.files && input.files[0];
		if (file && lastMod && file.lastModifiedDate.getTime() !== lastMod.getTime()) {
			lastMod = file.lastModifiedDate;
			display("File changed: " + lastMod);
		}
	}
}


// Start here
overwolf.games.onGameInfoUpdated.addListener(function (res) {
	console.log("onGameInfoUpdated: " + JSON.stringify(res));
	if (gameLaunched(res)) {
		registerEvents();
		registerLogMonitor()
	}
});
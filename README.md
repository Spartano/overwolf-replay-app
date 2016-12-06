Display a replay viewer at the end of each HS game to analyze your mistakes

TODOs:

* Unhardcode the Power.log path
* Bug: Doesn't work when stop then start game once again (the `monitoring` variable I use to know my listeners have been registered is still set, but the listeners don't trigger on file change)
* Use offline parser instead of WS call (will be a bit of work, I need to port the full parser to JS - unless there is a way to wrap a Java parser?)
* Get a code review - Mainly interested in how to handle the listen of file if files doesn't exist yet
* Don't hardcode line separator?
* Work on the user flows
* Bug: Don't re-upload a game when exiting / launching HS back again 
* Support keyboard shortcuts
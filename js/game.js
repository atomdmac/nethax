function START_GAME () {
    GAME = {};
    
    // Settings.
    GAME.settings = {
        viewW: 20,
        viewH: 20,
        cellSize: 16
    };
    
    // A place to store statistics.
    GAME.stats = {
        enemyMoves: {
            left: 0,
            right: 0,
            up: 0,
            down: 0
        }
    };
    
    // Init Crafty engine.
    var initW = settings.viewW * settings.cellSize,
        initH = settings.viewH * settings.cellSize;
    
    Crafty.init(initW, initH);
    
    // -------------------------------------------------------------------------
    // Public Methods.
    // -------------------------------------------------------------------------
    
    /*
     * Advance the game by one time unit.  Runs whenever the user takes a turn.
     */
    GAME.tick = function () {
        // Update all actors.
        var actors = GAME.map.actors;
        for (var i=0; i<actors.length; i++) {
            actors[i].tick();
        }
    }
    
    /*
     * Add an entry to the log for the user to see.
     */
    GAME.log = function (msg) {
        // TODO: Implement a proper log in the DOM instead of console.log().
        console.log(msg);
    }
    
    /*
     * Convert pixel position to grid position.
     */
    GAME.toCell  = function (x, y) {
        return {
            "x": Math.floor(x / GAME.settings.cellSize),
            "y": Math.floor(y / GAME.settings.cellSize)
        }
    }
    
    /*
     * Convert grid position to pixel position.
     */
    GAME.toPos = function (x, y) {
        return {
            "x": Math.floor(x * GAME.settings.cellSize),
            "y": Math.floor(y * GAME.settings.cellSize)
        }
    }
    
    /*
     * Roll the given dice type (type) the given number of times (num)
     */
    GAME.roll = function (type, num) {
        var total = 0;
        for (var i=0; i<num; i++) {
            // NOTE: See Math.randomInt() in js/utils.js.
            total += Math.randomInt(type + 1);
        }
    }
    
    // Use jQuery's proxy but expose through the GAME object so we can implement
    // our own later if we want to.  Eventually, it would be nice not to -have-
    // to rely on jQuery...
    GAME.proxy = $.proxy;
    
    // Initialize map.
    GAME.map = Crafty.e("Map");
    GAME.map.parse(sampleMap, settings.cellSize);
    
    // Initialize player.
    GAME.player = Crafty.e("Player");
    GAME.player.bind("PlayerAction", function (action) {
        GAME.tick();
    });
    GAME.map.addActor(2, 2, GAME.player);
    
    // ----------- //
    // DEBUG       //
    // ----------- /
    var e1 = Crafty.e("Enemy");
    GAME.map.addActor(4, 3, e1);
    
    var e2 = Crafty.e("Enemy");
    GAME.map.addActor(10, 10, e2);
    
    var e3 = Crafty.e("Enemy");
    GAME.map.addActor(15, 2, e3);
    
    // Follow the player.
    Crafty.viewport.follow(GAME.player, 0, 0);
}
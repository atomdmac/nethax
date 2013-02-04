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
    var initW = GAME.settings.viewW * GAME.settings.cellSize,
        initH = GAME.settings.viewH * GAME.settings.cellSize;
    
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
        
        // DEBUG //
        // Test DDA functions.
        /*
        var c1 = GAME.map.toPos(1, 1);
        var c2 = GAME.map.toPos(4, 10);
        var ddaPath = GAME.map.dda(c1.x, c1.y, c2.x, c2.y);
        for(var dda=1; dda<ddaPath.length; dda++) {
            ddaPath[dda].color("#ccc");
        }
        */
    }
    
    /*
     * Add an entry to the log for the user to see.
     */
    // TODO: Implement a proper log in the DOM instead of console.log().
    GAME.log = function (msg) {
        var output = "";
        for (var i in arguments) {
            output += arguments[i];
        }
        console.log(output);
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
            total += Math.randomInt(1, type);
        }
        return total;
    }
    
    // Use jQuery's proxy but expose through the GAME object so we can implement
    // our own later if we want to.  Eventually, it would be nice not to -have-
    // to rely on jQuery...
    GAME.proxy = $.proxy;
    
    // Initialize map.
    GAME.map = Crafty.e("DDAMap");
    GAME.map.parse(sampleMap, GAME.settings.cellSize);
    
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
    GAME.map.addActor(10, 6, e1);
    /*
    var e2 = Crafty.e("Enemy");
    GAME.map.addActor(10, 10, e2);
    
    var e3 = Crafty.e("Enemy");
    GAME.map.addActor(15, 2, e3);
    */
    // Follow the player.
    Crafty.viewport.follow(GAME.player, 0, 0);
}
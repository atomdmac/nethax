function START_GAME () {
    GAME = {};
    
    // Settings.
    var settings = {
        viewW: 10,
        viewH: 10,
        cellSize: 16
    };
    
    // Expose settings object through GAME object.
    GAME.settings = settings;
    
    // Init Crafty engine.
    var initW = settings.viewW * settings.cellSize,
        initH = settings.viewH * settings.cellSize;
    
    Crafty.init(initW, initH);
    
    // Public Methods.
    GAME.tick = function () {
        // Update all actors.
        var actors = GAME.map.actors;
        for (var i=0; i<actors.length; i++) {
            actors[i].tick();
        }
    }
    
    GAME.toCell  = function (x, y) {
        return {
            "x": Math.floor(x / GAME.settings.cellSize),
            "y": Math.floor(y / GAME.settings.cellSize)
        }
    }
    
    GAME.toPos = function (x, y) {
        return {
            "x": Math.floor(x * GAME.settings.cellSize),
            "y": Math.floor(y * GAME.settings.cellSize)
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
    GAME.player.initPlayer(2, 2, settings.cellSize);
    
    GAME.map.addActor(2, 2, GAME.player);
    
    // ----------- //
    // DEBUG       //
    // ----------- /
    var e1 = Crafty.e("Enemy");
        e1.initEnemy(4, 4);
    GAME.map.addActor(4, 4, e1);
    
    var e2 = Crafty.e("Enemy");
        e2.initEnemy(4, 6);
    GAME.map.addActor(4, 6, e2);
    
    var e3 = Crafty.e("Enemy");
        e3.initEnemy(4, 2);
    GAME.map.addActor(4, 2, e3);
    
    // Follow the player.
    Crafty.viewport.follow(this.player, 0, 0);
}
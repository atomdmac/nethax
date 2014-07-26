function START_GAME () {
    // Create Global GAME object.
    GAME = {};
    
    // Settings.
    GAME.settings = {
        viewW: 20,
        viewH: 20,
        cellSize: 16,
        turnDuration: 200
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
        for (var i=0, len = actors.length; i<actors.length; i++) {
            actors[i].tick();
        }
        
        var notify = GAME.tickNotify, cur;
        for (var i = 0, len = notify.length; i<len; i++) {
            cur = notify[i];
            cur.func.apply(cur.scope, cur.args);
        }
        
        // DEBUG //
        GAME.player.applyEffects();
    };
    
    GAME.tickNotify = [];
    GAME.notify = function(func, scope, args) {
        GAME.tickNotify.push({
            "func": func,
            "scope": scope || GAME,
            "args": args || null
        });
    }
    
    /*
     * Add an entry to the log for the user to see.
     */
    GAME.log = Log($("body")).log;
    
    /*
     * Convert pixel position to grid position.
     */
    // TODO: Remove GAME.toCell().  It has been moved to Map component.
    GAME.toCell  = function (x, y) {
        return {
            "x": Math.floor(x / GAME.settings.cellSize),
            "y": Math.floor(y / GAME.settings.cellSize)
        };
    };
    
    /*
     * Convert grid position to pixel position.
     */
    // TODO: Remove GAME.toPos().  It has been moved to Map component.
    GAME.toPos = function (x, y) {
        return {
            "x": Math.floor(x * GAME.settings.cellSize),
            "y": Math.floor(y * GAME.settings.cellSize)
        };
    };
    
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
    };
    
    // Use jQuery's proxy but expose through the GAME object so we can implement
    // our own later if we want to.  Eventually, it would be nice not to -have-
    // to rely on jQuery...
    GAME.proxy = $.proxy;
    
    // Initialize map.
    GAME.map = Crafty.e("DDAMap");
    
    $.ajax({
        url: "data/test-map50x50.json",
        success: function (data) {
            
            // Initialize map.
            GAME.map.parse(JSON.parse(data), GAME.settings.cellSize);
            
            // Initialize player.
            GAME.player = Player();
            GAME.map.addActor(2, 2, GAME.player);
            
            // Initialize Keyboard Input
            GAME.keyboard = Crafty.e("KeyboardInput");
            GAME.keyboard.bind("PlayerAction", function (action) {
                GAME.tick();
            });
            
            
            // ----------- //
            // DEBUG       //
            // ----------- /
                // Entity factories don't work currently in Crafty.
            var maxNumEnemies = 2, numEnemies = 0;
            var safe = 0, safeMax = 20;
            while (numEnemies < maxNumEnemies) {
                if (safe > safeMax) break;
                safe++;
                
                var xCell = Math.randomInt(0, GAME.map.colCount),
                    yCell = Math.randomInt(0, GAME.map.rowCount);
                if (GAME.map.isPassable(xCell, yCell)) {
                    var enemy = new Enemy();
                    GAME.map.addActor(xCell, yCell, enemy);
                    numEnemies++;
                }
            }
            
            var health = Crafty.e("ProgressBar")
                .attr({
                    x: 0,
                    y: 0,
                    w: 100,
                    h: 20
                })
                .setTitle("Health");
                
            GAME.player.bind("Hurt", function (e) {
                health.setScale(0, e.maxHp);
                health.update(e.hp);
            });
            GAME.player.bind("Heal", function (e) {
                health.setScale(0, e.maxHp);
                health.update(e.hp);
            });
            
            // Display path.
            // GAME.pathDisplay = new PathDisplay(GAME);
            
            // Test out State component
            
            // Effect callbacks (will be scoped to entity)
            function fakeEffect (effectName) {
                // console.log(effectName + " is affecting you!");
                GAME.log(effectName + "is affecting you!");
            }
            function fakeHeal() {
                if(this._hp < this._maxHp) this._hp++;
            }
            
            // Add some trivial test effects.
            GAME.player.addEffect("testEffect1", fakeEffect, 10, 1, ["Test Effect 1"]);
            GAME.player.addEffect("testEffect2", fakeEffect, 0, 100, ["Test Effect 2"]);
            // Add rudimentary healing effect.
            // GAME.player.addEffect("fakeHeal", fakeHeal, 0, 10);
            GAME.player.heal(0.25, 0, "Iron Heart");
            
            // Follow the player.
            Crafty.viewport.follow(GAME.player, 0, 0);
        }
    });
}
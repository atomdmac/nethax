// -----------------------------------------------------------------------------
// KEYBOARD INPUT
// -----------------------------------------------------------------------------
// Accept user input and do stuff as appropriate.
// -----------------------------------------------------------------------------
// TODO: Re-write keyboard input.  This is so gross.
Crafty.c("KeyboardInput", {
    
    _inProgress: false,
    
    _map: null,
    _player: null,
    
    _timerEnt: null,
    
    /**
     * Listen for when the turn animation finishes and allow the player to take
     * another turn.
     */
    _onTurnEnd: function () {
        this._inProgress = false;
    },
    
    _autoAttack: function (direction) {
        var cell = this._map.getAdjacent(this._player.cell, direction),
            enemy = cell.actor;
        // TODO: Check for alignment here before attacking.
        // If there's an enemy there, attempt to hit 'em.
        if (enemy !== undefined && enemy !== null) {
            this._player.attack(enemy);
            return true;
        } else {
            return false;
        }
    },
    
    _doTick: function (silent) {
        this._inProgress = true;
        this._timerEnt.tween({x:0}, GAME.settings.turnDuration);
        
        // If silent==true, don't tell game to tick.
        if (!silent) {
            this.trigger("PlayerAction");
        }
    },
    
    init: function () {
        // Dependencies.
        this.requires("Keyboard");
        
        // Set up commonly used references.
        this._map    = GAME.map;
        this._player = GAME.player;
        
        // This is pretty gross... we use a dummy entity's Tween event as a
        // timer.  Yeah, I know... I should probably fix this someday...
        this._timerEnt = Crafty.e("Tween");
        
        // Listen for the turn to end so we can allow the player to take another
        // turn.
        this._timerEnt.bind("TweenEnd", GAME.proxy(this._onTurnEnd, this));
        
        // Listen for input on every frame.
        this.bind("EnterFrame", function () {
            
            // Don't initiate movement if we're already moving.
            if (this._inProgress) {
                return;
            }
            
            var action = false,
                keys = Crafty.keys;
            
            // Movement Keys
            if (this.isDown(keys["UP_ARROW"])) {
                action = this._player.motion("N");
            }
            
            else if (this.isDown(keys["DOWN_ARROW"])) {
                action = this._player.motion("S");
            }
            
            else if (this.isDown(keys["LEFT_ARROW"])) {
                action = this._player.motion("W");
            }
            
            else if(this.isDown(Crafty.keys["RIGHT_ARROW"])) {
                action = this._player.motion("E");
            }
            
            // Tick and return if player took valid action.
            if(action) {
                this._doTick();
                return;
            }
            // End Movement Keys
            
            // Auto-Attack Keys
            if(this.isDown(keys["UP_ARROW"])) {
                action = this._autoAttack("N");
            }
            else if(this.isDown(keys["DOWN_ARROW"])) {
                action = this._autoAttack("S");
            }
            else if(this.isDown(keys["LEFT_ARROW"])) {
                action = this._autoAttack("W");
            }
            else if(this.isDown(keys["RIGHT_ARROW"])) {
                action = this._autoAttack("E");
            }
            // End Auto-Attack Keys
            
            // Tick and return if player took a valid action.
            if(action) {
                this._doTick();
                return;
            }
            // End Attack Keys
            
            // Rest Key
            if (this.isDown(keys["PERIOD"])) {
                // TODO: Heal player
                this._doTick();
                return;
            }
            
            // Inventory Key
            if (this.isDown(keys["I"])) {
                // TODO: Bring up inventory screen.
                this._doTick(true);
                GAME.log("Inventory not implemented yet!");
                return;
            }
            
        });
    }
});
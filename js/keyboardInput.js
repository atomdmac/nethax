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
        this._checkKeys();
    },
    
    /*
     * Auto-attack an enemy.
     */
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
    
    /*
     * Move the game state forward (unless silent==true, in which case, just
     * don't allow input until the turn delay is over.
     */ 
    _doTick: function (silent) {
        this._inProgress = true;
        this._timerEnt.tween({x:0}, GAME.settings.turnDuration);
        
        // If silent==true, don't tell game to tick.
        if (!silent) {
            this.trigger("PlayerAction");
        }
    },
    
    _doMovementKeys: function () {
        
    },
    
    /*
     * Check to see which keys are down and do something based on that.
     */
    _checkKeys: function (e) {
        // Don't initiate movement if we're already moving.
        if (this._inProgress) {
            return;
        }
        
        var action = false,
            keys = Crafty.keys;
        
        if(e) {        
            // Auto-Attack Keys
            if(e.key == keys["UP_ARROW"] || e.key == keys["K"]) {
                action = this._autoAttack("N");
            }
            else if(e.key == keys["DOWN_ARROW"] || e.key == keys["J"]) {
                action = this._autoAttack("S");
            }
            else if(e.key == keys["LEFT_ARROW"] || e.key == keys["H"]) {
                action = this._autoAttack("W");
            }
            else if(e.key == keys["RIGHT_ARROW"] || e.key == keys["L"]) {
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
            if (e.key == keys["PERIOD"]) {
                // TODO: Heal player
                this._doTick();
                return;
            }
            
            // Inventory Key
            if (e.key == keys["I"]) {
                // TODO: Bring up inventory screen.
                this._doTick(true);
                GAME.log("Inventory not implemented yet!");
                return;
            }
        }
        
        // Movement Keys
        // NOTE: Since these keys don't require that the event be passed to this
        //       function, when this function is called from this._onTurnEnd,
        //       we can continue motion if the player is holding any one of
        //       these keys down.  All of the key combos above will only be
        //       fired onKeyDown and will not be fired repeatedly.
        if (this.isDown(keys["UP_ARROW"]) || this.isDown(keys["K"])) {
            action = this._player.motion("N");
        }
        
        else if (this.isDown(keys["Y"])) {
            action = this._player.motion("NW");
        }
        
        else if (this.isDown(keys["U"])) {
            action = this._player.motion("NE");
        }
        
        else if (this.isDown(keys["DOWN_ARROW"]) || this.isDown(keys["J"])) {
            action = this._player.motion("S");
        }
        
        else if (this.isDown(keys["B"])) {
            action = this._player.motion("SW");
        }
        
        else if (this.isDown(keys["N"])) {
            action = this._player.motion("SE");
        }
        
        else if (this.isDown(keys["LEFT_ARROW"]) || this.isDown(keys["H"])) {
            action = this._player.motion("W");
        }
        
        else if(this.isDown(keys["RIGHT_ARROW"]) || this.isDown(keys["L"])) {
            action = this._player.motion("E");
        }
        
        // Tick and return if player took valid action.
        if(action) {
            this._doTick();
            return;
        }
        // End Movement Keys
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
        
        this.bind("KeyDown", this._checkKeys);
    }
});
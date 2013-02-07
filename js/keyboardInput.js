// -----------------------------------------------------------------------------
// KEYBOARD INPUT
// -----------------------------------------------------------------------------
// Accept user input and do stuff as appropriate.
// -----------------------------------------------------------------------------
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
            
            var action = null;
            
            // Movement
            if(this.isDown(Crafty.keys["UP_ARROW"])) {
                action = this._map.moveEntity(this._player, "N") ? "move" : null;
            }
            
            else if(this.isDown(Crafty.keys["DOWN_ARROW"])) {
                action = this._map.moveEntity(this._player, "S") ? "move" : null;
            }
            
            else if(this.isDown(Crafty.keys["LEFT_ARROW"])) {
                action = this._map.moveEntity(this._player, "W") ? "move" : null;
            }
            
            else if(this.isDown(Crafty.keys["RIGHT_ARROW"])) {
                action = this._map.moveEntity(this._player, "E") ? "move" : null;
            }
            
            // Attack.
            // TODO: Clean up key input code.  This is gross.
            var enemy = null;
            if (action == null) {
                // Is there an enemy there?
                if(this.isDown(Crafty.keys["UP_ARROW"])) {
                    enemy = this._map.getAdjacent(this._player.cell, "N");
                }
                else if(this.isDown(Crafty.keys["DOWN_ARROW"])) {
                    enemy = this._map.getAdjacent(this._player.cell, "S");
                }
                else if(this.isDown(Crafty.keys["LEFT_ARROW"])) {
                    enemy = this._map.getAdjacent(this._player.cell, "W");
                }
                else if(this.isDown(Crafty.keys["RIGHT_ARROW"])) {
                    enemy = this._map.getAdjacent(this._player.cell, "E");
                }
                
                // If there's an enemy there, attempt to hit 'em.
                if (enemy !== undefined && enemy !== null && enemy.actor != null) {
                    this._player.attack(enemy.actor);
                    action = "attack";
                }
            }
            
            // Tick if player took a valid action.
            if(action != null) {
                this._inProgress = true;
                this._timerEnt.tween({x:0}, GAME.settings.turnDuration);
                this.trigger("PlayerAction", action);
            }
        });
    }
});
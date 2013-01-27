Crafty.c("Slide", {
    moveSpeed: 10,
    cellSize: null,
    isMoving: false,
    
    checkMovement: function (direction) {
        var targetPos = this.getTargetCell(direction);
            newX = targetPos.x,
            newY = targetPos.y;
        
        var targetCell = GAME.map.cells[newX][newY];
        if(targetCell.passable && targetCell.actor == null) {
            return true;
        } else {
            return false;
        }
    },
    
    getTargetCell: function (direction) {
        var curCell = GAME.toCell(this.x, this.y),
            curX = curCell.x,
            curY = curCell.y,
            newX = curX,
            newY = curY;
            
        switch (direction) {
            case "UP":
                newY--;
                break;
            case "DOWN":
                newY++;
                break;
            case "LEFT":
                newX--;
                break;
            case "RIGHT":
                newX++;
                break;
            default:
                // NONE;
        }
        return {
            "x": newX,
            "y": newY
        }
    },
    
    slide: function (direction) {
        
        // Which cell is in the proposed direction?
        var newCell = this.getTargetCell(direction),
            oldCell = GAME.toCell(this.x, this.y);
        
        // Make sure movement is valid. If not, return false.
        if(!this.checkMovement(direction)) {
            return false;
        }
        
        // We're moving now.
        this.isMoving = true;
        
        switch (direction) {
            case "UP":
                this.tween({
                    "y": this.y - GAME.settings.cellSize
                }, this.moveSpeed);
                break;
            
            case "DOWN":
                this.tween({
                    "y": this.y + GAME.settings.cellSize
                }, this.moveSpeed);
                break;
            
            case "LEFT":
                this.tween({ 
                    "x": this.x - GAME.settings.cellSize
                }, this.moveSpeed);
                break;
            
            case "RIGHT":
                this.tween({
                    "x": this.x + GAME.settings.cellSize
                }, this.moveSpeed);
                break;
            
            default:    
                // NONE.
        }
        
        this.trigger("SlideMove", {
            "direction": direction,
            "newCell"  : newCell,
            "oldCell"  : oldCell
        });
        
        // Slide was successful.
        return true;
    },
    
    init: function () {
        this.requires("2D, Tween");
    }
});

// -----------------------------------------------------------------------------
// Key Movement Entity
// -----------------------------------------------------------------------------
Crafty.c("KeyMovement", {
    
    /**
     * Listen for when the turn animation finishes and allow the player to take
     * another turn.
     */
    _onTurnEnd: function () {
        this.isMoving = false;
    },
    
    init: function () {
        // Dependencies.
        this.requires("Keyboard, Slide");
        
        // Listen for the turn to end so we can allow the player to take another
        // turn.
        this.bind("TweenEnd", GAME.proxy(this._onTurnEnd, this));
        
        // Listen for input on every frame.
        this.bind("EnterFrame", function () {
            // Don't initiate movement if we're already moving.
            if (this.isMoving) {
                return;
            }
            
            var action = null;
            
            // Movement
            if(this.isDown(Crafty.keys["UP_ARROW"])) {
                action = this.slide("UP") ? "move" : null;
            }
            
            else if(this.isDown(Crafty.keys["DOWN_ARROW"])) {
                action = this.slide("DOWN") ? "move" : null;
            }
            
            else if(this.isDown(Crafty.keys["LEFT_ARROW"])) {
                action = this.slide("LEFT") ? "move" : null;
            }
            
            else if(this.isDown(Crafty.keys["RIGHT_ARROW"])) {
                action = this.slide("RIGHT") ? "move" : null;
            }
            
            // Attack.
            // TODO: Clean up key input code.  This is gross.
            var enemy = null;
            if (action == null) {
                // Is there an enemy there?
                if(this.isDown(Crafty.keys["UP_ARROW"])) {
                    enemy = this.checkSurrounding("UP").actor;
                }
                else if(this.isDown(Crafty.keys["DOWN_ARROW"])) {
                    enemy = this.checkSurrounding("DOWN").actor;
                }
                else if(this.isDown(Crafty.keys["LEFT_ARROW"])) {
                    enemy = this.checkSurrounding("LEFT").actor;
                }
                else if(this.isDown(Crafty.keys["RIGHT_ARROW"])) {
                    enemy = this.checkSurrounding("RIGHT").actor;
                }
                
                // If there's an enemy there, attempt to hit 'em.
                if (enemy != null) {
                    this.attack(enemy);
                    
                    // TODO: Replace isMoving with a more generic "turnTimeout" term and decouple from Slide component.
                    this.isMoving = true;
                    this.tween({x:this._x}, 10);
                }
            }
            
            // Tick if player took a valid action.
            if(action != null) {
                this.trigger("PlayerAction", action);
            }
        });
    }
});

// -----------------------------------------------------------------------------
// Map Entity (Players, Items, etc.)
// -----------------------------------------------------------------------------
Crafty.c("MapEntity", {
    // Entity's name.
    _name: "Entity Name",
    name: function (name) {
        if (typeof name === "string") {
            this._name = name;
        }
        return this._name;
    },
    
    checkSurrounding: function (direction) {
        var dirs = {
            "UP"    : [0, -1],
            "RIGHT" : [1,  0],
            "DOWN"  : [0,  1],
            "LEFT"  : [-1, 0]
        };
        if (dirs[direction] !== undefined) {
            // Determine the location of the target cell.
            var pos = GAME.toCell(this._x, this._y);
            pos.x += dirs[direction][0];
            pos.y += dirs[direction][1];
            
            // Get a reference to the target cell (if it exists).
            var targetCell = GAME.map.getCell(pos.x, pos.y);
            
            return targetCell;
        } else {
            return null;
        }
    },
    
    mapEntity: function (x, y) {
        var pos = GAME.toPos(x, y);
        this.attr({
            "x": pos.x,
            "y": pos.y,
            "w": GAME.settings.cellSize,
            "h": GAME.settings.cellSize
        });
    },
    
    init: function () {
        this.requires("2D");
    }
});

// -----------------------------------------------------------------------------
// A Character that can advance in skill.
// -----------------------------------------------------------------------------
Crafty.c("Character", {
    
    // Is this character a non-player character?
    _isNPC: false,
    
    // Character stats/attributes.
    stats: {
        "dex": 0,
        "str": 0,
        "wis": 0,
        "int": 0
    },
    
    exp: function (toAdd) {
        // TODO
    },
    
    init: function () {
        // Dependencies.
        this.requires("MapEntity");
    }
});

// -----------------------------------------------------------------------------
// An entity that can attack and do damage to an Attackable entity.
// -----------------------------------------------------------------------------
Crafty.c("Attacker", {
    attack: function (target) {
        if (target.has("Attackable")) {
            // TODO: Factor in character attributes to determine die type/number.
            var check = GAME.roll(6, 2);
            
            // Is the attack successful?
            if (target.hit(check)) {
                // TODO: Factor in character attributes to determine die type/number.
                var dmg = GAME.roll(6, 2);
                target.damage(dmg);
            }
            
            // Attack misses.
            else {
                GAME.log("You miss!");
            }
        }
        
        else {
            GAME.log("You can't attack that.");
        }
    },
    
    init: function () {
        this.requires("MapEntity");
    }
});

// -----------------------------------------------------------------------------
// An entity that can be attacked and killed/broken.
// -----------------------------------------------------------------------------
Crafty.c("Attackable", {
    hit: function (check) {
        if (check > this._armor) {
            return true;
        } else {
            return false;
        }
    },
    
    /*
     * Do damage to this entity.  Entity will die/break if HP falls below 0.
     */
    damage: function (amount) {
        // TODO: Add damage reduction someday...
        GAME.log(this.name(), " takes ", amount, " damage.");
        
        this._hp -= amount;
        if(this._hp < 0) {
            this.die();
        }
    },
    
    /*
     * Kills/breaks the entity.
     */
    die: function () {
        this.trigger("Die", this);
        this.destroy();
        GAME.log(this.name(), " dies.");
    },
    
    /*
     * Get/Set the Armor Class for this entity.
     */
    _armor: 5,
    armor: function (num) {
        if(num!==undefined) {
            this._armor = num;
        }
        return this._armor;
    },
    
    /*
     * Get/Set max Hit Points for this entity.
     */
    _hp: 10,
    hp: function (num) {
        if(num!==undefined) {
            this._hp = num;
        }
        return this._hp;
    },
    
    init: function () {
        // TODO
    }
});

// -----------------------------------------------------------------------------
// Player Entity
// -----------------------------------------------------------------------------
Crafty.c("Player", {
    
    tick: function () {
        // EMPTY
    },
    
    init: function () {
        this.requires("2D, DOM, Color, MapEntity, Character, KeyMovement, Attackable, Attacker");
        this.name("You");
        // TODO: Use sprite instead of a boring solid color.
        this.color("#00ff00");
    }
});

// -----------------------------------------------------------------------------
// Enemy Entity
// -----------------------------------------------------------------------------
Crafty.c("Enemy", {
    randomMove: function () {
        
        // TODO: Find a better way to generate random directions.  This way favors the middle two items. :(
        var directions = ["DOWN", "UP", "RIGHT", "LEFT"],
            randDir    = directions.random();
        
        if (this.checkMovement(randDir)) {
            // Move!
            this.slide(randDir);
            
            // Update stats.
            GAME.stats.enemyMoves[randDir.toLowerCase()]++;
        }
    },
    
    tick: function () {
        // TODO: Do other stuff besides just move randomly.
        this.randomMove();
    },
    
    init: function () {
        this.requires("2D, DOM, Color, Character, Slide, Attackable, Attacker");
        this.name("Enemy");
        this.color("#ff0000");
    }
})
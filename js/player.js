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
        
        // Make sure movement is valid.
        if(!this.checkMovement(direction)) return;
        
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
            
            if(this.isDown(Crafty.keys["UP_ARROW"])) {
                this.slide("UP");
            }
            
            else if(this.isDown(Crafty.keys["DOWN_ARROW"])) {
                this.slide("DOWN");
            }
            
            else if(this.isDown(Crafty.keys["LEFT_ARROW"])) {
                this.slide("LEFT");
            }
            
            else if(this.isDown(Crafty.keys["RIGHT_ARROW"])) {
                this.slide("RIGHT");
            }
        });
    }
});

// -----------------------------------------------------------------------------
// Map Entity (Players, Items, etc.)
// -----------------------------------------------------------------------------
Crafty.c("MapEntity", {
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
        this.requires("2D, DOM, Color, MapEntity, KeyMovement");
        // TODO: Use sprite instead of a boring solid color.
        this.color("#00ff00");
    }
});

// -----------------------------------------------------------------------------
// Enemy Entity
// -----------------------------------------------------------------------------
Crafty.c("Enemy", {
    randomMove: function () {
        
        var directions = ["UP", "DOWN", "RIGHT", "LEFT"],
            randDir    = directions.random();
        
        console.log("Random Direction: ", randDir);
        
        if (this.checkMovement(randDir)) {
            this.slide(randDir);
        }
    },
    
    tick: function () {
        console.log("tick!");
        // TODO: Do other stuff besides just move randomly.
        this.randomMove();
    },
    
    init: function () {
        this.requires("2D, DOM, Color, MapEntity, Slide");
        this.color("#ff0000");
    }
})
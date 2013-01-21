Crafty.c("Slide", {
    moveSpeed: 10,
    cellSize: null,
    isMoving: false,
    
    checkMovement: function (direction) {
        var curX = this.x / GAME.settings.cellSize,
            curY = this.y / GAME.settings.cellSize,
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
        
        var targetCell = GAME.map.cells[newX][newY];
        if(targetCell.passable && targetCell.actor == null) {
            return true;
        } else {
            return false;
        }
    },
    
    slide: function (direction) {
        
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
    },
    
    init: function () {
        this.requires("2D, Tween");
        
        var self = this;
        this.bind("TweenEnd", function () {
            self.isMoving = false;
        });
    }
});

Crafty.c("KeyMovement", {
    init: function () {
        this.requires("Keyboard, Slide");
        
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

Crafty.c("Player", {
    initPlayer: function (x, y, cellSize) {
        this.attr({
            "x": x * cellSize,
            "y": y * cellSize,
            "w": cellSize,
            "h": cellSize
        });
        
        // TODO: Use sprite instead of a boring solid color.
        this.color("#ff0000");
    },
    
    init: function () {
        this.requires("2D, DOM, Color, KeyMovement");
    }
});

Crafty.c("Enemy", {
    // TODO
})
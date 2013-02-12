Crafty.c("AgroPlayer", {
    // Who is being persued?
    _target: null,
    
    // How long is this entity willing to pay attention to their pursuant?
    _waitTolerance: 10,
    // How long has this entity been paying attention to their persuant?
    _waitCount: 0,
    
    // Current state 
    _agroState: null, // TRUE if we notice the hero, FALSE if we don't.
    
    // Where did we last see the target?
    _targetPath: null,
    
    updateAgroPlayer: function () {
        // TODO: updatePersue
        
        // Do we notice the player?  Have we noticed the player already?
        if (this._agroNoticeCheck()) {
            var cell1 = this.cell,
                cell2 = this._target.cell,
                cellSize = GAME.map.cellSize,
                max   = 20;
        // If yes, update our path to the player.
            // Use inner of closest corners.
            var xMod, yMod;
            if (this.cellX == this._target.cellX) {
                xMod = cellSize / 2;
            }
            else if(this.cellX - this._target.cellX > 0) {
                xMod = 1;
            }
            else {
                xMod = (cellSize - 1);
            }
            
            if (this.cellY == this._target.cellY) {
                yMod = cellSize / 2;
            }
            else if(this.cellY - this._target.cellY > 0) {
                yMod = 1;
            }
            else {
                yMod = (cellSize - 1);
            }
            
            // Use center of each cell as end points.
            /*
            var cx1 = cell1.x + (cellSize / 2),
                cy1 = cell1.y + (cellSize / 2),
                cx2 = cell2.x + (cellSize / 2),
                cy2 = cell2.y + (cellSize / 2),
                */
        var cx1 = cell1.x + xMod,
                cy1 = cell1.y + yMod,
                cx2 = cell2.x + xMod,
                cy2 = cell2.y + yMod,
                newPath = GAME.map.dda(cx1, cy1, cx2, cy2, max);
                
            
            // Update our path if we can see the target.
            if(newPath[0] == true) {
                this._targetPath = newPath;
                this._targetPath.shift();
            }
            
            // If this is the last place we saw the target, give up.
            if(this._targetPath.length == 0) {
                return;
            }
            
            // If the path is not blocked, move toward the target.
            if(this.motion( this._agroMoveTo( this._targetPath[0] ))){
                this._targetPath.shift()
            }
            
            // If the path is blocked, increase the wait counter.
            else {
                this._waitCount++;
            }
            
        }
        
        // If the wait counter is over our wait tolerance:
        if (this._waitCount >= this._waitTolerance) {
            this._waitCount = 0;
            this._targetPath = [];
        }
    },
    
    _agroMoveTo: function (cell) {
        var direction = "";
        if(cell.x > this.x) return "E";
        if(cell.x < this.x) return "W";
        if(cell.y > this.y) return "S";
        if(cell.y < this.y) return "N";
        return undefined;
    },
    
    // Have we noticed the target?
    _agroNoticeCheck: function () {
        if (this._targetPath.length > 0) {
            return true;
        }
        if(GAME.map.lineOfSight(this.cell, this._target.cell, 20)) {
            return true;
        } else {
            return false;
        }
    },
    
    init: function () {
        this.requires("MapEntity");
        this._targetPath = [];
        
        // Set the target from here for flexibility.
        this._target = GAME.player;
    }
});
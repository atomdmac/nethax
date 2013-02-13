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
    
    // How far can this entity see?
    _sightRadius: 10,
    
    updateAgroPlayer: function () {
        
        // Do we notice the player?  Have we noticed the player already?
        var agroCheck = this._agroNoticeCheck()
        if (agroCheck) {
            
            // Sometimes my current cell gets included.
            // TODO: Figure out why current cell is included in target path.
            if (this._targetPath[0] == this.cell) {
                this._targetPath.shift();
            }
            
            // If this is the last place we saw the target, give up.
            // TODO: I don't know if we need this anymore since the same check is done by _agroNoticeCheck().
            if(this._targetPath.length == 0) {
                return;
            }
            
            // If the path is not blocked, move toward the target.
            var motionDirection = this._agroMoveTo(this._targetPath[0]);
            // console.log("Motion Direction: ", motionDirection);
            // console.log("path            : ", this._targetPath);
            if(this.motion(motionDirection)){
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
            // TODO: Waiting should affect behavior.  Ex. Wander if hero is not visible.
        }
    },
    
    _agroMoveTo: function (cell) {
        if(cell.x == this.cell.x && cell.y <  this.cell.y) return "N";
        if(cell.x <  this.cell.x && cell.y <  this.cell.y) return "NW";
        if(cell.x <  this.cell.x && cell.y == this.cell.y) return "W";
        if(cell.x <  this.cell.x && cell.y <  this.cell.y) return "SW";
        if(cell.x == this.cell.x && cell.y >  this.cell.y) return "S";
        if(cell.x >  this.cell.x && cell.y >  this.cell.y) return "SE";
        if(cell.x >  this.cell.x && cell.y == this.cell.y) return "E";
        console.log("Can't seem to find direction for ", cell.x, ", ", cell.y)
        console.log("...and                           ", this.cell.x, ", ", this.cell.y);
        return undefined;
    },
    
    // Have we noticed the target?
    _agroNoticeCheck: function () {
        
        var newPath = GAME.map.lineOfSight(this.cell,
                                           this._target.cell,
                                           this._sightRadius,
                                           true);
        if(newPath[0]) {
            this._targetPath = newPath;
            this._targetPath.shift();
            // TODO: Entity coloring should -definitely- go somewhere else...
            this.color("#ff0000");
            return newPath;
        }
        else if (this._targetPath.length > 0) {
            this.color("#0000ff");
            return this._targetPath;
        }
        else {
            this.color("#0000ff");
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
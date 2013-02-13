var sampleMap = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,0,0,0,0],
    [0,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,0,0,1,1,1,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

// -----------------------------------------------------------------------------
// Map Cell Component
// -----------------------------------------------------------------------------
Crafty.c("MapCell", {
    passable: false,
    actor : null,
    items : [],
    _cellX : null,
    _cellY : null,
    
    update: function (x, y) {
        // Update internal map location data (if given);
        if(x!==undefined) {
            this._cellX = x;
        }
        if(y!==undefined) {
            this._cellY = y;
        }
        
        // Update display.
        if (this.passable) {
            this.color("#fff");
        } else {
            this.color("#000");
        }
    },
    
    init: function () {
        // Dependencies.
        this.requires("2D, DOM, Color");
        
        this.__defineGetter__("cellX", function () {return this._cellX});
        this.__defineGetter__("cellY", function () {return this._cellY});
    }
});

// -----------------------------------------------------------------------------
// Map Component
// -----------------------------------------------------------------------------
Crafty.c("Map", {
    // Some constants.
    // TODO: Convert directions to NWSE instead.
    // TODO: Use direction constants as globals in all places that reference them.
    NE : [ 1, -1],
    N  : [ 0, -1],
    NW : [-1, -1],
    W  : [-1,  0],
    SW : [-1,  1],
    S  : [ 0,  1],
    SE : [ 1,  1],
    E  : [ 1,  0],
    
    cells: null,
    actors: null,
    
    _width: null,
    _height: null,
    _cellSize: null,
    
// -----------------------------------------------------------------------------
// Map I/O
// -----------------------------------------------------------------------------
    
    load: function (url) {
        // TODO
    },
    
    parse: function (mapData, cellSize) {
        this.cells = [];
        for (var x=0; x<mapData.length; x++) {
            this.cells.push(new Array());
            
            for (var y=0; y<mapData[x].length; y++) {
                
                var newCell = Crafty.e("MapCell");
                newCell.passable = mapData[y][x] == 0 ? false : true;
                newCell.actor = null;
                newCell.items = []; // TODO: Add items.
                newCell.attr({
                    "w": cellSize,
                    "h": cellSize,
                    "x": x * cellSize,
                    "y": y * cellSize
                });
                newCell.update(x, y);
                
                this.cells[x].push(newCell);
            }
        }
        this._cellSize = cellSize;
        this._width = this.cells.length;
        this._height = this.cells[0].length;
    },
    
// -----------------------------------------------------------------------------
// Rendering
// -----------------------------------------------------------------------------
    
    repaint: function (x, y) {
        this.cells[x][y].update();
    },
    
    refresh: function () {
        for(var x=0; x<this._width; x++) {
            for(var y=0; y<this._height; y++) {
                this.cells[x][y].update();
            }
        }
    },
    
// -----------------------------------------------------------------------------
// Entity Management
// -----------------------------------------------------------------------------
    addItem: function (x, y, item) {
        this.cells[x][y].items.push(item);
    },
    
    removeItem: function (item) {
        // TODO
    },
    
    addActor: function (x, y, actor) {
        // TODO: Make sure x/y are valid!
        
        this.cells[x][y].actor = actor;
        this.actors.push(actor);
        
        // Initialize the actor.
        actor.mapEntity(x, y, this.cells[x][y]);
        
        // Remove the actor when it dies.
        var self = this;
        actor.bind("Killed", GAME.proxy(this.removeActor, this));
    },
    
    removeActor: function (actor) {
        // TODO:  Currently handled in "Die" callback.
        var i = 0;
            len = this.actors.length,
            actors = this.actors;
        for (i; i<len; i++) {
            if(actors[i] === actor) {
                // Remove from actor list.
                actors.splice(i, 1);
                // Remove from cell container.
                this.cells[actor.cell.cellX][actor.cell.cellY]["actor"] = null;
            }
        }
    },
    
    moveEntity: function (entity, direction) {
        var dir     = this[direction],
            curCell = entity.cell,
            newCell = this.getAdjacent(curCell, direction);
        
        if(newCell !== undefined && newCell.passable && newCell.actor == null) {
            // Update Map.
            this.cells[curCell.cellX][curCell.cellY].actor = null;
            this.cells[newCell.cellX][newCell.cellY].actor = entity;
            
            // Update entity.
            entity.cell = newCell;
            
            return true;
        } else {
            return false;
        }
    },

// -----------------------------------------------------------------------------
// Map Query Tools
// -----------------------------------------------------------------------------
    
    getCell: function (x, y) {
        if (this.inBounds(x, y)) {
            return this.cells[x][y];
        }
        return undefined;
    },
    
    /**
     * Check to see if the given position is within the bounderies of the map.
     * If /convert/ is FALSE or unspecified, the given x/y parameters are
     * treated as CELL positions.  If /convert/ is TRUE, the given position is
     * specified in pixels and will be converted to cell positions before the
     * check is made.
     */
    inBounds: function (x, y, convert) {
        // Negative numbers are never allowed.
        if(x<0 || y<0) {
            return false;
        }
        var pos;
        if(convert) {
            pos = this.toCell(x, y);
        } else {
            pos = {
                "x": x,
                "y": y
            }
        }
        if(this._width < x || this._height < y) {
            return false;
        }
        // Passed all checks.  Looks good! <thumbsup/>
        return true;
    },
    
    /**
     * Return TRUE if cell contains any impassable terrain or hostile entities.
     */
    isCollidable: function (x, y) {
        if(this.inBounds(x, y)) {
            var c = this.cells[x][y];
            // TODO: Check to see if actor(s) are hostile or not.
            if(c.actor != null || c.passable === false) {
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    },
    
    /**
     * Return TRUE only if cell contains passable terrain.  Does not account for
     * hostile entities.
     */
    isPassable: function (x, y) {
        if(this.inBounds(x, y)) {
            var c = this.cells[x][y];
            if(c.passable === true) {
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    },
    
    /**
     * Returns TRUE if the cell does not contain any entities or terrain that
     * block visibility.
     */
    isTransparent: function (x, y) {
        // TODO: Add separate cell property to transparency instead of using passability to determine.
        if(this.inBounds(x, y)) {
            var c = this.cells[x][y];
            if(c.passable === true) {
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    },
    
    /**
     * Return TRUE only if cell contains at least 1 actor.
     */
    containsActor: function (x, y) {
        if(this.inBounds(x, y)) {
            var c = this.cells[x][y];
            if(c.actor != null) {
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    },
    
    /**
     * Return TRUE only if the cell contains at least 1 item.
     */
    containsItem: function (x, y) {
        // TODO
    },
    
    containsHero: function (x, y) {
        if(this.inBounds(x, y)) {
            console.log(x, ", ", y, " Checking for player here: ", this.cells[x,y].actor);
            
            if(this.cells[x,y].actor == GAME.player) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    },
    
    /**
     * Convert cell position to pixels. If /center/ is TRUE, return the position
     * of the center of the given cell.
     */
    toPos: function (x, y, center) {
        var pos = {
            "x": Math.floor(x * GAME.settings.cellSize),
            "y": Math.floor(y * GAME.settings.cellSize)
        }
        if (center) {
            pos.x += this._cellSize / 2;
            pos.y += this._cellSize / 2;
        }
        return pos;
    },
    
    /**
     * Convert pixel position to cell position.
     */
    toCell: function (x, y) {
        return {
            "x": Math.floor(x / GAME.settings.cellSize),
            "y": Math.floor(y / GAME.settings.cellSize)
        }
    },
    
    /**
     * Return the adjacent cell in the given direction (N/W/S/E).
     */
    getAdjacent: function (cell, direction) {
        var offset = this[direction];
        
        if (offset !== undefined) {
            // Determine the location of the target cell.
            var pos = {
                "x": cell.cellX + offset[0],
                "y": cell.cellY + offset[1]
            }
            
            // Get a reference to the target cell (if it exists).
            var targetCell = GAME.map.getCell(pos.x, pos.y);
            
            return targetCell;
        }
        else {
            return undefined;
        }
    },
    
    /**
     * Can the <i>target</i> move in the given direction?
     */
    canMove: function (entity, direction) {
        var dir     = this[direction],
            curCell = entity.cell,
            newCell = this.getAdjacent(curCell, direction);
        
        if(newCell !== undefined && newCell.passable && newCell.actor == null) {
            return true;
        } else {
            return false;
        }
    },
    
    /**
     * Return a list of interesting cells adjacent to the given target.
     * An interesting cell:
     * - Contains an item
     * - Contains a wall or impassable terrain.
     * - Contains an entity.
     */
    getInteresting: function (target) {
        // TODO
    },
    
    /**
     * Return the distance between 2 entities on the map.
     */
    getDistance: function (target1, target2) {
        // Targets must be map entities.
        if(target1.has("MapEntity") && target2.has("MapEntity")) {
            var cell1 = this.toCell(target1.x, target1.y),
                cell2 = this.toCell(target2.x, target2.y),
                xdiff = Math.abs(cell1.x - cell2.x),
                ydiff = Math.abs(cell1.y - cell2.y);
            // Go, Pythagorean Thereom!
            return Math.ceil(Math.sqrt((xdiff*xdiff) + (ydiff*ydiff)));
        }
        return null;
    },
    
    init: function () {
        this.actors = [];
        
        // Getters
        this.__defineGetter__("width", function() {return this._width});
        this.__defineGetter__("height", function() {return this._height});
        this.__defineGetter__("cellSize", function() {return this._cellSize});
    }
});
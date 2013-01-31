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
    actor: null,
    items: [],
    
    update: function () {
        if (this.passable) {
            this.color("#fff");
        } else {
            this.color("#000");
        }
    },
    
    init: function () {
        // Dependencies.
        this.requires("2D, DOM, Color");
    }
});

// -----------------------------------------------------------------------------
// Map Component
// -----------------------------------------------------------------------------
Crafty.c("Map", {
    // Some constants.
    // TODO: Convert directions to NWSE instead.
    UP    : [0, -1],
    RIGHT : [1,  0],
    DOWN  : [0,  1],
    LEFT  : [-1, 0],
    
    cells: null,
    actors: null,
    
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
                newCell.update();
                
                this.cells[x].push(newCell);
            }
        }
    },
    
// -----------------------------------------------------------------------------
// Rendering
// -----------------------------------------------------------------------------
    
    repaint: function (x, y) {
        this.cells[x][y].update();
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
        this.cells[x][y].actor = actor;
        this.actors.push(actor);
        
        // Initialize the actor.
        actor.mapEntity(x, y);
        
        // Remove the actor when it dies.
        actor.bind("Die", function (actor) {
            var cellPos = GAME.toCell(actor.x, actor.y);
            self.cells[cellPos.x][cellPos.y].actor = null;
        });
        
        // Listen for move events so we can update the map.
        var self = this;
        actor.bind("SlideMove", function (e) {
            self.cells[e.oldCell.x][e.oldCell.y].actor = null;
            self.cells[e.newCell.x][e.newCell.y].actor = this;
        });
    },
    
    removeActor: function (actor) {
        // TODO:  Currently handled in "Die" callback.
    },

// -----------------------------------------------------------------------------
// Map Query Tools
// -----------------------------------------------------------------------------
    
    getCell: function (x, y) {
        return this.cells[x][y];
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
        if(this.cells.length > x || this.cells[0].length > y) {
            return false;
        }
        // Passed all checks.  Looks good! <thumbsup/>
        return true;
    },
    
    /**
     * Return TRUE if cell contains impassable terrain or entities.
     */
    isCollidable: function (x, y) {
        if(this.inBounds(x, y)) {
            var c = this.cells[x][y];
            if(c.actors.length > 0 || c.passable == false) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    },
    
    /**
     * Convert cell position to pixels.
     */
    toPos: function (x, y) {
        return {
            "x": Math.floor(x * GAME.settings.cellSize),
            "y": Math.floor(y * GAME.settings.cellSize)
        }
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
    getAdjacent: function (target, direction) {
        if (this[direction] !== undefined) {
            // Determine the location of the target cell.
            var pos = GAME.toCell(this._x, this._y);
            pos.x += this[direction][0];
            pos.y += this[direction][1];
            
            // Get a reference to the target cell (if it exists).
            var targetCell = GAME.map.getCell(pos.x, pos.y);
            
            return targetCell;
        } else {
            return null;
        }
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
    }
});
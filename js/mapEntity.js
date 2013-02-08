// -----------------------------------------------------------------------------
// Map Entity (Players, Items, etc.)
// -----------------------------------------------------------------------------
Crafty.c("MapEntity", {
    // A reference to the MapCell containing this entity.
    _cell: null,
    
    // Entity's name.
    _name: "Entity Name",
    
    // TODO: Implement a Move() method that queries the map to see if successful and if so, update and emit an event.
    
    /*
     * Initialization method for MapEntity.
     */
    mapEntity: function (x, y, cell) {
        this._cell = cell;
        var pos = GAME.toPos(x, y);
        this.attr({
            "x": pos.x,
            "y": pos.y,
            "w": GAME.settings.cellSize,
            "h": GAME.settings.cellSize
        });
    },
    
    init: function () {
        this.requires("2D, DOM");
        
        // Getters / Setters.
        this.__defineGetter__("name", function () {return this._name});
        this.__defineSetter__("name", function (val) {
            if(val !== undefined) {
                this._name = val;
            }
        });
        
        this.__defineGetter__("cell", function () {return this._cell});
        this.__defineSetter__("cell", function (val) {
            var oldCell  = this.cell;
            this._cell = val;
            this.trigger("MoveCell", old, this._cell);
        });
    }
});

// -----------------------------------------------------------------------------
// Augment a MapEntity so it's movement between turns can be animated.
// -----------------------------------------------------------------------------
Crafty.c("Slide", {
    slide: function () {
        this.tween({
            "x": this.cell.x,
            "y": this.cell.y
        }, GAME.settings.turnDuration);
        
        // TODO: SlideMove event will be more important once diagonal movement is implemented (make sure entity movements doesn't cross).
        /*
        this.trigger("SlideMove", {
            "direction": direction,
            "newCell"  : newCell,
            "oldCell"  : oldCell
        });
        */
    },
    
    init: function () {
        this.requires("MapEntity, Tween");
        this.bind("MoveCell", this.slide);
    }
});
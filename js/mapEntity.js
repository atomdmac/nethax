// -----------------------------------------------------------------------------
// Map Entity (Players, Items, etc.)
// -----------------------------------------------------------------------------
Crafty.c("MapEntity", {
    // A reference to the MapCell containing this entity.
    _cell: null,
    
    // Entity's name.
    _name: "Entity Name",
    
    // TODO: Implement multi-turn actions (rest, eat, etc);
    // TODO: Implement multi-turn effects (confusion, trapped, etc);
    
    /*
     * Move the entity in the given direction.  I would have called this "move"
     * but the 2D component from crafty is already using it.  How lame.
     */
    motion: function (direction) {
        return GAME.map.moveEntity(this, direction);
    },
    
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
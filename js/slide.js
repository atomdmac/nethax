// -----------------------------------------------------------------------------
// Augment a MapEntity so it's movement between turns can be animated.
// -----------------------------------------------------------------------------
Crafty.c("Slide", {
    slide: function () {
        var props = {};
        if (this.x != this.cell.x) props.x = this.cell.x;
        if (this.y != this.cell.y) props.y = this.cell.y;
        
        this.tween(props, GAME.settings.turnDuration);
        
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
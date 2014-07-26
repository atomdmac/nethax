//------------------------------------------------------------------------------
// COMBAT
// -----------------------------------------------------------------------------
// These methods augment entities with the Character component to give them NPC
// abilities such as path finding, random movement, etc.
// -----------------------------------------------------------------------------
Crafty.c("NPC", {
    /*
     * Move the entity in a random direction.
     */
    randomMove: function () {
        var directions = ["N", "W", "S", "E"],
            randDir    = directions.random();
        
        // Attempt to move.
        if (GAME.map.moveEntity(this, randDir)) {
            // Update stats.
            GAME.stats.enemyMoves[randDir.toLowerCase()]++;
        }
    },
    
    /*
     * Update our record of what this entity can see.
     */
    // TODO: Move updateSight method to a more generic component since it could be useful to any entity.
    updateSight: function () {
        // Update color based on if we can see the hero or not.
        var ddaResult = GAME.map.lineOfSight(this.cell, GAME.player.cell, 20);
        
        if(ddaResult === true) {
            this.color("#ff0000");
        } else {
            this.color("#0000ff");
        }
    },
    
    init: function () {
        this.requires("Character, Slide");
    }
});
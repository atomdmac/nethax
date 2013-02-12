// -----------------------------------------------------------------------------
// Player Entity
// -----------------------------------------------------------------------------
// Crafty.addEntityFactory("Player", function () {
// Entity factories don't currently work in Crafty.  Use a regular ol' function.
function Player () {
    var e = Crafty.e("Character, Attackable, Attacker, Color, Slide, State, Player");
    // TODO: Use sprite instead of a boring solid color.
    e.color("#00ff00");
    e.name = "You";
    
    e.tick = function () {
        // EMPTY
    };
    
    return e;
};
// });

// -----------------------------------------------------------------------------
// Enemy Entity
// -----------------------------------------------------------------------------
// Crafty.addEntityFactory("Enemy", function () {
function Enemy () {
    var e = Crafty.e("NPC, Attackable, Attacker, Color, Slide, AgroPlayer");
    e.name = "Enemy";
    e.color("#0000ff");
    
    // Called at each simulation iteration/turn.
    e.tick = function () {
        // TODO: Do other stuff besides just move randomly.
        // this.randomMove();
        this.updateSight();
        this.updateAgroPlayer();
    }
    
    return e;
};
// });
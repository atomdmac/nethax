// -----------------------------------------------------------------------------
// Enemy Entity
// -----------------------------------------------------------------------------
function Enemy () {
    var e = Crafty.e("NPC, Attackable, Attacker, Color, Slide, AgroPlayer");
    e.name = "Enemy";
    e.color("#0000ff");
    
    // Called at each simulation iteration/turn.
    e.tick = function () {
        // TODO: Do other stuff besides just move randomly.
        // this.randomMove();
        // this.updateSight();
        this.updateAgroPlayer();
    }
    
    return e;
};
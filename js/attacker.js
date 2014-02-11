//------------------------------------------------------------------------------
// COMBAT
// -----------------------------------------------------------------------------
// These methods augment entities with the Character component to allow them to
// attack or be attacked.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// An entity that can attack and do damage to an Attackable entity.
// -----------------------------------------------------------------------------
Crafty.c("Attacker", {
    attack: function (target) {
        if (target.has("Attackable")) {
            // TODO: Factor in character attributes to determine die type/number.
            var check = GAME.roll(6, 2);
            
            // Is the attack successful?
            if (target.hit(check)) {
                // TODO: Factor in character attributes to determine die type/number.
                var dmg = GAME.roll(6, 2);
                target.hurt(dmg, this);
            }
            
            // Attack misses.
            else {
                GAME.log(this.name + " misses!");
            }
        }
        
        else {
            GAME.log(this.name + " tries to attack " +
                     target.name + " but fails.");
        }
    },
    
    init: function () {
        this.requires("Character");
    }
});
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

// -----------------------------------------------------------------------------
// An entity that can be attacked and killed/broken.
// -----------------------------------------------------------------------------
Crafty.c("Attackable", {
    hit: function (check) {
        // TODO: Factor in dodge chance when calculating results of a hit check.
        if (check > this._armor) {
            this.trigger("Hit", this);
            return true;
        } else {
            return false;
        }
    },
    
    /*
     * Do damage to this entity.  Entity will die/break if HP falls below 0.
     */
    hurt: function (amount, attacker) {
        
        // TODO: Add damage reduction someday...
        GAME.log(this.name, " takes ", amount, " damage.");
        
        // Take damage.
        this._hp -= amount;
        
        // Emit event!
        this.trigger("Hurt", {
            "maxHp" : this._maxHp,
            "hp"    : this._hp,
            "damage": amount
        });
        
        // Does the entity die?
        if(this._hp <= 0) {
            this.kill();
            return;
        }
        
        // Retaliate if possible.
        // TODO: Find a way to make sure retaliation code never loops infinitely between player and enemy.
        // TODO: Move retaliation code to hit() so enemies can retaliate even if the player misses.
        // TODO: Retaliation should use alignment (not isNPC()) to decide is target should be attacked.
        if (this.has("Attacker") &&
                attacker !== undefined &&
                attacker.has("Attackable") &&
                this.isNPC() === true) {
            
            GAME.log(this.name, " retaliates!");
            
            this.attack(attacker);
        }
    },
    
    /*
     * Kills the entity.
     */
    kill: function () {
        this.trigger("Killed", this);
        this.destroy();
        GAME.log(this.name, " dies.");
    },
    
    init: function () {
        this.requires("Character");
    }
});
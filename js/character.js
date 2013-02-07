// -----------------------------------------------------------------------------
// A Character that can advance in skill.
// -----------------------------------------------------------------------------
Crafty.c("Character", {
    
    // Is this character a non-player character?
    isNPC: function () {
        if (!this.has("Player")) {
            return true;
        }
        return false;
    },
    
    // -------------------------------------------------------------------------
    // CHARACTER ATTRIBUTES
    // -------------------------------------------------------------------------
    
    // Character stats/attributes.
    attributes: {
        "dex": 0,
        "str": 0,
        "wis": 0,
        "int": 0
    },
    
    // Character's current level.
    _level: 1,
    
    // Amount of experience required to reach next level.
    _maxExp: 0,
    
    // Current amount of experience.
    _exp: 0,
    
    // Character's current alignment.
    _alignment: null, // Will be a state machine? (Good / Neutral / Chaotic).
    
    /*
     * Get/Set the Armor Class for this entity.
     */
    
    _armor: 5,
    _calcArmor: function () {
        // TODO: AC could be affected by Character stats and equiped items.
        return this._armor;
    },
    
    /*
     * Get/Set max Hit Points for this entity.
     */
    // TODO: Implement maximum HP limit.
    _maxHp: 10,
    _hp: 10,
    
    init: function () {
        // Dependencies.
        this.requires("MapEntity");
        
        // Getters
        this.__defineGetter__("armor", function () {return this._calcArmor()});
        this.__defineGetter__("maxHP", function() {return this._maxHp});
        this.__defineGetter__("hp", function() {return this._hp});
        this.__defineGetter__("exp", function() {return this._exp});
    }
});
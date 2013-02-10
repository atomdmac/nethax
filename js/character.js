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
    // TODO: Implement attributes.
    attributes: {
        // Agility / Dexterity
        "agility" : 4,
        // Intelligence / Smarts
        "smarts"  : 4,
        // Wisdom / Willpower
        "spirit"  : 4,
        // Physical Strength
        "strength": 4,
        // Endurance / Pain Tolerance / Poison & Toxin Resistance
        "vigor"   : 4
    },
    
    // Character Skills
    // TODO: Implement skills.
    skills: {
        // (Agility) Ability to use melee attacks and weapons.
        "fighting"    : 1,
        // (Agility) Ability to use launchers, bows, guns, etc.
        "shooting"    : 1,
        // (Spirit)  Resistance to mental distress.
        "guts"        : 1,
        // (Smarts)  Ability to treat wounds.
        "healing"     : 1,
        // (Spirit)  Ability to frighten a target.
        //           Checked against target's Spirit / Guts.
        "intimidation": 1,
        // (Smarts)  Alertness, ability to search, etc.
        "notice"      : 1,
        // (Agility) Hide or move unnoticed.
        "stealth"     : 1,
        // (Smarts)  Ability to repair gadgets. Suffer -2 without tools.
        "repair"      : 1
    },
    
    /**
     * Return a character's trait.  Throws an exception if the trait is invalid.
     * @param traitName {String} The name of the trait to retrieve.
     * @return {Number}
     */
    getTrait: function (traitName) {
        // Trait is an attribute.
        if(traitName in this.attributes) {
            return this.attributes[traitName];
        }
        // Trait is a skill.
        if(traitName in this.skills) {
            return this.skills[traitName];
        }
        // Trait is derived from attributes / skills.
        switch (traitName) {
            case "parry":
                return 2 + Math.floor(this.attributes.fighting / 2);
            case "pace":
                // TODO: Pace is static.  What modifiers could be added?
                return 6;
            case "charisma":
                // TODO: Charisma is static.  What modifiers could be added?
                return 0;
            case "toughness":
                return 2 + Math.floor(this.attributes.vigor / 2) + this._calcArmor();
        }
        
        // Trait doesn't exist!
        throw Error("Trait '" + traitName + "' does not exist.");
    },
    
    // Character's current level.
    // TODO: Implement experience level.
    _level: 1,
    
    // Amount of experience required to reach next level.
    _maxExp: 0,
    
    // Current amount of experience.
    // TODO: Implement experience.
    _exp: 0,
    
    // Character's current alignment.
    // TODO: Implement character alignment.
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
    
    /*
     * Take no action and heal.
     */
    rest: function () {
        // TODO: Implement rest.
    },
    
    /*
     * Add the given amount of HP to this entity over the given number of turns.
     */
    // TODO: Implement healing, especially healing over time while resting.
    heal: function (amount, duration, healer) {
        // TODO: Implement heal.
        // TODO: Emit heal event.
    },
    
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
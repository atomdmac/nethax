Crafty.c("State", {
    // A list of effects applied to this entity.
    _effects: null,
    
    /**
     * Add an effect to this entity.
     * @param {String} name The unique ID for this effect.
     * @param {Function} func A function to call on each turn/tick of the game.
     * @param {Number} expirey The number of turns that this effect will be in use before it expires.
     * @param {Number} frequency The number of turns that must elapse before this effect will be applied.
     * @param {Array} args An array of arguments to pass to the effect function.
     * @returns {Boolean}  Return TRUE if affect was added.  Return FALSE if effect already.
     */
    addEffect: function (name, func, expirey, frequency, args) {
        var e = function () {
            e.count++;
            
            if(e.count % e.frequency == 0) {
                e.func.apply(e.entity, e.args);
            }
            
            // Does effect expire?
            if(e.count == e.expirey && e.expirey != 0) {
                return true;
            }
            return false;
        };
        e.name      = name;
        e.entity    = this;
        e.func      = func;
        e.expirey   = expirey;
        e.frequency = frequency;
        e.args      = args;
        e.count     = 0;
        
        this._effects.push(e);
    },
    
    /**
     * Remove the effect with the given ID.
     * @param {String} name The unique ID of the effect to remove.
     * @returns {Boolean}  Return TRUE if effect was removed. Return FALSE if effect didn't exist.
     */
    removeEffect: function (name) {
        for (var i=0; i<this._effects.length; i++) {
            if (this._effects[i].name == name) {
                this._effects.splice(i, 1);
                return true;
            }
        }
        return false;
    },
    
    /**
     * Return true if the named effect has been applied to this entity, false if not.
     * @param {String} name Name of effect to query for.
     * @returns {Boolean}  TRUE if effect has been applied to this entity, FALSE if not.
     */
    hasEffect: function (name) {
        for (var i=0; i<this._effects.length; i++) {
            if (this._effects[i].name == name) {
                return true;
            }
        }
        return false;
    },
    
    /**
     * Apply effects for one iteration.
     * @returns null
     */
    applyEffects: function () {
        var result,
            i = this._effects.length - 1;
        
        for (i; i>=0; i--) {
            // Apply effect and remove if it expired (i.e. it returns TRUE).
            if(this._effects[i]()) {
                this._effects.splice(i, 1);
            }
        }
    },
    
    init: function () {
        this._effects = [];
    }
});
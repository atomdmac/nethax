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
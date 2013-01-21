function GAME () {
    // Settings.
    var settings = {
        viewW: 10,
        viewH: 10,
        cellSize: 16
    };
    
    // Init Crafty engine.
    var initW = settings.viewW * settings.cellSize,
        initH = settings.viewH * settings.cellSize;
    
    Crafty.init(initW, initH);
    
    // Initialize map.
    this.map = Crafty.e("Map");
    this.map.parse(sampleMap, settings.cellSize);
    
    // Initialize player.
    this.player = Crafty.e("Player");
    this.player.initPlayer(2, 2, settings.cellSize);
    
    this.map.addActor(2, 2, this.player);
    
    // Follow the player.
    Crafty.viewport.follow(this.player, 0, 0);
    
    // Methods.
    function tick () {
        // TODO
    }
    
    // Create public interface.
    GAME = {
        // Properties
        "settings": settings,
        "map": map,
        "player": player,
        
        // Methods
        "tick": tick
    }
}
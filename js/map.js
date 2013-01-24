var sampleMap = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,0,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,0,0,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,0,0,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,0,0,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,0,0,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,0,0,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,0,0,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,0,0,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,0,0,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,0,0,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,0,0,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,0,0,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,0,0,1,1,0,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

// -----------------------------------------------------------------------------
// Map Cell Component
// -----------------------------------------------------------------------------
Crafty.c("MapCell", {
    passable: false,
    actor: null,
    items: [],
    
    update: function () {
        if (this.passable) {
            this.color("#fff");
        } else {
            this.color("#000");
        }
    },
    
    init: function () {
        // Dependencies.
        this.requires("2D, DOM, Color");
    }
});

// -----------------------------------------------------------------------------
// Map Component
// -----------------------------------------------------------------------------
Crafty.c("Map", {
    cells: null,
    actors: null,
    
    load: function (url) {
        // TODO
    },
    
    parse: function (mapData, cellSize) {
        this.cells = [];
        for (var x=0; x<mapData.length; x++) {
            this.cells.push(new Array());
            
            for (var y=0; y<mapData[x].length; y++) {
                
                var newCell = Crafty.e("MapCell");
                newCell.passable = mapData[y][x] == 0 ? false : true;
                newCell.actor = null;
                newCell.items = []; // TODO: Add items.
                newCell.attr({
                    "w": cellSize,
                    "h": cellSize,
                    "x": x * cellSize,
                    "y": y * cellSize
                });
                newCell.update();
                
                this.cells[x].push(newCell);
            }
        }
    },
    
    repaint: function (x, y) {
        this.cells[x][y].update();
    },
    
    addItem: function (x, y, item) {
        this.cells[x][y].items.push(item);
    },
    
    addActor: function (x, y, actor) {
        this.cells[x][y].actor = actor;
        this.actors.push(actor);
        
        // Initialize the actor.
        actor.mapEntity(x, y);
        
        // Listen for move events so we can update the map.
        var self = this;
        actor.bind("SlideMove", function (e) {
            self.cells[e.oldCell.x][e.oldCell.y].actor = null;
            self.cells[e.newCell.x][e.newCell.y].actor = this;
        });
    },
    
    init: function () {
        this.actors = [];
    }
});
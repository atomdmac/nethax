var PathDisplay = function (game) {
    
    this.width  = game.map._cellSize * game.map._width;
    this.height = game.map._cellSize * game.map._height;
    this.canvas = $("<canvas width='" + this.width + "' height='" + this.height + "'></canvas>")
        .css({
            "position": "absolute",
            "left"    : "0px",
            "top"     : "0px",
            "z-index" : "100"
        });
    this.ctx    = this.canvas[0].getContext("2d");
    
    $("body").append(this.canvas);
    
    this.player = GAME.map.actors[0];
    this.enemy  = GAME.map.actors[1];
    
    this.update = function () {
        var p = this.player.cell,
            e = this.enemy.cell;
        
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.beginPath();
        this.ctx.moveTo(p.x + game.map._cellSize / 2,
                        p.y + game.map._cellSize / 2);
        this.ctx.lineTo(e.x + game.map._cellSize / 2,
                        e.y + game.map._cellSize / 2);
        this.ctx.stroke();
        
        console.log("update path display");
    }
    GAME.notify(this.update, this);
}
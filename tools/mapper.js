/*
 * Mapper
 * The simplest mapping utility of all time.
 */
var Mapper = {
    ctx: null,
    grid: null,
    width: 40,
    height: 20,
    cellSize: 16,
    init: function (data) {
        var canvas = document.createElement("canvas");
        canvas.setAttribute("width", this.width * this.cellSize);
        canvas.setAttribute("height", this.height * this.cellSize);
        
        document.body.appendChild(canvas);
        
        var self = this;
        var onDrag = function (e) {
            var rect   = canvas.getClientRects()[0],
                pixelX = e.clientX - rect.left,
                pixelY = e.clientY - rect.top,
                cell   = self.toGrid(pixelX, pixelY);
            
            if(e.buttons == 1) {
                self.grid[cell.x][cell.y] = 0;
            } else if(e.buttons == 2) {
                self.grid[cell.x][cell.y] = 1;
            }
            self.drawCell(cell.x, cell.y, self.grid[cell.x][cell.y]);
        };
        canvas.addEventListener("mousedown", function (e) {
            canvas.addEventListener("mousemove", onDrag);
        });
        canvas.addEventListener("mouseup", function (e) {
            canvas.removeEventListener("mousemove", onDrag);
        });
        canvas.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            return false;
        });
        
        this.ctx = canvas.getContext("2d");
        this.initGrid(this.width, this.height);
    },
    toPixel: function (x, y) {
        return {
            "x": x * this.cellSize,
            "y": y * this.cellSize
        };
    },
    toGrid: function (x, y) {
        return {
            "x": Math.floor(x / this.cellSize),
            "y": Math.floor(y / this.cellSize)
        };
    },
    setWidth: function (w) {
        // TODO
    },
    setHeight: function (h) {
        // TODO
    },
    initGrid: function (w, h) {
        this.grid = [];
        for(var x=0; x<w; x++) {
            this.grid[x] = new Array(h);
            for(var y=0; y<h; y++) {
                this.grid[x][y] = 1;
            }
        }
    },
    drawGrid: function (ctx) {
        var xlen = this.width,
            x = 0,
            ylen = this.height,
            y = 0;
        for(; x<xlen; x++) {
            for(y=0; y<ylen; y++) {
                this.drawCell(x, y, this.grid[x][y]);
            }
        }
    },
    drawCell: function (x, y, data) {
        this.ctx.beginPath();
        this.ctx.rect(x*this.cellSize, y*this.cellSize, this.cellSize, this.cellSize);
        
        if(data === 0) {
            this.ctx.fillStyle = "#000";
        } else {
            this.ctx.fillStyle = "#fff";
        }
        this.ctx.fill();
        this.ctx.stroke();
    },
    exportData: function () {
        console.log(JSON.stringify(this.grid));
    },
    importData: function (data) {
        this.grid = data;
        this.drawGrid(this.ctx);
    }
};
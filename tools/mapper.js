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
    init: function (canvas) {
        if (!canvas) {
            canvas = document.createElement("canvas");
            document.body.appendChild(canvas);
        }
        canvas.setAttribute("width", this.width * this.cellSize);
        canvas.setAttribute("height", this.height * this.cellSize);
        
        
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
        
        this.canvas = canvas;
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
        // Expand width.
        if (w>this.width) {
            var xlen = w - this.width,
                x    = 0;
            for(; x<xlen; x++) {
                this.grid.push([]);
                var ylen = this.height,
                    y    = 0;
                for(; y<ylen; y++) {
                    this.grid[x].push(1);
                }
            }
        }
        // Reduce width.
        else if (w < this.width) {
            this.grid.splice(w, this.width - w);
        }
        
        this.width = typeof w == "number" ? w : this.width;
        this.canvas.width = this.width * this.cellSize;
        this.drawGrid(this.ctx);
    },
    setHeight: function (h) {
        var xlen, x, ylen, y;
        
        // Expand height.
        if (h>this.height) {
            xlen = this.grid.length;
            x    = 0;
            
            for(; x<xlen; x++) {
                ylen = h - this.height;
                y    = 0;
                
                for(; y<ylen; y++) {
                    this.grid[x].push(1);
                }
            }
        }
        
        // Reduce height.
        else if (h<this.height) {
            xlen = this.grid.length;
            
            for(; x<xlen; x++) {
                this.grid[x].splice(h, this.height - h);
            }
        }
        
        this.height = typeof h == "number" ? h : this.height;
        this.canvas.height = this.height * this.cellSize;
        this.drawGrid(this.ctx);
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
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "#ccc";
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
        return JSON.stringify(this.grid);
    },
    importData: function (data) {
        this.grid = data;
        this.drawGrid(this.ctx);
    }
};
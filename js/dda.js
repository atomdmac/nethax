/**
 * DDA line algorithm.
 *
 * @author playchilla.com
 */
Crafty.c("DDAMap", {
    dda: function (x1, y1, x2, y2) {
        var pix1     = this.toPos(x1, y1, true),
            pix2     = this.toPos(x2, y2, true),
            // gridPos  = map.pos2cell(pix1.x, pix1.y);
            gridPosX = x1, // Math.round(pix1.x / _cellSizeX),
            gridPosY = y1; // Math.round(pix1.y / _cellSizeY);
        
        // Cell contents collidable?
        if (this.isCollidable(x1, y1)) {
            return [];
        }
        
        var dirX = pix2.x - pix1.x;
        var dirY = pix2.y - pix1.y;
        var distSqr = dirX * dirX + dirY * dirY;
        if (distSqr < 0.00000001) {
            return [];
        }
        
        var nf = 1 / Math.sqrt(distSqr);
        dirX *= nf;
        dirY *= nf;

        var deltaX = this._cellSize / Math.abs(dirX);
        var deltaY = this._cellSize / Math.abs(dirY);

        var maxX = gridPosX * this._cellSize - pix1.x;
        var maxY = gridPosY * this._cellSize - pix1.y;
        if (dirX >= 0) maxX += this._cellSize;
        if (dirY >= 0) maxY += this._cellSize;
        maxX /= dirX;
        maxY /= dirY;

        var stepX = dirX < 0 ? -1 : 1;
        var stepY = dirY < 0 ? -1 : 1;
        var gridGoalX = x2; //Math.floor(pix2.x / this._cellSize);
        var gridGoalY = y2; //Math.floor(pix2.y / this._cellSize);
        
        var cellList = new Array();
        
        var safety = 0;
        while (gridPosX != gridGoalX || gridPosY != gridGoalY) {
            
            // TODO: Remove loop safety mechanism.
            // Safety, since we're early days with this loop yet...
            if(safety > 200) {
                break;
            }
            safety++;
            
            if (maxX < maxY) {
                maxX += deltaX;
                gridPosX += stepX;
            }
            else {
                maxY += deltaY;
                gridPosY += stepY;
            }
            
            // Cell is out of bounds.  Return cell list.
            if (!this.inBounds(gridPosX, gridPosY)) {
                return cellList;
            }

            // Collision found.  Return cell list.
            if (this.isCollidable(gridPosX, gridPosY)) {
                return cellList;
            }
            
            // No collision found.  Add cell to list.
            else {
                /*
                 cellList.push({
                    "x": gridPosX,
                    "y": gridPosY,
                    "type": "path"
                });
                */
                cellList.push(this.getCell(gridPosX, gridPosY));
            }
        }
        
        // No more collisions found.  Return cells.
        return cellList;
    },
    
    init: function () {
        this.requires("Map");
    }
});
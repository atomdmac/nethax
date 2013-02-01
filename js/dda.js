/**
 * DDA line algorithm.
 *
 * @author playchilla.com
 */
Crafty.c("DDAMap", {
    dda: function (x1, y1, x2, y2, max) {
        var gridPos = this.toCell(x1, y1);
            gridPosX = gridPos.x, // Math.round(x1 / this._cellSize),
            gridPosY = gridPos.y; // Math.round(y1 / this._cellSize);
            max = max !== undefined ? max : 200;

        // Cell contents collidable?
        if (this.isCollidable(gridPosX, gridPosY)) {
            return [];
        }
        
        var dirX = x2 - x1;
        var dirY = y2 - y1;
        var distSqr = dirX * dirX + dirY * dirY;
        if (distSqr < 0.00000001) {
            return [];
        }
        
        var nf = 1 / Math.sqrt(distSqr);
        dirX *= nf;
        dirY *= nf;

        var deltaX = this._cellSize / Math.abs(dirX);
        var deltaY = this._cellSize / Math.abs(dirY);

        var maxX = gridPosX * this._cellSize - x1;
        var maxY = gridPosY * this._cellSize - y1;
        if (dirX >= 0) maxX += this._cellSize;
        if (dirY >= 0) maxY += this._cellSize;
        maxX /= dirX;
        maxY /= dirY;

        var stepX = dirX < 0 ? -1 : 1;
        var stepY = dirY < 0 ? -1 : 1;
        var gridGoalX = Math.floor(x2 / this._cellSize);
        var gridGoalY = Math.floor(y2 / this._cellSize);
        
        var cellList = new Array();
        
        while (gridPosX != gridGoalX ||
               gridPosY != gridGoalY ||
               max > cellList.length) {
            if (maxX < maxY) {
                maxX += deltaX;
                gridPosX += stepX;
            }
            else {
                maxY += deltaY;
                gridPosY += stepY;
            }
            
            // Out of bounds.  Return cell list.
            if (!this.inBounds(gridPosX, gridPosY)) {
                return cellList;
            }
            
            // Collision found.  Return cell list.
            if (this.isCollidable(gridPosX, gridPosY)) {
                return cellList;
            }
            
            // No collision found.  Add cell to list.
            else {
                cellList.push(this.getCell(gridPosX, gridPosY));
            }
        }
        
        // No collisions found.  Return cells.
        return cellList;
    },
    
    init: function () {
        this.requires("Map");
    }
});
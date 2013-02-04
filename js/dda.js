/**
 * DDA line algorithm.
 *
 * @author playchilla.com
 */
Crafty.c("DDAMap", {
    
    /**
     * Determine whether or not there is clear line-of-sight between two points
     * on the map.  Returns an array where the first index contains a Boolean
     * value indicating whether there is line-of-sight or not.  The rest of the
     * indices in the array contain references to MapCell objects (where index 1
     * represents the cell closest to x1/y1) and so on.
     */
    dda: function (x1, y1, x2, y2, max) {
        var gridPos = this.toCell(x1, y1);
            gridPosX = gridPos.x, // Math.round(x1 / this._cellSize),
            gridPosY = gridPos.y; // Math.round(y1 / this._cellSize);
            max = max !== undefined ? max : 200,
            // Assume that we -can't- reach the goal cell.
            returnList = [false];

        // Cell contents collidable?
        /*
        if (this.isCollidable(gridPosX, gridPosY)) {
            return returnList;
        }
        */
        
        var dirX = x2 - x1;
        var dirY = y2 - y1;
        var distSqr = dirX * dirX + dirY * dirY;
        if (distSqr < 0.00000001) {
            return returnList;
        }
        
        var nf = 1 / Math.sqrt(distSqr);
        dirX *= nf;
        dirY *= nf;

        var deltaX = this._cellSize / Math.abs(dirX);
        var deltaY = this._cellSize / Math.abs(dirY);

        var maxX = gridPosX * this._cellSize - x1;
        var maxY = gridPosY * this._cellSize - y1;
        
        if (dirX >= 0) {
            maxX += this._cellSize;
        }
        if (dirY >= 0) {
            maxY += this._cellSize;
        }
        
        maxX /= dirX;
        maxY /= dirY;

        var stepX = dirX < 0 ? -1 : 1;
        var stepY = dirY < 0 ? -1 : 1;
        var gridGoalX = Math.floor(x2 / this._cellSize);
        var gridGoalY = Math.floor(y2 / this._cellSize);
        
        while ((gridPosX != gridGoalX || gridPosY != gridGoalY)) {
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
                // console.log("No LOS.  Out of Bounds found at (", gridPosX, ", ", gridPosY, ")");
                return returnList;
            }
            
            // Collision found.  Return cell list.
            if (this.isCollidable(gridPosX, gridPosY)) {
                // console.log("No LOS.  Collision found at (", gridPosX, ", ", gridPosY, ")");
                return returnList;
            }
            
            // No collision found.  Add cell to list.
            else {
                returnList.push(this.getCell(gridPosX, gridPosY));
            }
            
            // Break and return if we've reached our maximum path length.
            if(max < returnList.length + 1) {
                return returnList;
            }
        }
        
        // No collisions found.  Update first index of results array to reflect.
        returnList[0] = true;
        
        // Return results!
        return returnList;
    },
    
    lineOfSight: function (cell1, cell2, max) {
        // Use center of each cell as end points.
        var cx1 = cell1.x + (this.cellSize / 2),
            cy1 = cell1.y + (this.cellSize / 2),
            cx2 = cell2.x + (this.cellSize / 2),
            cy2 = cell2.y + (this.cellSize / 2);
        var path = this.dda(cx1, cy1, cx2, cy2, max);
    
//---------------------------- DEBUG -----------------------------------------//
        /*
        console.log("DDAMap :: lineOfSight : path = ", path);
        GAME.map.refresh();
        for(var dda=1; dda<path.length; dda++) {
            path[dda].color("#ccc");
        }
        */
//---------------------------- DEBUG -----------------------------------------//
        
        if(path[0]) {
            return true;
        } else {
            return false;
        }
    },
    
    init: function () {
        this.requires("Map");
    }
});
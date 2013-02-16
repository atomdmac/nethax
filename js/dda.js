/**
 * DDA line algorithm.
 *
 * @author playchilla.com
 */
// TODO: Make DDA / Line-of-Sight a component that can be add to Map.
Crafty.c("DotMarker", {
    mark: function (x, y) {
        this.attr({
            "x": x,
            "y": y,
            "w": 1,
            "h": 1
        });
        this.color("#ff0000");
    },
    clear: function () {
        this.destroy();
    },
    init: function () {
        this.requires("DOM, 2D, Color");
    }
});
Crafty.c("DDAMap", {
    
    /**
     * Determine whether or not there is clear line-of-sight between two points
     * on the map.  Returns an array where the first index contains a Boolean
     * value indicating whether there is line-of-sight or not.  The rest of the
     * indices in the array contain references to MapCell objects (where index 1
     * represents the cell closest to x1/y1) and so on.
     */
    dda: function (x1, y1, x2, y2) {
        var gridPos = this.toCell(x1, y1);
            gridPosX = gridPos.x, // Math.round(x1 / this._cellSize),
            gridPosY = gridPos.y, // Math.round(y1 / this._cellSize);
            // Assume that we -can't- reach the goal cell.
            returnList = [false];
        
        console.log("DDA: Starting grid position: ", gridPosX, ", ", gridPosY);
        
        // Cell contents collidable?
        if (!this.isPassable(gridPosX, gridPosY)) {
            return returnList;
        }
        
        var dirX = x2 - x1;
        var dirY = y2 - y1;
        var distSqr = dirX * dirX + dirY * dirY;
        if (distSqr < 0.00000001) {
            return returnList;
        }
        
        // Is "perfectly" diagonal?
        if (Math.abs(dirX) == Math.abs(dirY)) {
            console.log("Diagonal!");
            return this.diag(this.getCell(gridPosX, gridPosY), dirX, dirY);
        }
        
        var nf = 1 / Math.sqrt(distSqr);
        dirX *= nf;
        dirY *= nf;

        var deltaX = this._cellSize / Math.abs(dirX);
        var deltaY = this._cellSize / Math.abs(dirY);
        
        console.log("Deltas: ", deltaX, ", ", deltaY);

        var maxX = gridPosX * this._cellSize - x1;
        var maxY = gridPosY * this._cellSize - y1;
        
        console.log("DDA: maxX, maxY offets: ", maxX, ", ", maxY);
        
        if (dirX >= 0) {
            maxX += this._cellSize;
        }
        if (dirY >= 0) {
            maxY += this._cellSize;
        }
        
        console.log("DDA: maxX, maxY w/ cellSize added: ", maxX, ", ", maxY);
        
        maxX /= dirX;
        maxY /= dirY;
        
        console.log("Divide maxX/maxY by dir: ", maxX, ", ", maxY);

        var stepX = dirX < 0 ? -1 : 1;
        var stepY = dirY < 0 ? -1 : 1;
        var gridGoalX = Math.floor(x2 / this._cellSize);
        var gridGoalY = Math.floor(y2 / this._cellSize);
        
        var xError = 0,
            yError = 0;
        
        // DEBUG CODE:
        this.refresh();
        
        while ((gridPosX != gridGoalX || gridPosY != gridGoalY)) {
            if (maxX < maxY) {
                maxX += deltaX;
                gridPosX += stepX;
            }
            else {
                maxY += deltaY;
                gridPosY += stepY;
            }
            
            // Error checking
            if(xError > 0.5 || xError < -0.5) {
                // Shift position over and reset xError
                // xError += 
            } else {
                // Increment error.
            }
            
            // Error checking
            if(yError > 0.5 || yError < -0.5) {
                // Shift position over and reset xError
            } else {
                // Increment error.
            }
            
            console.log("DDA: Iterating; maxX/maxY = ", maxX, ", ", maxY);
            
            // Out of bounds.  Return cell list.
            if (!this.inBounds(gridPosX, gridPosY)) {
                console.log("No LOS.  Out of Bounds found at (", gridPosX, ", ", gridPosY, ")");
                return returnList;
            }
            
            // Collision found.  Return cell list.
            if (!this.isTransparent(gridPosX, gridPosY)) {
                console.log("No LOS.  Collision found at (", gridPosX, ", ", gridPosY, ")");
                return returnList;
            }
            
            // No collision found.  Add cell to list.
            else {
                var c = this.getCell(gridPosX, gridPosY);
                returnList.push(c);
                
                // DEBUG CODE
                c.color("#ccc");
            }
        }
        
        // No collisions found.  Update first index of results array to reflect.
        returnList[0] = true;
        
        // Return results!
        return returnList;
    },
    
    diag: function (startCell, xSlope, ySlope) {
        var exit   = false,
            xCount = startCell.cellX,
            yCount = startCell.cellY;
            xInc   = xSlope > 0 ? 1 : -1,
            yInc   = ySlope > 0 ? 1 : -1,
            path   = [false];
        
        var ctr = 0;
        while(!exit) {
            // SAFETY COUNTER: REMOVE THIS EVENTUALLY!
            ctr++;
            if(ctr>200) exit = false;
            
            // We are no longer in bounds!
            if(!this.inBounds(xCount, yCount)) {
                return path;
            }
            
            // If I can't see through it, return path.
            if(!this.isTransparent(xCount, yCount)) {
                return path;
            }
            
            // Add that cell to the path!
            path.push(this.getCell(xCount, yCount));
            xCount++;
            yCount++;
        }
        
        //
        path[0] = true;
        return path;
    },
    
    lineOfSight: function (cell1, cell2, max, fullPath) {
        
        fullPath = fullPath !== undefined ? fullPath : false;
        
        // Is it even in our sight radius?!
        var xdiff = cell1.cellX - cell2.cellX,
            ydiff = cell1.cellY - cell2.cellY,
            diag  = Math.sqrt((xdiff * xdiff) + (ydiff * ydiff));
        if(diag > max) {
            console.log("Out of range! ", diag, " / ", max);
            return false;
        }
        
        // TODO: These same calculations are littered all over the place.  Reduce, reuse!
        // Use inner of closest corners.
            var xMod, yMod
                cellSize = GAME.map.cellSize;
            if (cell1.cellX == cell2.cellX) {
                xMod = cellSize / 2;
            }
            else if(cell1.cellX > cell2.cellX) {
                xMod = 0;
            }
            else {
                xMod = (cellSize);
            }
            
            if (cell1.cellY == cell2.cellY) {
                yMod = cellSize / 2;
            }
            else if(cell1.cellY > cell2.cellY) {
                yMod = 0;
            }
            else {
                yMod = (cellSize);
            }
            
        // Use center of each cell as end points.
        var cx1 = cell1.x + (cellSize / 2),
            cy1 = cell1.y + (cellSize / 2),
            cx2 = cell2.x + (cellSize / 2),
            cy2 = cell2.y + (cellSize / 2),
            path = GAME.map.dda(cx1, cy1, cx2, cy2);
        /*
        var cx1 = cell1.x + xMod,
            cy1 = cell1.y + yMod,
            cx2 = cell2.x + xMod,
            cy2 = cell2.y + yMod,
            path = GAME.map.dda(cx1, cy1, cx2, cy2, max);
    */
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
            // If full path result is requested...
            if(fullPath) {
                return path;
            }
            return true;
        } else {
            return false;
        }
    },
    
    init: function () {
        this.requires("Map");
    }
});
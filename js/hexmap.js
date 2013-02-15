var Helper = {

	arrays: {
		
		addElement: function(array, element) {
			array.push(element);
		},

		removeElement: function(array, element, firstOccurrence) {
		firstOccurrence = typeof firstOccurrence != 'undefined' ? firstOccurrence : false;
		var i = array.length;
		while(i--) {
			if(array[i] === element) {
				array.splice(i, 1);
				if(firstOccurrence) return;
			}
		}
		},

		contains: function(array, element) {
		var i = array.length;
		while(i--) {
			if(array[i] === element) return true;
		}
		return false;
	}
	
	},

	objects: {
		defineGetter: function(obj, prop, getFunc) {
			if(Object.defineProperty) return Object.defineProperty(obj, prop, { get: getFunc, configurable: true, enumerable: true });	 
			if(Object.prototype.__defineGetter__) return obj.__defineGetter__(prop, getFunc);
		},

		defineSetter: function(obj, prop, setFunc) {
			if(Object.defineProperty) return Object.defineProperty(obj, prop, { set: setFunc, configurable: true, enumerable: true });
			if(Object.prototype.__defineSetter__) return obj.__defineSetter__(prop, setFunc);
		},

		defineAccessors: function(obj, prop, getFunc, setFunc) {
			this.defineGetter(obj, prop, getFunc);
			this.defineSetter(obj, prop, setFunc);
		}
	}
};



Crafty.c("HexmapNode", {
	_i: 0,
	_j: 0,
	_parentNode: null,
	_G: 0,
	_H: 0,

	init: function() {		
		Helper.objects.defineAccessors(this, "i", function() { return this._i; }, function(v) { this._i = v; });
		Helper.objects.defineAccessors(this, "j", function() { return this._j; }, function(v) { this._j = v; });
		Helper.objects.defineAccessors(this, "parentNode", function() { return this._parentNode; }, function(v) { this._parentNode = v; });
		Helper.objects.defineAccessors(this, "G", function() { return this._G; }, function(v) { this._G = v; });
		Helper.objects.defineAccessors(this, "H", function() { return this._H; }, function(v) { this._H = v; });
		Helper.objects.defineGetter(this, "F", function() { return this._G + this._H; });
	},
	
	hexmapNode: function(i, j) {
		this._i = i;
		this._j = j;
		return this;
	}
});

Crafty.c("Hexmap", {
	_mapWidth: 0,
	_mapHeight: 0,
	_tiles: new Array(),
	_tileMeta: {
		_width: 0,
		_height: 0,
		_r: 0,
		_s: 0,
		_h: 0
	},
	
	init: function() {

	},

	hexmap: function(tileWidth, tileHeight) {
		this._tileMeta._width = tileWidth;
		this._tileMeta._height = tileHeight;
		this._tileMeta._r = this._tileMeta._width * 0.5;
		this._tileMeta._s = this._tileMeta._r / Math.cos(20 * (Math.PI / 180));
		this._tileMeta._h = (this._tileMeta._height - this._tileMeta._s) * 0.5;

		return this;
	},
	
	toPixel: function (xCell, yCell) {
	// TODO: Implement toPixel.
	},
	
	toCell: function (xPixel, yPixel) {
	// TODO: Implement toCell.
	}

	setTile: function(i, j, tile) {
		if(i >= this._mapWidth || i < 0 || j >= this._mapHeight || j < 0) return;
		this._tiles[(j * this._mapHeight) + i] = tile;
	},

	getTile: function(i, j) {
		if(i >= this._mapWidth || i < 0 || j >= this._mapHeight || j < 0) return null;
		return this._tiles[(j * this._mapHeight) + i];
	},

	getAdjacentTiles: function(i, j) {
		var adjacentTiles = new Array();

		if(this.getTile(i + 1, j)) adjacentTiles.push(this.getTile(i + 1, j));
		if(this.getTile(i - 1, j)) adjacentTiles.push(this.getTile(i - 1, j));
		if(this.getTile(i, j - 1)) adjacentTiles.push(this.getTile(i, j - 1));
		if(this.getTile(i, j + 1)) adjacentTiles.push(this.getTile(i, j + 1));
		
		if(j % 2 != 0) {
			if(this.getTile(i - 1, j - 1)) adjacentTiles.push(this.getTile(i - 1, j - 1));
			if(this.getTile(i - 1, j + 1)) adjacentTiles.push(this.getTile(i - 1, j + 1));
		}
		else {
			if(this.getTile(i + 1, j - 1)) adjacentTiles.push(this.getTile(i + 1, j - 1));
			if(this.getTile(i + 1, j + 1)) adjacentTiles.push(this.getTile(i + 1, j + 1));
		}	

		return adjacentTiles;
	},

	placeTile: function(i, j, tile) {
		tile.x = i * 2 * this._tileMeta._r + ((j % 2 == 0) * this._tileMeta._r);
		tile.y = j * (this._tileMeta._h + this._tileMeta._s);

		tile.areaMap(
			[this._tileMeta._width * 0.5, 0],
			[this._tileMeta._width, this._tileMeta._height * 0.25],
			[this._tileMeta._width, this._tileMeta._height * 0.75],
			[this._tileMeta._width * 0.5, this._tileMeta._height],
			[0, this._tileMeta._height * 0.75],
			[0, this._tileMeta._height * 0.25]
		);

		return this;
	},

	create: function(mapWidth, mapHeight, creationFunc) {
		this._mapWidth = mapWidth;
		this._mapHeight = mapHeight;

		for(j = 0; j < this._mapHeight; j++) {
			for(i = 0; i < this._mapWidth; i++) {
				tile = creationFunc();
				tile.addComponent("HexmapNode").hexmapNode(i, j);
				this.placeTile(i, j, tile).setTile(i, j, tile);
			}
		}
	},

	findPath: function(startingNode, targetNode) {
		var path = new Array();
		var openList = new Array();
		var closedList = new Array();

		var H = function(u, v) {
			dx = v.x - u.x;
			dy = v.y - u.y;
			return dx * dx + dy * dy;
		}

		startingNode.G = 100;
		startingNode.parentNode = null;
		openList.push(startingNode);

		while(true) {
			var bestNode = null;

			// find the best node (lowest F) in the open list
			openList.forEach(function(node) {
				if(bestNode == null) {
					bestNode = node;
				}
				else if(node != null) {
					node.H = H(node, targetNode);
					bestNode.H = H(bestNode, targetNode);
					if(node.F < bestNode.F) bestNode = node;
				}
			});

			// if we have found the target or the open list is empty we are done
			if(bestNode == targetNode || bestNode == null) break;

			// move the best node to the closed list
			Helper.arrays.removeElement(openList, bestNode);
			Helper.arrays.addElement(closedList, bestNode);			

			// consider all the adjacent tiles
			this.getAdjacentTiles(bestNode.i, bestNode.j).forEach(function(node) {
				if(node != null) {
					if(Helper.arrays.contains(closedList, node)) {
						// ignore if it's in the closed list
					}
					else if(!Helper.arrays.contains(openList, node)) {
						// add to the open list if it's not already in it
						Helper.arrays.addElement(openList, node);
						node.parentNode = bestNode;
						node.G = bestNode.G + 100;
						node.H = H(node, targetNode);
					}
					else if(Helper.arrays.contains(openList, node) && node.G < bestNode.G) {
						// if it is in the open list and its G-value is lower, update parent and G-value
						node.parentNode = bestNode;
						node.G = bestNode.G + 100;
						node.H = H(node, targetNode);
					}
				}
			});				
		}

		// go backward from the last best node using the parent-attribute to find the path
		while(bestNode.parentNode != null) {
			path.push(bestNode);
			bestNode = bestNode._parentNode;
		}

		return path;

	}

});
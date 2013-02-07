Crafty.c("Sequence", {
    _idx: 0,
    _playing: false,
    _path: null,
    _segmentDur: 0,
    
    _nextSegment: function () {
        this.tween(this._path[this._idx], this._segmentDur);
    },
    
    _segmentEnd: function (prop) {
        if(this._idx < this._path.length - 1) {
            this._idx++;
            this._nextSegment();
        } else {
            this.trigger("SegmentEnd");
        }
    },
    
    addSegment: function (props) {
        // TODO
    },
    
    removeSegment: function (props) {
        // TODO
    },
    
    play: function () {
        // TODO
    },
    
    stop: function () {
        // TODO
    },
    
    reset: function () {
        // TODO
    },
    
    sequence: function (path, duration) {
        this._idx = 0;
        this._path = path;
        this._segmentDur = Math.floor(duration / this._path.length);
        this._nextSegment();
    },
    
    init: function () {
        this.requires("Tween");
        this.bind("TweenEnd", this._segmentEnd);
    }
});
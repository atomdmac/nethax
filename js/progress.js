Crafty.c("ProgressBar", {
    
    _background: null,
    _forground: null,
    _title: null,
    
    _min: 0,
    _max: 100,
    _value: 0,
    
    update: function (value) {
       var size = 0,
            max = this._max  - this._min,
            barSize = (value * this._background.w) / max;
        this._foreground.w = barSize;
        this._value = value;
        return this;
    },
    
    setScale: function (min, max) {
        this._min = min !== undefined ? min : this._min;
        this._max = max !== undefined ? max : this._max;
        return this;
    },
    
    setTitle: function (value) {
        this._title.text(value);
        return this;
    },
    
    setColor: function (value) {
        this._foreground.color(value);
        return this;
    },
    
    _onChange: function (e) {
        this._background.w = e.w;
        this._background.h = e.h;
    },
    
    init: function () {
        this.requires("2D, DOM");
        
        this._background = Crafty.e("2D, DOM, Color")
            .color("#000000");
        this._foreground = Crafty.e("2D, DOM, Color")
            .color("#ff0000");
        this._title = Crafty.e("DOM, Text")
            .text("Progress")
            .textColor("#fff");
            
        this.attach(
            this._background,
            this._foreground,
            this._title
        )
        
        this.bind("Change", this._onChange);
    }
});
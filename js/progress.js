Crafty.c("ProgressBar", {
    
    _background: null,
    _foreground: null,
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
        this._title.x = (this._background._w - this._title._w) / 2;
        this._title.y = (this._background._h - this._title._h) / 2;
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
        this.requires("2D, Canvas");
        
        // Replace draw() with our own implementation.
        this._draw = this.draw;
        this.draw  = function (ctx, x, y, w, h) {
            ctx = ctx || Crafty.canvas.context;
            this._draw(ctx);
        };
        
        this._background = Crafty.e("2D, Canvas, Color")
            .color("#666");
        
        this._foreground = Crafty.e("2D, Canvas, Color")
            .color("#ff0000");
        
        this._title = Crafty.e("2D, Canvas, Text")
            .textColor("#ffffff", 1);
        this._title.text("Progress");
        
        this._background.z = 0;
        this._foreground.z = 1;
        this._title.z      = 2;
        
        this.attach(
            this._background,
            this._foreground,
            this._title
        );
        
        this.bind("Change", this._onChange);
        
        // Set default dimensions.
        this.attr({
            w: 100,
            h: 20
        });
    }
});
Math.randomInt = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
};

Array.prototype.random = function () {
   return this[Math.randomInt(0, this.length-1)];
}
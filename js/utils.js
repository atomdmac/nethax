Math.randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min +1)) + min
};

Array.prototype.random = function () {
   return this[Math.randomInt(0, this.length-1)];
}
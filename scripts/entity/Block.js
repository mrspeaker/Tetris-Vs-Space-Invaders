var Block;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
Block = (function() {
  __extends(Block, Entity);
  Block.prototype.name = "block";
  function Block(shape, xOff, yOff, w, h) {
    this.shape = shape;
    this.xOff = xOff;
    this.yOff = yOff;
    this.w = w;
    this.h = h;
    this.active = true;
    this.setSquare();
  }
  Block.prototype.tick = function() {
    this.x = this.xOff * this.w + this.shape.x;
    this.y = this.yOff * this.h + this.shape.y;
    return this.setSquare();
  };
  Block.prototype.setSquare = function() {
    this.xTile = ~~(this.x / this.w);
    return this.yTile = ~~(this.y / this.h);
  };
  Block.prototype.render = function(ctx) {
    ctx.fillStyle = this.active ? this.shape.colour : "#333";
    ctx.fillRect(this.x, this.y, this.w - 1, this.h - 1);
    if (this.active) {
      return Art.baddie.draw(ctx, this.x + 5, this.y + 5, 6);
    }
  };
  Block.prototype.shot = function(bullet) {
    if (!this.active) {
      return false;
    }
    this.remove();
    this.shape.checkDead();
    return true;
  };
  return Block;
})();
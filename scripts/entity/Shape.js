var Shape;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
Shape = (function() {
  __extends(Shape, Entity);
  Shape.prototype.name = "shape";
  Shape.prototype.blockChance = 0.9;
  function Shape(x, y, xBlocks, yBlocks, colour) {
    this.x = x;
    this.y = y;
    this.xBlocks = xBlocks;
    this.yBlocks = yBlocks;
    this.colour = colour;
    this.blockWidth = 30;
    this.blockHeight = 30;
    this.w = this.xBlocks * this.blockWidth;
    this.h = this.yBlocks * this.blockHeight;
    this.time = 0;
    this.moving = true;
    this.blocks = [];
  }
  Shape.prototype.init = function(level) {
    var block, filled, i, j, total, _ref, _results;
    this.level = level;
    total = 0;
    filled = 0;
    _results = [];
    for (j = 0, _ref = this.yBlocks; (0 <= _ref ? j <= _ref : j >= _ref); (0 <= _ref ? j += 1 : j -= 1)) {
      _results.push((function() {
        var _ref, _results;
        _results = [];
        for (i = 0, _ref = this.xBlocks; (0 <= _ref ? i <= _ref : i >= _ref); (0 <= _ref ? i += 1 : i -= 1)) {
          total++;
          _results.push(Math.random() <= this.blockChance ? (filled++, block = new Block(this, i, j, this.blockWidth, this.blockHeight), this.blocks.push(block), this.level.add(block)) : void 0);
        }
        return _results;
      }).call(this));
    }
    return _results;
  };
  Shape.prototype.tick = function(input) {
    this.time++;
    return this.move();
  };
  Shape.prototype.render = function(ctx) {};
  Shape.prototype.move = function() {
    if (!this.moving) {
      return;
    }
    if (this.time++ < 150) {
      return;
    } else {
      this.time = 0;
    }
    if (this.level.dir !== direction.NONE && this.tryMoveX()) {
      if (this.level.dir === direction.LEFT) {
        this.x += this.level.blockWidth;
      }
      if (this.level.dir === direction.RIGHT) {
        this.x -= this.level.blockWidth;
      }
    }
    if (!this.tryMove()) {
      return;
    }
    return this.y += this.blockHeight;
  };
  Shape.prototype.tryMove = function() {
    var block, blocked, hitBottom, nextX, nextY, _i, _len, _ref;
    _ref = this.blocks;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      block = _ref[_i];
      if (block.removed) {
        continue;
      }
      nextY = block.yTile + 1;
      nextX = block.xTile;
      if (this.level.dir === direction.LEFT && nextX < this.level.fieldWidth) {
        nextX++;
      }
      if (this.level.dir === direction.RIGHT && nextX > 0) {
        nextX--;
      }
      hitBottom = block.yTile === this.level.fieldHeight - 1;
      blocked = this.level.field[nextY][nextX] > 0;
      if (hitBottom || blocked) {
        this.moving = false;
        this.level.fuseShape(this);
        return false;
      }
    }
    return true;
  };
  Shape.prototype.tryMoveX = function() {
    var block, nextX, _i, _len, _ref;
    _ref = this.blocks;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      block = _ref[_i];
      if (block.removed) {
        continue;
      }
      nextX = block.xTile;
      nextX += this.level.dir === direction.LEFT ? 1 : -1;
      if (nextX < 0 || nextX > this.level.fieldWidth) {
        return false;
      }
      if (this.level.field[block.yTile][nextX] > 0) {
        return false;
      }
    }
    return true;
  };
  Shape.prototype.checkDead = function() {
    var block, _i, _len, _ref;
    _ref = this.blocks;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      block = _ref[_i];
      if (!block.removed) {
        return false;
      }
    }
    return this.level.fuseShape(this);
  };
  Shape.prototype.fire = function() {
    return this.level.add(new Bullet(~~(this.x + this.w / 2) - 4, this.y + this.h, 0, 1.5));
  };
  return Shape;
})();
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
    var block, filled, i, j, total, _ref, _ref2;
    this.level = level;
    total = 0;
    filled = 0;
    for (j = 0, _ref = this.yBlocks; (0 <= _ref ? j <= _ref : j >= _ref); (0 <= _ref ? j += 1 : j -= 1)) {
      for (i = 0, _ref2 = this.xBlocks; (0 <= _ref2 ? i <= _ref2 : i >= _ref2); (0 <= _ref2 ? i += 1 : i -= 1)) {
        total++;
        if (Math.random() <= this.blockChance) {
          filled++;
          block = new Block(this, i, j, this.blockWidth, this.blockHeight);
          this.blocks.push(block);
          this.level.add(block);
        }
      }
    }
    if (filled === 0) {
      return "lol";
    }
  };
  Shape.prototype.tick = function() {
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
    }
    this.time = 0;
    if (!this.tryMove()) {
      return;
    }
    return this.y += this.blockHeight;
  };
  Shape.prototype.tryMove = function() {
    var block, blocked, hitBottom, nextY, _i, _len, _ref;
    _ref = this.blocks;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      block = _ref[_i];
      nextY = block.yLoc + 1;
      hitBottom = block.yLoc === this.level.fieldHeight - 1;
      blocked = this.level.field[nextY][block.xLoc] > 0;
      if (hitBottom || blocked) {
        this.moving = false;
        this.fuseShape();
        this.level.spawn();
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
  };
  Shape.prototype.fuseShape = function() {
    var block, _i, _len, _ref, _results;
    _ref = this.blocks;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      block = _ref[_i];
      _results.push(!block.removed ? (block.active = false, this.level.field[block.yLoc][block.xLoc] = 1) : void 0);
    }
    return _results;
    /*@level.field = _.map @level.field, (row) ->
        if _.all row then null else row
    @level.field = _.compact @level.field
    */
    /*
    for row, i in @level.field
        if _.all row
            console.log "GOT A LINE!!!!", i
            for block in @blocks
                remove() if block.yOff == i
    */
  };
  Shape.prototype.fire = function() {
    return this.level.add(new Bullet(~~(this.x + this.w / 2) - 4, this.y + this.h, 0, 1.5));
  };
  return Shape;
})();
var Level;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Level = (function() {
  function Level(screen, width, height, spawnX, spawnY) {
    this.screen = screen;
    this.width = width;
    this.height = height;
    this.entities = [];
    this.newEntities = [];
    this.blockWidth = 30;
    this.blockHeight = 30;
    this.fieldWidth = ~~(this.width / this.blockWidth) - 1;
    this.fieldHeight = ~~(this.height / this.blockHeight) - 1;
    this.field = this.initField(this.field, this.fieldWidth, this.fieldHeight);
    this.spawn();
    _.delay((__bind(function() {
      return this.spawn();
    }, this)), 5000);
    this.player = this.add(new Player(spawnX, spawnY, 20, 20));
  }
  Level.prototype.initField = function(field, x, y) {
    var _i;
    field = [];
    for (_i = 0; (0 <= y ? _i <= y : _i >= y); (0 <= y ? _i += 1 : _i -= 1)) {
      field.push([]);
    }
    _.map(field, function(row) {
      var _i, _results;
      _results = [];
      for (_i = 0; (0 <= x ? _i <= x : _i >= x); (0 <= x ? _i += 1 : _i -= 1)) {
        _results.push(row.push(0));
      }
      return _results;
    });
    return field;
  };
  Level.prototype.tick = function(input) {
    var aliveEntities, e, _i, _j, _len, _len2, _ref, _ref2;
    aliveEntities = [];
    _ref = this.entities;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      e = _ref[_i];
      if (!e.removed) {
        e.tick(input);
        aliveEntities.push(e);
      }
    }
    _ref2 = this.newEntities;
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      e = _ref2[_j];
      aliveEntities.push(e);
    }
    this.newEntities = [];
    return this.entities = aliveEntities;
  };
  Level.prototype.spawn = function() {
    var color, height, width, x;
    color = "rgb(" + (this.rnd()) + "," + (this.rnd()) + "," + (this.rnd()) + ")";
    width = ~~(Math.random() * 2) + 1;
    height = ~~(Math.random() * 1) + 1;
    x = ~~(Math.random() * this.fieldWidth - width + 1) * 30;
    return this.add(new Shape(x, 0, width, height, color));
  };
  Level.prototype.rnd = function() {
    return ~~(Math.random() * 255);
  };
  Level.prototype.add = function(entity) {
    entity.init(this);
    this.newEntities.push(entity);
    return entity;
  };
  Level.prototype.render = function(ctx, camera) {
    var blocks, e, row, x, y, _i, _len, _len2, _len3, _ref, _ref2;
    _ref = this.field;
    for (y = 0, _len = _ref.length; y < _len; y++) {
      row = _ref[y];
      for (x = 0, _len2 = row.length; x < _len2; x++) {
        blocks = row[x];
        ctx.fillStyle = "#222";
        ctx.fillRect(x * this.blockWidth, y * this.blockHeight, this.blockWidth - 1, this.blockHeight - 1);
      }
    }
    _ref2 = this.entities;
    for (_i = 0, _len3 = _ref2.length; _i < _len3; _i++) {
      e = _ref2[_i];
      e.render(ctx, camera);
    }
    return this.player.render(ctx, camera);
  };
  Level.prototype.gameOver = function() {
    return main.reset();
  };
  Level.prototype.getColliding = function(xc, yc, w, h, entities) {
    var e, hits, r, x0, x1, y0, y1, _i, _len, _ref;
    hits = [];
    r = 40;
    x0 = (xc - r) / 10;
    y0 = (yc - r) / 10;
    x1 = (xc + w + r) / 10;
    y1 = (yc + h + r) / 10;
    _ref = entities || this.entities;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      e = _ref[_i];
      if (e.x > xc + w || e.y + e.h > yc + h || e.x + e.w < xc || e.y + e.h < yc) {
        continue;
      }
      hits.push(e);
    }
    return hits;
  };
  return Level;
})();
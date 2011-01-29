var Level, Spawner;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Spawner = {
  lastX: 0,
  lastW: 0,
  setDimensions: function(fieldWidth) {
    this.fieldWidth = fieldWidth;
  },
  spawn: function(level) {
    var color, height, ne, ns, oe, os, width, x;
    color = Utils.colour();
    width = ~~(Math.random() * 4) + 1;
    height = ~~(Math.random() * 1) + 1;
    os = oe = ns = ne = 0;
    while (!(ne < os || ns > oe)) {
      x = ~~(Math.random() * this.fieldWidth - width + 1);
      os = this.lastX;
      oe = this.lastX + this.lastW;
      ns = x;
      ne = x + width;
    }
    this.lastX = x;
    this.lastW = width;
    return level.add(new Shape(x * 30, 0, width, height, color));
  }
};
Level = (function() {
  function Level(screen, width, height, spawnX, spawnY) {
    this.screen = screen;
    this.width = width;
    this.height = height;
    this.entities = [];
    this.blockWidth = 30;
    this.blockHeight = 30;
    this.fieldWidth = ~~(this.width / this.blockWidth) - 1;
    this.fieldHeight = ~~(this.height / this.blockHeight) - 1;
    this.field = this.initField(this.field, this.fieldWidth, this.fieldHeight);
    Spawner.setDimensions(this.fieldWidth);
    Spawner.spawn(this);
    _.delay((__bind(function() {
      return Spawner.spawn(this);
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
    var aliveEntities;
    aliveEntities = [];
    for(var i = 0; i < this.entities.length; i++){
            var ent = this.entities[i];
            if(!ent.removed){
                ent.tick(input);
                aliveEntities.push(ent);
            }
        };
    return this.entities = aliveEntities;
  };
  Level.prototype.add = function(entity) {
    entity.init(this);
    this.entities.push(entity);
    return entity;
  };
  Level.prototype.fuseShape = function(shape) {
    var block, newRow, newRows, numNewRows, row, _i, _j, _k, _len, _len2, _ref, _ref2, _ref3;
    _ref = shape.blocks;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      block = _ref[_i];
      if (!block.removed) {
        block.active = false;
        this.field[block.yLoc][block.xLoc] = 1;
      }
    }
    Spawner.spawn(this);
    this.field = _.map(this.field, function(row) {
      if (_.all(row)) {
        return null;
      } else {
        return row;
      }
    });
    this.field = _.compact(this.field);
    numNewRows = this.fieldHeight - (this.field.length - 1);
    console.log(numNewRows);
    if (numNewRows > 0) {
      newRows = [];
      while (numNewRows--) {
        console.log("new row");
        newRow = [];
        for (_j = 0, _ref2 = this.fieldWidth; (0 <= _ref2 ? _j <= _ref2 : _j >= _ref2); (0 <= _ref2 ? _j += 1 : _j -= 1)) {
          newRow.push(0);
        }
        newRows.push(newRow);
      }
      console.log(newRows);
      _ref3 = this.field;
      for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
        row = _ref3[_k];
        newRows.push(row);
      }
      return this.field = newRows;
    }
    /*
    for row, i in @level.field
        if _.all row
            console.log "GOT A LINE!!!!", i
            for block in @blocks
                remove() if block.yOff == i
    */
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
  Level.prototype.getBoxPos = function(x, y) {
    return [~~(x / this.blockWidth), ~~(y / this.blockHeight)];
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
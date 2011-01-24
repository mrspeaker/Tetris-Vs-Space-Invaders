var Player;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
Player = (function() {
  var dir;
  __extends(Player, Entity);
  Player.prototype.name = "player";
  Player.prototype.fireFade = 0;
  Player.prototype.speed = 1.5;
  dir = direction.NONE;
  Player.prototype.time = 0;
  function Player(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  Player.prototype.tick = function(input) {
    this.time++;
    this.dir = direction.NONE;
    this.setDirection(input);
    if (this.dir !== direction.NONE) {
      this.move();
    }
    if (input.pressed(input.FIRE)) {
      this.fire();
    }
    if (this.fireFade > 0) {
      this.fireFade--;
    }
    return Player.__super__.tick.apply(this, arguments);
  };
  Player.prototype.render = function(ctx) {
    return [Art.player, Art.player_red][this.fireFade > 0 ? 1: 0].draw(ctx, ~~this.x + 3, this.y + 6, 7);
  };
  Player.prototype.move = function() {
    if (this.time < 10) {
      return;
    }
    this.time = 0;
    this.x += this.dir === direction.RIGHT ? 30 : -30;
    if (this.x > this.level.width - this.w) {
      this.x = this.level.width - this.w;
    }
    if (this.x < 3) {
      return this.x = 3;
    }
  };
  Player.prototype.fire = function() {
    this.fireFade = 10;
    return this.level.add(new Bullet(~~(this.x + this.w / 2) - 2, this.y - 5, 0, -5));
  };
  Player.prototype.shot = function(bullet) {
    return this.level.gameOver();
  };
  Player.prototype.setDirection = function(input) {
    if (input.buttons[input.LEFT]) {
      this.dir = direction.LEFT;
    }
    if (input.buttons[input.RIGHT]) {
      this.dir = direction.RIGHT;
    }
    if (input.buttons[input.UP]) {
      return this.dir = direction.NONE;
    }
  };
  return Player;
})();
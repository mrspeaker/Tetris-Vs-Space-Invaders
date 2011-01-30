var Events, Utils;
Utils = {
  colour: function() {
    return "rgb(" + (this.rnd()) + "," + (this.rnd()) + "," + (this.rnd()) + ")";
  },
  rnd: function() {
    return ~~(Math.random() * 255);
  },
  remove: function(arr, from, to) {
    arr.splice(from, (to || from || 1) + (from < 0 ? arr.length : 0));
    return arr;
  },
  removeObj: function(obj, arr) {
    var el, i, _len;
    for (i = 0, _len = arr.length; i < _len; i++) {
      el = arr[i];
      if (el === obj) {
        Utils.remove(arr, i, i);
      }
    }
    return arr;
  }
};
Events = {
  events: {},
  bind: function(type, func) {
    var _base;
    (_base = this.events)[type] || (_base[type] = []);
    return this.events[type].push(func);
  },
  trigger: function(event, data) {
    var func, _i, _len, _ref;
    _ref = this.events[event] || [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      func = _ref[_i];
      func(data);
    }
    return null;
  }
};
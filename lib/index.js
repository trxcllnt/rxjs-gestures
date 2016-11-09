'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Gestures = require('./Gestures');

Object.keys(_Gestures).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Gestures[key];
    }
  });
});
//# sourceMappingURL=index.js.map
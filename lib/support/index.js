'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Point = require('./Point');

Object.keys(_Point).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Point[key];
    }
  });
});

var _epsilon = require('./epsilon');

Object.keys(_epsilon).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _epsilon[key];
    }
  });
});

var _selectId = require('./selectId');

Object.keys(_selectId).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _selectId[key];
    }
  });
});
//# sourceMappingURL=index.js.map
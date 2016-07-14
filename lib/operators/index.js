'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TapOperator = require('./TapOperator');

Object.keys(_TapOperator).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _TapOperator[key];
    }
  });
});

var _PanOperator = require('./PanOperator');

Object.keys(_PanOperator).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _PanOperator[key];
    }
  });
});

var _DeltaOperator = require('./DeltaOperator');

Object.keys(_DeltaOperator).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _DeltaOperator[key];
    }
  });
});

var _PressOperator = require('./PressOperator');

Object.keys(_PressOperator).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _PressOperator[key];
    }
  });
});

var _DecelerateOperator = require('./DecelerateOperator');

Object.keys(_DecelerateOperator).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _DecelerateOperator[key];
    }
  });
});

var _PreventDefaultOperator = require('./PreventDefaultOperator');

Object.keys(_PreventDefaultOperator).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _PreventDefaultOperator[key];
    }
  });
});

var _StopPropagationOperator = require('./StopPropagationOperator');

Object.keys(_StopPropagationOperator).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _StopPropagationOperator[key];
    }
  });
});
//# sourceMappingURL=index.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = exports.Gestures = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.install = install;

var _symbolObservable = require('symbol-observable');

var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

var _rxjs = require('rxjs');

var _support = require('./support');

var _operators = require('./operators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var mouseEvents = {
    start: 'mousedown', end: 'mouseup',
    move: 'mousemove', cancel: 'mouseleave',
    wheel: 'wheel'
};

var touchEvents = {
    start: 'touchstart', end: 'touchend',
    move: 'touchmove', cancel: 'touchcancel'
};

function identity(x) {
    return x;
}
function getIdentifier(_ref) {
    var identifier = _ref.identifier;
    return identifier || 'mouse';
}
function getTopLevelElement() {
    return typeof window !== 'undefined' ? window : typeof document !== 'undefined' ? document : global;
}

function install() {
    var _class, _temp;

    var topLevelElement = arguments.length <= 0 || arguments[0] === undefined ? getTopLevelElement() : arguments[0];

    return _temp = _class = function (_Gestures) {
        _inherits(InstalledGestures, _Gestures);

        function InstalledGestures() {
            _classCallCheck(this, InstalledGestures);

            return _possibleConstructorReturn(this, Object.getPrototypeOf(InstalledGestures).apply(this, arguments));
        }

        return InstalledGestures;
    }(Gestures), _class.topLevelElement = topLevelElement, _temp;
}

var Gestures = exports.Gestures = function (_Observable) {
    _inherits(Gestures, _Observable);

    function Gestures(target) {
        _classCallCheck(this, Gestures);

        for (var _len = arguments.length, events = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            events[_key - 1] = arguments[_key];
        }

        if (!target || typeof target === 'function' || (typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object') {
            var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Gestures).call(this, target));
        } else if (typeof target[_symbolObservable2.default] === 'function') {
            var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Gestures).call(this));

            _this2.source = target[_symbolObservable2.default]();
        } else if (events.length === 1) {
            var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Gestures).call(this));

            _this2.source = _rxjs.Observable.fromEvent(target, event[0]);
        } else {
            var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Gestures).call(this));

            _this2.source = _rxjs.Observable.merge.apply(_rxjs.Observable, _toConsumableArray(events.map(function (event) {
                return _rxjs.Observable.fromEvent(target, event);
            })));
        }
        return _possibleConstructorReturn(_this2);
    }

    _createClass(Gestures, [{
        key: 'lift',
        value: function lift(operator) {
            var observable = new this.constructor(this);
            observable.operator = operator;
            return observable;
        }
    }, {
        key: 'preventDefault',
        value: function preventDefault() {
            return this.lift(new _operators.PreventDefaultOperator());
        }
    }, {
        key: 'stopPropagation',
        value: function stopPropagation() {
            var immediate = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            return this.lift(new _operators.StopPropagationOperator(immediate));
        }
    }, {
        key: 'decelerate',
        value: function decelerate() {
            var coefficientOfFriction = arguments.length <= 0 || arguments[0] === undefined ? 0.25 : arguments[0];
            var normalForce = arguments.length <= 1 || arguments[1] === undefined ? 9.8 : arguments[1];
            var scheduler = arguments.length <= 2 || arguments[2] === undefined ? _rxjs.Scheduler.animationFrame : arguments[2];

            return this.lift(new _operators.DecelerateOperator(coefficientOfFriction, normalForce, scheduler));
        }
    }, {
        key: 'inside',
        value: function inside(_ref2) {
            var radiusX = _ref2.x;
            var radiusY = _ref2.y;

            return this.filter(function (_ref3) {
                var deltaXTotal = _ref3.deltaXTotal;
                var deltaYTotal = _ref3.deltaYTotal;
                return !(0, _support.epsilon)(radiusX, radiusY, deltaXTotal, deltaYTotal);
            });
        }
    }, {
        key: 'outside',
        value: function outside(_ref4) {
            var radiusX = _ref4.x;
            var radiusY = _ref4.y;

            return this.filter(function (_ref5) {
                var deltaXTotal = _ref5.deltaXTotal;
                var deltaYTotal = _ref5.deltaYTotal;
                return (0, _support.epsilon)(radiusX, radiusY, deltaXTotal, deltaYTotal);
            });
        }
    }, {
        key: 'normalize',
        value: function normalize(origin) {
            var Gestures_ = arguments.length <= 1 || arguments[1] === undefined ? Gestures : arguments[1];
            var scheduler = arguments.length <= 2 || arguments[2] === undefined ? _rxjs.Scheduler.animationFrame : arguments[2];

            return this.lift(new _operators.NormalizeOperator(origin, Gestures_, scheduler));
        }
    }], [{
        key: 'from',
        value: function from() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            return new (Function.prototype.bind.apply(Gestures, [null].concat(args)))();
        }
    }, {
        key: 'startsById',
        value: function startsById() {
            var target = arguments.length <= 0 || arguments[0] === undefined ? this.topLevelElement : arguments[0];

            return this.start(target).groupBy(getIdentifier);
        }
    }, {
        key: 'start',
        value: function start() {
            var target = arguments.length <= 0 || arguments[0] === undefined ? this.topLevelElement : arguments[0];

            return new this(target, mouseEvents.start, touchEvents.start).lift(new _operators.MultitouchOperator());
        }
    }, {
        key: 'move',
        value: function move() {
            var target = arguments.length <= 0 || arguments[0] === undefined ? this.topLevelElement : arguments[0];

            return new this(target, mouseEvents.move, touchEvents.move).lift(new _operators.MultitouchOperator());
        }
    }, {
        key: 'end',
        value: function end() {
            var target = arguments.length <= 0 || arguments[0] === undefined ? this.topLevelElement : arguments[0];

            return new this(target, mouseEvents.end, touchEvents.end).lift(new _operators.MultitouchOperator());
        }
    }, {
        key: 'cancel',
        value: function cancel() {
            var target = arguments.length <= 0 || arguments[0] === undefined ? this.topLevelElement : arguments[0];

            return new this(target, mouseEvents.cancel, touchEvents.cancel).lift(new _operators.MultitouchOperator());
        }
    }, {
        key: 'tap',
        value: function tap() {
            var target = arguments.length <= 0 || arguments[0] === undefined ? this.topLevelElement : arguments[0];
            var timeout = arguments.length <= 1 || arguments[1] === undefined ? 250 : arguments[1];
            var radius = arguments.length <= 2 || arguments[2] === undefined ? { x: 10, y: 10 } : arguments[2];

            var _this3 = this;

            var ends /*OrInputs*/ = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];
            var cancels = arguments[4];

            if (arguments.length <= 4) {
                return this.startsById(target).lift(new _operators.TapOperator(timeout, radius, this));
            }
            return new this(target).preventDefault().normalize(null, this).mergeMap(function (start) {
                return ends.preventDefault().normalize(start, _this3).inside(radius);
            }).timeoutWith(timeout, _rxjs.Observable.empty()).takeUntil(cancels).take(1);
        }
    }, {
        key: 'press',
        value: function press() {
            var target = arguments.length <= 0 || arguments[0] === undefined ? this.topLevelElement : arguments[0];
            var delay = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
            var radius = arguments.length <= 2 || arguments[2] === undefined ? { x: 10, y: 10 } : arguments[2];
            var moves /*OrInputs*/ = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];

            var _this4 = this;

            var ends = arguments[4];
            var cancels = arguments[5];

            if (arguments.length <= 4) {
                return this.startsById(target).lift(new _operators.PressOperator(delay, radius, this));
            } else if (delay <= 0) {
                return new this(target).normalize(null, this).take(1);
            }
            return new this(target).preventDefault().normalize(null, this).mergeMap(function (start) {
                return _rxjs.Observable.timer(delay).withLatestFrom(moves.normalize(start, _this4).startWith(start), function (i, move) {
                    return move;
                }).takeUntil(ends.merge(cancels).merge(moves.normalize(start, _this4).outside(radius)));
            }).take(1);
        }
    }, {
        key: 'pan',
        value: function pan() {
            var target = arguments.length <= 0 || arguments[0] === undefined ? this.topLevelElement : arguments[0];
            var delay = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
            var radius = arguments.length <= 2 || arguments[2] === undefined ? { x: 10, y: 10 } : arguments[2];
            var moves /*OrInputs*/ = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];

            var _this5 = this;

            var ends = arguments[4];
            var cancels = arguments[5];

            if (arguments.length <= 4) {
                return this.startsById(target).lift(new _operators.PanOperator(delay, radius, this));
            }
            return new this(target).preventDefault().mergeMap(function (start) {
                return moves.normalize(start, _this5).startWith(start);
            }).takeUntil(ends.merge(cancels));
        }
    }]);

    return Gestures;
}(_rxjs.Observable);

Gestures.topLevelElement = getTopLevelElement();
exports.default = Gestures;
//# sourceMappingURL=Gestures.js.map
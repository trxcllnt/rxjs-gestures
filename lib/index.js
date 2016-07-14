'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = exports.Gestures = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.install = install;

require('rxjs/add/operator/let');

require('rxjs/add/operator/take');

require('rxjs/add/operator/mapTo');

require('rxjs/add/operator/filter');

require('rxjs/add/observable/empty');

require('rxjs/add/observable/never');

require('rxjs/add/observable/timer');

require('rxjs/add/operator/mergeMap');

require('rxjs/add/operator/multicast');

require('rxjs/add/operator/startWith');

require('rxjs/add/operator/takeUntil');

require('rxjs/add/operator/takeWhile');

require('rxjs/add/operator/timeoutWith');

require('rxjs/add/observable/fromEvent');

require('rxjs/add/operator/timeInterval');

require('rxjs/add/operator/withLatestFrom');

var _Subject = require('rxjs/Subject');

var _Observable2 = require('rxjs/Observable');

var _symbolObservable = require('symbol-observable');

var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

var _async = require('rxjs/scheduler/async');

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

            _this2.source = _Observable2.Observable.fromEvent(target, event[0]);
        } else {
            var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Gestures).call(this));

            _this2.source = _Observable2.Observable.merge.apply(_Observable2.Observable, _toConsumableArray(events.map(function (event) {
                return _Observable2.Observable.fromEvent(target, event);
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
        key: 'delta',
        value: function delta(point) {
            var scheduler = arguments.length <= 1 || arguments[1] === undefined ? _async.async : arguments[1];

            return this.lift(new _operators.DeltaOperator(point, scheduler));
        }
    }, {
        key: 'decelerate',
        value: function decelerate() {
            var coefficientOfFriction = arguments.length <= 0 || arguments[0] === undefined ? 0.25 : arguments[0];
            var normalForce = arguments.length <= 1 || arguments[1] === undefined ? 9.8 : arguments[1];
            var scheduler = arguments.length <= 2 || arguments[2] === undefined ? _async.async : arguments[2];

            return this.lift(new _operators.DecelerateOperator(coefficientOfFriction, normalForce, scheduler));
        }
    }, {
        key: 'inside',
        value: function inside(_ref, point) {
            var radiusX = _ref.x;
            var radiusY = _ref.y;

            return this.delta(point).filter(function (_ref2) {
                var totalX = _ref2.totalX;
                var totalY = _ref2.totalY;
                return !(0, _support.epsilon)(radiusX, radiusY, totalX, totalY);
            });
        }
    }, {
        key: 'outside',
        value: function outside(_ref3, point) {
            var radiusX = _ref3.x;
            var radiusY = _ref3.y;

            return this.delta(point).filter(function (_ref4) {
                var totalX = _ref4.totalX;
                var totalY = _ref4.totalY;
                return (0, _support.epsilon)(radiusX, radiusY, totalX, totalY);
            });
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
            var _this3 = this;

            var target = arguments.length <= 0 || arguments[0] === undefined ? this.topLevelElement : arguments[0];
            var topLevelElement = this.topLevelElement;

            return this.start(target).multicast(function () {
                return new _Subject.Subject();
            }, function (starts) {
                return _Observable2.Observable.merge(starts.take(1), starts.takeWhile(function (_ref5) {
                    var identifier = _ref5.identifier;
                    return identifier !== 'mouse';
                }));
            }).let(Gestures.from).groupBy(getIdentifier, null, function (starts) {
                return _this3.race(_this3.end(topLevelElement), _this3.cancel(topLevelElement)).filter((0, _support.selectId)(starts.key));
            });
        }
    }, {
        key: 'start',
        value: function start() {
            var target = arguments.length <= 0 || arguments[0] === undefined ? this.topLevelElement : arguments[0];

            return new this(target, mouseEvents.start, touchEvents.start).mergeMap(_support.normalize);
        }
    }, {
        key: 'move',
        value: function move() {
            var target = arguments.length <= 0 || arguments[0] === undefined ? this.topLevelElement : arguments[0];

            return new this(target, mouseEvents.move, touchEvents.move).mergeMap(_support.normalize);
        }
    }, {
        key: 'end',
        value: function end() {
            var target = arguments.length <= 0 || arguments[0] === undefined ? this.topLevelElement : arguments[0];

            return new this(target, mouseEvents.end, touchEvents.end).mergeMap(_support.normalize);
        }
    }, {
        key: 'cancel',
        value: function cancel() {
            var target = arguments.length <= 0 || arguments[0] === undefined ? this.topLevelElement : arguments[0];

            return new this(target, mouseEvents.cancel, touchEvents.cancel).mergeMap(_support.normalize);
        }
    }, {
        key: 'tap',
        value: function tap() {
            var target = arguments.length <= 0 || arguments[0] === undefined ? this.topLevelElement : arguments[0];
            var timeout = arguments.length <= 1 || arguments[1] === undefined ? 250 : arguments[1];
            var radius = arguments.length <= 2 || arguments[2] === undefined ? { x: 10, y: 10 } : arguments[2];
            var ends = arguments[3];
            var cancels = arguments[4];

            if (arguments.length <= 3) {
                return this.startsById(target).lift(new _operators.TapOperator(timeout, radius, this));
            }
            return new this(target).preventDefault().mergeMap(function (start) {
                return ends.inside(radius, start).map(function (end) {
                    return _extends({}, end, { type: start.type });
                }).timeoutWith(timeout, _Observable2.Observable.empty());
            }).takeUntil(cancels).take(1);
        }
    }, {
        key: 'pan',
        value: function pan() {
            var target = arguments.length <= 0 || arguments[0] === undefined ? this.topLevelElement : arguments[0];
            var delay = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
            var radius = arguments.length <= 2 || arguments[2] === undefined ? { x: 10, y: 10 } : arguments[2];
            var moves = arguments[3];
            var ends = arguments[4];
            var cancels = arguments[5];

            if (arguments.length <= 3) {
                return this.startsById(target).lift(new _operators.PanOperator(delay, radius, this));
            }
            return new this(target).preventDefault().mergeMap(function (start) {
                return moves.delta(start).startWith(start);
            }).takeUntil(ends.merge(cancels));
        }
    }, {
        key: 'press',
        value: function press() {
            var target = arguments.length <= 0 || arguments[0] === undefined ? this.topLevelElement : arguments[0];
            var delay = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
            var radius = arguments.length <= 2 || arguments[2] === undefined ? { x: 10, y: 10 } : arguments[2];
            var moves = arguments[3];
            var ends = arguments[4];
            var cancels = arguments[5];

            if (arguments.length <= 3) {
                return this.startsById(target).lift(new _operators.PressOperator(delay, radius, this));
            }
            return (delay <= 0 ? target : new this(target).preventDefault().mergeMap(function (start) {
                return _Observable2.Observable.timer(delay).withLatestFrom(moves.startWith(start), function (i, move) {
                    return _extends({}, move, { type: start.type
                    });
                }).takeUntil(ends.merge(cancels).merge(moves.outside(radius, start)));
            })).take(1);
        }
    }]);

    return Gestures;
}(_Observable2.Observable);

Gestures.topLevelElement = getTopLevelElement();


function identity(x) {
    return x;
}
function getIdentifier(_ref6) {
    var identifier = _ref6.identifier;
    return identifier;
}
function getTopLevelElement() {
    return typeof window !== 'undefined' ? window : typeof document !== 'undefined' ? document : global;
}

exports.default = Gestures;
//# sourceMappingURL=index.js.map
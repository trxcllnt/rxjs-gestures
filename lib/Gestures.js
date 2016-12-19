'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Gestures = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.install = install;

var _symbolObservable = require('symbol-observable');

var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

var _support = require('./support');

var _Observable2 = require('rxjs/Observable');

var _ReplaySubject = require('rxjs/ReplaySubject');

var _operators = require('./operators');

var _animationFrame = require('rxjs/scheduler/animationFrame');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var mouseEvents = {
    start: 'mousedown', end: 'mouseup',
    move: 'mousemove', cancel: 'mouseleave',
    wheel: 'wheel', mousewheel: 'mousewheel'
};

var touchEvents = {
    start: 'touchstart', end: 'touchend',
    move: 'touchmove', cancel: 'touchcancel'
};

function identity(x) {
    return x;
}
function getIdentifier(_ref) {
    var _ref$identifier = _ref.identifier,
        identifier = _ref$identifier === undefined ? 'mouse' : _ref$identifier;
    return identifier;
}
function getReplaySubject1() {
    return new _ReplaySubject.ReplaySubject(1);
}
function getTopLevelElement() {
    return typeof window !== 'undefined' ? window : typeof document !== 'undefined' ? document : global;
}

function install() {
    var _class, _temp;

    var topLevelElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getTopLevelElement();

    return wrapStaticObservableMethods(_Observable2.Observable, (_temp = _class = function (_Gestures) {
        _inherits(InstalledGestures, _Gestures);

        function InstalledGestures() {
            _classCallCheck(this, InstalledGestures);

            return _possibleConstructorReturn(this, (InstalledGestures.__proto__ || Object.getPrototypeOf(InstalledGestures)).apply(this, arguments));
        }

        _createClass(InstalledGestures, [{
            key: 'lift',
            value: function lift(operator) {
                var observable = new InstalledGestures(this);
                observable.operator = operator;
                return observable;
            }
        }]);

        return InstalledGestures;
    }(Gestures), _class.topLevelElement = topLevelElement, _temp));
}

var Gestures = function (_Observable) {
    _inherits(Gestures, _Observable);

    function Gestures(target) {
        _classCallCheck(this, Gestures);

        for (var _len = arguments.length, events = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            events[_key - 1] = arguments[_key];
        }

        if (!target || typeof target === 'function' || (typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object') {
            var _this2 = _possibleConstructorReturn(this, (Gestures.__proto__ || Object.getPrototypeOf(Gestures)).call(this, target));
        } else if (typeof target[_symbolObservable2.default] === 'function') {
            var _this2 = _possibleConstructorReturn(this, (Gestures.__proto__ || Object.getPrototypeOf(Gestures)).call(this));

            _this2.source = target[_symbolObservable2.default]();
        } else if (events.length === 1) {
            var _this2 = _possibleConstructorReturn(this, (Gestures.__proto__ || Object.getPrototypeOf(Gestures)).call(this));

            _this2.source = _Observable2.Observable.fromEvent(target, event[0]);
        } else {
            var _this2 = _possibleConstructorReturn(this, (Gestures.__proto__ || Object.getPrototypeOf(Gestures)).call(this));

            _this2.source = _Observable2.Observable.merge.apply(_Observable2.Observable, _toConsumableArray(events.map(function (event) {
                return _Observable2.Observable.fromEvent(target, event);
            })));
        }
        return _possibleConstructorReturn(_this2);
    }

    _createClass(Gestures, [{
        key: 'lift',
        value: function lift(operator) {
            var observable = new Gestures(this);
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
            var immediate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            return this.lift(new _operators.StopPropagationOperator(immediate));
        }
    }, {
        key: 'decelerate',
        value: function decelerate() {
            var coefficientOfFriction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 25;
            var speedLimit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3000;
            var scheduler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _animationFrame.animationFrame;

            return this.lift(new _operators.DecelerateOperator(coefficientOfFriction, speedLimit, scheduler));
        }
    }, {
        key: 'inside',
        value: function inside(_ref2) {
            var radiusX = _ref2.x,
                radiusY = _ref2.y;

            return this.filter(function (_ref3) {
                var movementXTotal = _ref3.movementXTotal,
                    movementYTotal = _ref3.movementYTotal;
                return !(0, _support.epsilon)(radiusX, radiusY, movementXTotal, movementYTotal);
            });
        }
    }, {
        key: 'outside',
        value: function outside(_ref4) {
            var radiusX = _ref4.x,
                radiusY = _ref4.y;

            return this.filter(function (_ref5) {
                var movementXTotal = _ref5.movementXTotal,
                    movementYTotal = _ref5.movementYTotal;
                return (0, _support.epsilon)(radiusX, radiusY, movementXTotal, movementYTotal);
            });
        }
    }, {
        key: 'normalize',
        value: function normalize(origin) {
            var Gestures_ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.constructor;
            var scheduler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _animationFrame.animationFrame;

            return this.lift(new _operators.NormalizeOperator(origin, Gestures_, scheduler));
        }
    }], [{
        key: 'startsById',
        value: function startsById() {
            var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.topLevelElement;
            var inputs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            return this.start(target).groupBy(getIdentifier, null, null, getReplaySubject1).take(inputs);
        }
    }, {
        key: 'start',
        value: function start() {
            var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.topLevelElement;

            return new this(target, mouseEvents.start, touchEvents.start).lift(new _operators.MultitouchOperator());
        }
    }, {
        key: 'move',
        value: function move() {
            var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.topLevelElement;

            return new this(target, mouseEvents.move, touchEvents.move).lift(new _operators.MultitouchOperator());
        }
    }, {
        key: 'end',
        value: function end() {
            var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.topLevelElement;

            return new this(target, mouseEvents.end, touchEvents.end).lift(new _operators.MultitouchOperator());
        }
    }, {
        key: 'cancel',
        value: function cancel() {
            var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.topLevelElement;

            return new this(target, mouseEvents.cancel, touchEvents.cancel).lift(new _operators.MultitouchOperator());
        }
    }, {
        key: 'tap',
        value: function tap() {
            var starts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.topLevelElement;
            var ends = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var _this3 = this;

            var cancels = arguments[2];
            var options = arguments[3];

            var _ref6 = arguments.length <= 2 ? ends : options,
                _ref6$inputs = _ref6.inputs,
                inputs = _ref6$inputs === undefined ? 1 : _ref6$inputs,
                _ref6$timeout = _ref6.timeout,
                timeout = _ref6$timeout === undefined ? 250 : _ref6$timeout,
                _ref6$radius = _ref6.radius,
                radius = _ref6$radius === undefined ? { x: 10, y: 10 } : _ref6$radius;

            if (arguments.length <= 2) {
                return this.startsById(starts, inputs).lift(new _operators.TapOperator(timeout, radius, this));
            }

            ends = ends instanceof this && ends || new this(ends);
            starts = starts instanceof this && starts || new this(starts);

            return starts.preventDefault().normalize(null, this).mergeMap(function (start) {
                return ends.preventDefault().normalize(start, _this3).inside(radius).timeoutWith(timeout, _Observable2.Observable.empty());
            }).takeUntil(cancels).take(1);
        }
    }, {
        key: 'press',
        value: function press() {
            var starts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.topLevelElement;
            var moves = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var ends = arguments[2];

            var _this4 = this;

            var cancels = arguments[3];
            var options = arguments[4];

            var _ref7 = arguments.length <= 2 ? moves : options,
                _ref7$inputs = _ref7.inputs,
                inputs = _ref7$inputs === undefined ? 1 : _ref7$inputs,
                _ref7$delay = _ref7.delay,
                delay = _ref7$delay === undefined ? 0 : _ref7$delay,
                _ref7$radius = _ref7.radius,
                radius = _ref7$radius === undefined ? { x: 10, y: 10 } : _ref7$radius;

            if (arguments.length <= 2) {
                return this.startsById(starts, inputs).lift(new _operators.PressOperator(delay, radius, this));
            }

            starts = starts instanceof this && starts || new this(starts);

            if (delay <= 0) {
                return starts.normalize(null, this).take(1);
            }

            moves = moves instanceof this && moves || new this(moves);

            return starts.preventDefault().normalize(null, this).mergeMap(function (start) {
                return _Observable2.Observable.timer(delay).withLatestFrom(moves.normalize(start, _this4).startWith(start), function (i, move) {
                    return move;
                }).takeUntil(ends.merge(cancels).merge(moves.normalize(start, _this4).outside(radius)));
            }).take(1);
        }
    }, {
        key: 'pan',
        value: function pan() {
            var starts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.topLevelElement;
            var moves = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var ends = arguments[2];

            var _this5 = this;

            var cancels = arguments[3];
            var options = arguments[4];

            var _ref8 = arguments.length <= 2 ? moves : options,
                _ref8$inputs = _ref8.inputs,
                inputs = _ref8$inputs === undefined ? 1 : _ref8$inputs,
                _ref8$delay = _ref8.delay,
                delay = _ref8$delay === undefined ? 0 : _ref8$delay,
                _ref8$radius = _ref8.radius,
                radius = _ref8$radius === undefined ? { x: 10, y: 10 } : _ref8$radius;

            if (arguments.length <= 2) {
                return this.startsById(starts, inputs).lift(new _operators.PanOperator(delay, radius, this));
            }

            ends = ends instanceof this && ends || new this(ends);
            moves = moves instanceof this && moves || new this(moves);
            starts = starts instanceof this && starts || new this(starts);

            return starts.preventDefault().mergeMap(function (start) {
                return moves.merge(ends).normalize(start, _this5).startWith(start);
            }).takeUntil(ends.merge(cancels));
        }
    }]);

    return Gestures;
}(_Observable2.Observable);

Gestures.topLevelElement = getTopLevelElement();


exports.Gestures = Gestures = wrapStaticObservableMethods(_Observable2.Observable, Gestures);

exports.Gestures = Gestures;
exports.default = Gestures;


function wrapStaticObservableMethods(Observable, Gestures) {
    function createStaticWrapper(staticMethodName) {
        return function () {
            return new Gestures(Observable[staticMethodName].apply(Observable, arguments));
        };
    }
    for (var staticMethodName in Observable) {
        Gestures[staticMethodName] = createStaticWrapper(staticMethodName);
    }
    Gestures.bindCallback = function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return function () {
            return new Gestures(Observable.bindCallback.apply(Observable, args).apply(undefined, arguments));
        };
    };
    Gestures.bindNodeCallback = function () {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
        }

        return function () {
            return new Gestures(Observable.bindNodeCallback.apply(Observable, args).apply(undefined, arguments));
        };
    };
    return Gestures;
}
//# sourceMappingURL=Gestures.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PressSubscriber = exports.PressOperator = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _support = require('../support');

var _Subscriber2 = require('rxjs/Subscriber');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PressOperator = exports.PressOperator = function () {
    function PressOperator(delay, radius, Gestures) {
        _classCallCheck(this, PressOperator);

        this.delay = delay;
        this.radius = radius;
        this.Gestures = Gestures;
    }

    _createClass(PressOperator, [{
        key: 'call',
        value: function call(subscriber, source) {
            return source.subscribe(new PressSubscriber(subscriber, this.delay, this.radius, this.Gestures));
        }
    }]);

    return PressOperator;
}();

var PressSubscriber = exports.PressSubscriber = function (_Subscriber) {
    _inherits(PressSubscriber, _Subscriber);

    function PressSubscriber(destination, delay, radius, Gestures) {
        _classCallCheck(this, PressSubscriber);

        var _this = _possibleConstructorReturn(this, (PressSubscriber.__proto__ || Object.getPrototypeOf(PressSubscriber)).call(this, destination));

        _this.delay = delay;
        _this.radius = radius;
        _this.Gestures = Gestures;
        return _this;
    }

    _createClass(PressSubscriber, [{
        key: '_next',
        value: function _next(starts) {
            var delay = this.delay,
                radius = this.radius,
                Gestures = this.Gestures;
            var topLevelElement = Gestures.topLevelElement;
            var key = starts.key;

            var isMouse = key === 'mouse';
            var selectPoint = isMouse ? null : (0, _support.selectId)(key);

            var moves = isMouse ? Gestures.move(topLevelElement) : Gestures.move(topLevelElement).filter(selectPoint);

            var ends = isMouse ? Gestures.end(topLevelElement) : Gestures.end(topLevelElement).filter(selectPoint);

            var cancels = isMouse ? Gestures.cancel(topLevelElement) : Gestures.cancel(topLevelElement).filter(selectPoint);

            _get(PressSubscriber.prototype.__proto__ || Object.getPrototypeOf(PressSubscriber.prototype), '_next', this).call(this, Gestures.press(starts, moves, ends, cancels, { delay: delay, radius: radius }));
        }
    }]);

    return PressSubscriber;
}(_Subscriber2.Subscriber);
//# sourceMappingURL=PressOperator.js.map
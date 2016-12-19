'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PanSubscriber = exports.PanOperator = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _support = require('../support');

var _Subscriber2 = require('rxjs/Subscriber');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PanOperator = exports.PanOperator = function () {
    function PanOperator(delay, radius, Gestures) {
        _classCallCheck(this, PanOperator);

        this.delay = delay;
        this.radius = radius;
        this.Gestures = Gestures;
    }

    _createClass(PanOperator, [{
        key: 'call',
        value: function call(subscriber, source) {
            return source.subscribe(new PanSubscriber(subscriber, this.delay, this.radius, this.Gestures));
        }
    }]);

    return PanOperator;
}();

var PanSubscriber = exports.PanSubscriber = function (_Subscriber) {
    _inherits(PanSubscriber, _Subscriber);

    function PanSubscriber(destination, delay, radius, Gestures) {
        _classCallCheck(this, PanSubscriber);

        var _this = _possibleConstructorReturn(this, (PanSubscriber.__proto__ || Object.getPrototypeOf(PanSubscriber)).call(this, destination));

        _this.delay = delay;
        _this.radius = radius;
        _this.Gestures = Gestures;
        return _this;
    }

    _createClass(PanSubscriber, [{
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

            var presses = Gestures.press(starts, moves, ends, cancels, { delay: delay, radius: radius });

            _get(PanSubscriber.prototype.__proto__ || Object.getPrototypeOf(PanSubscriber.prototype), '_next', this).call(this, Gestures.pan(presses, moves, ends, cancels, { delay: delay, radius: radius }));
        }
    }]);

    return PanSubscriber;
}(_Subscriber2.Subscriber);
//# sourceMappingURL=PanOperator.js.map
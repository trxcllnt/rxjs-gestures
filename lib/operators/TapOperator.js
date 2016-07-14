'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TapSubscriber = exports.TapOperator = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _support = require('../support');

var _Observable = require('rxjs/Observable');

var _Subscriber2 = require('rxjs/Subscriber');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import { MergeAllSubscriber } from 'rxjs/operator/mergeAll';

var TapOperator = exports.TapOperator = function () {
    function TapOperator(timeout, radius, Gestures) {
        _classCallCheck(this, TapOperator);

        this.timeout = timeout;
        this.radius = radius;
        this.Gestures = Gestures;
    }

    _createClass(TapOperator, [{
        key: 'call',
        value: function call(subscriber, source) {
            return source._subscribe(new TapSubscriber(subscriber, this.timeout, this.radius, this.Gestures));
        }
    }]);

    return TapOperator;
}();

var TapSubscriber = exports.TapSubscriber = function (_Subscriber) {
    _inherits(TapSubscriber, _Subscriber);

    // export class TapSubscriber extends MergeAllSubscriber {
    function TapSubscriber(destination, timeout, radius, Gestures) {
        _classCallCheck(this, TapSubscriber);

        // super(destination, Number.POSITIVE_INFINITY);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TapSubscriber).call(this, destination));

        _this.timeout = timeout;
        _this.radius = radius;
        _this.Gestures = Gestures;
        return _this;
    }

    _createClass(TapSubscriber, [{
        key: '_next',
        value: function _next(starts) {
            var timeout = this.timeout;
            var radius = this.radius;
            var Gestures = this.Gestures;
            var topLevelElement = Gestures.topLevelElement;
            var key = starts.key;

            var isMouse = key === 'mouse';
            var selectPoint = isMouse ? null : (0, _support.selectId)(key);

            var ends = isMouse ? Gestures.end(topLevelElement) : Gestures.end(topLevelElement).filter(selectPoint);

            var cancels = isMouse ? Gestures.cancel(topLevelElement) : Gestures.cancel(topLevelElement).filter(selectPoint);

            _get(Object.getPrototypeOf(TapSubscriber.prototype), '_next', this).call(this, Gestures.tap(starts, timeout, radius, ends, cancels));
        }
    }]);

    return TapSubscriber;
}(_Subscriber2.Subscriber);
//# sourceMappingURL=TapOperator.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StopPropagationOperator = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Subscriber2 = require('rxjs/Subscriber');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StopPropagationOperator = exports.StopPropagationOperator = function () {
    function StopPropagationOperator() {
        var immediate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        _classCallCheck(this, StopPropagationOperator);

        this.immediate = immediate;
    }

    _createClass(StopPropagationOperator, [{
        key: 'call',
        value: function call(subscriber, source) {
            return source.subscribe(new StopPropagationSubscriber(subscriber, this.immediate));
        }
    }]);

    return StopPropagationOperator;
}();

var StopPropagationSubscriber = function (_Subscriber) {
    _inherits(StopPropagationSubscriber, _Subscriber);

    function StopPropagationSubscriber(destination, immediate) {
        _classCallCheck(this, StopPropagationSubscriber);

        var _this = _possibleConstructorReturn(this, (StopPropagationSubscriber.__proto__ || Object.getPrototypeOf(StopPropagationSubscriber)).call(this, destination));

        _this.immediate = immediate;
        return _this;
    }

    _createClass(StopPropagationSubscriber, [{
        key: '_next',
        value: function _next(maybeNormalized) {
            var _maybeNormalized$even = maybeNormalized.event,
                event = _maybeNormalized$even === undefined ? maybeNormalized : _maybeNormalized$even;

            if (event) {
                if (this.immediate) {
                    // handle React events, which don't proxy the `stopImmediatePropagation` function
                    if (typeof event.stopImmediatePropagation === 'function') {
                        event.stopImmediatePropagation();
                    } else if (event.nativeEvent && typeof event.nativeEvent.stopImmediatePropagation == 'function') {
                        event.nativeEvent.stopImmediatePropagation();
                    } else if (typeof event.stopPropagation === 'function') {
                        event.stopPropagation();
                    }
                } else if (typeof event.stopPropagation === 'function') {
                    event.stopPropagation();
                }
            }
            _get(StopPropagationSubscriber.prototype.__proto__ || Object.getPrototypeOf(StopPropagationSubscriber.prototype), '_next', this).call(this, maybeNormalized);
        }
    }]);

    return StopPropagationSubscriber;
}(_Subscriber2.Subscriber);
//# sourceMappingURL=StopPropagationOperator.js.map
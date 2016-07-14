'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PreventDefaultOperator = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rxjs = require('rxjs');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PreventDefaultOperator = exports.PreventDefaultOperator = function () {
    function PreventDefaultOperator() {
        _classCallCheck(this, PreventDefaultOperator);
    }

    _createClass(PreventDefaultOperator, [{
        key: 'call',
        value: function call(subscriber, source) {
            return source._subscribe(new PreventDefaultSubscriber(subscriber));
        }
    }]);

    return PreventDefaultOperator;
}();

var PreventDefaultSubscriber = function (_Subscriber) {
    _inherits(PreventDefaultSubscriber, _Subscriber);

    function PreventDefaultSubscriber() {
        _classCallCheck(this, PreventDefaultSubscriber);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(PreventDefaultSubscriber).apply(this, arguments));
    }

    _createClass(PreventDefaultSubscriber, [{
        key: '_next',
        value: function _next(normalizedEvent) {
            var event = normalizedEvent.event;

            event.preventDefault();
            _get(Object.getPrototypeOf(PreventDefaultSubscriber.prototype), '_next', this).call(this, normalizedEvent);
        }
    }]);

    return PreventDefaultSubscriber;
}(_rxjs.Subscriber);
//# sourceMappingURL=PreventDefaultOperator.js.map
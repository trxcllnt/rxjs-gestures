'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MultitouchSubscriber = exports.MultitouchOperator = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _support = require('../support');

var _Subscriber2 = require('rxjs/Subscriber');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MultitouchOperator = exports.MultitouchOperator = function () {
    function MultitouchOperator() {
        _classCallCheck(this, MultitouchOperator);
    }

    _createClass(MultitouchOperator, [{
        key: 'call',
        value: function call(subscriber, source) {
            return source.subscribe(new MultitouchSubscriber(subscriber));
        }
    }]);

    return MultitouchOperator;
}();

var degToRad = Math.PI / 180;

var MultitouchSubscriber = exports.MultitouchSubscriber = function (_Subscriber) {
    _inherits(MultitouchSubscriber, _Subscriber);

    function MultitouchSubscriber(destination) {
        _classCallCheck(this, MultitouchSubscriber);

        var _this = _possibleConstructorReturn(this, (MultitouchSubscriber.__proto__ || Object.getPrototypeOf(MultitouchSubscriber)).call(this, destination));

        _this.index = 0;
        return _this;
    }

    _createClass(MultitouchSubscriber, [{
        key: '_next',
        value: function _next(event) {

            if (event instanceof _support.Point) {
                return _get(MultitouchSubscriber.prototype.__proto__ || Object.getPrototypeOf(MultitouchSubscriber.prototype), '_next', this).call(this, event);
            }

            var index = this.index++;
            var type = event.type,
                button = event.button,
                buttons = event.buttons,
                target = event.currentTarget;

            var isTouch = type[0] === 't';

            if (!isTouch) {
                var _event$deltaX = event.deltaX,
                    deltaX = _event$deltaX === undefined ? 0 : _event$deltaX,
                    _event$deltaY = event.deltaY,
                    deltaY = _event$deltaY === undefined ? 0 : _event$deltaY,
                    _event$deltaZ = event.deltaZ,
                    deltaZ = _event$deltaZ === undefined ? 0 : _event$deltaZ;
                var pageX = event.pageX,
                    pageY = event.pageY,
                    clientX = event.clientX,
                    clientY = event.clientY,
                    screenX = event.screenX,
                    screenY = event.screenY;

                _get(MultitouchSubscriber.prototype.__proto__ || Object.getPrototypeOf(MultitouchSubscriber.prototype), '_next', this).call(this, {
                    button: button, buttons: buttons,
                    deltaX: deltaX, deltaY: deltaY, deltaZ: deltaZ,
                    type: type, event: event, touch: event, target: target,
                    index: index, pageX: pageX, pageY: pageY, screenX: screenX, screenY: screenY,
                    clientX: clientX, clientY: clientY, radiusX: 1, radiusY: 1,
                    identifier: 'mouse', rotationAngle: 0
                });
            } else {
                var touchesIndex = -1;
                var touches = event.changedTouches;
                var touchesLen = touches.length;
                while (++touchesIndex < touchesLen) {
                    var touch = touches[touchesIndex];
                    var identifier = touch.identifier,
                        _pageX = touch.pageX,
                        _pageY = touch.pageY,
                        _screenX = touch.screenX,
                        _screenY = touch.screenY,
                        _clientX = touch.clientX,
                        _clientY = touch.clientY,
                        _touch$radiusX = touch.radiusX,
                        radiusX = _touch$radiusX === undefined ? 1 : _touch$radiusX,
                        _touch$radiusY = touch.radiusY,
                        radiusY = _touch$radiusY === undefined ? 1 : _touch$radiusY,
                        _touch$rotationAngle = touch.rotationAngle,
                        rotationAngle = _touch$rotationAngle === undefined ? 0 : _touch$rotationAngle;

                    _get(MultitouchSubscriber.prototype.__proto__ || Object.getPrototypeOf(MultitouchSubscriber.prototype), '_next', this).call(this, {
                        button: button, buttons: 0,
                        deltaX: 0, deltaY: 0, deltaZ: 0,
                        type: type, event: event, touch: touch, target: target, identifier: identifier,
                        index: index, pageX: _pageX, pageY: _pageY, screenX: _screenX, screenY: _screenY,
                        clientX: _clientX, clientY: _clientY, radiusX: radiusX, radiusY: radiusY,
                        rotationAngle: rotationAngle * degToRad
                    });
                }
            }
        }
    }]);

    return MultitouchSubscriber;
}(_Subscriber2.Subscriber);

/*
// const changes = !isTouch ? [event] : Array.from(event.changedTouches);
// const targets = !isTouch ? changes : reduceTouches(event.targetTouches);
// const touches = !isTouch ? targets : changes.filter((touch) => (
//     targets.hasOwnProperty(touch.identifier)
// ));
function reduceTouches(touches) {
    return Array.from(touches).reduce((touches, touch) => ({
        ...touches, [touch.identifier]: touch
    }), {})
}
*/
//# sourceMappingURL=MultitouchOperator.js.map
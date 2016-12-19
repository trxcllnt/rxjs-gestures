'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MultitouchSubscriber = exports.MultitouchOperator = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _support = require('../support');

var _mergeAll = require('rxjs/operator/mergeAll');

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

var MultitouchSubscriber = exports.MultitouchSubscriber = function (_MergeAllSubscriber) {
    _inherits(MultitouchSubscriber, _MergeAllSubscriber);

    function MultitouchSubscriber(destination) {
        _classCallCheck(this, MultitouchSubscriber);

        var _this = _possibleConstructorReturn(this, (MultitouchSubscriber.__proto__ || Object.getPrototypeOf(MultitouchSubscriber)).call(this, destination, Number.POSITIVE_INFINITY));

        _this.index = 0;
        return _this;
    }

    _createClass(MultitouchSubscriber, [{
        key: '_next',
        value: function _next(event) {

            if (event instanceof _support.Point) {
                return this.notifyNext(event, event, ++this.index, 0);
            }

            var index = this.index++;
            var type = event.type,
                button = event.button,
                buttons = event.buttons,
                target = event.currentTarget;

            var isTouch = type[0] === 't';

            if (!isTouch) {
                var pageX = event.pageX,
                    pageY = event.pageY,
                    clientX = event.clientX,
                    clientY = event.clientY,
                    screenX = event.screenX,
                    screenY = event.screenY;

                this.notifyNext(event, {
                    button: button, buttons: buttons,
                    type: type, event: event, touch: event, target: target,
                    index: index, pageX: pageX, pageY: pageY, screenX: screenX, screenY: screenY,
                    clientX: clientX, clientY: clientY, radiusX: 1, radiusY: 1,
                    identifier: 'mouse', rotationAngle: 0
                }, index, 0);
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

                    this.notifyNext(event, {
                        button: button, buttons: 0,
                        type: type, event: event, touch: touch, target: target, identifier: identifier,
                        index: index, pageX: _pageX, pageY: _pageY, screenX: _screenX, screenY: _screenY,
                        clientX: _clientX, clientY: _clientY, radiusX: radiusX, radiusY: radiusY,
                        rotationAngle: rotationAngle * degToRad
                    }, index, touchesIndex);
                }
            }
        }
    }]);

    return MultitouchSubscriber;
}(_mergeAll.MergeAllSubscriber);

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
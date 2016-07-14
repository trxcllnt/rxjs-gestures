'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.normalize = normalize;

var _rxjs = require('rxjs');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var degToRad = Math.PI / 180;

function normalize(event) {

    var points = [];
    var type = event.type;
    var target = event.target;

    var isTouch = type[0] === 't';

    var _target$getBoundingCl = target.getBoundingClientRect();

    var top = _target$getBoundingCl.top;
    var left = _target$getBoundingCl.left;
    var clientTop = target.clientTop;
    var clientLeft = target.clientLeft;
    var scrollTop = target.scrollTop;
    var scrollLeft = target.scrollLeft;

    var touches = !isTouch ? [event] : Array.from(event.changedTouches);
    // const changes = !isTouch ? [event] : Array.from(event.changedTouches);
    // const targets = !isTouch ? changes : reduceTouches(event.targetTouches);
    // const touches = !isTouch ? targets : changes.filter((touch) => (
    //     targets.hasOwnProperty(touch.identifier)
    // ));

    var pointIdx = -1;
    var length = touches.length;

    while (++pointIdx < length) {
        var point = touches[pointIdx];
        var clientX = point.clientX;
        var clientY = point.clientY;

        var localY = clientY - top - clientTop + scrollTop;
        var localX = clientX - left - clientLeft + scrollLeft;
        var _point$identifier = point.identifier;
        var identifier = _point$identifier === undefined ? 'mouse' : _point$identifier;
        var pageX = point.pageX;
        var pageY = point.pageY;
        var screenX = point.screenX;
        var screenY = point.screenY;
        var _point$radiusX = point.radiusX;
        var radiusX = _point$radiusX === undefined ? 1 : _point$radiusX;
        var _point$radiusY = point.radiusY;
        var radiusY = _point$radiusY === undefined ? 1 : _point$radiusY;
        var _point$rotationAngle = point.rotationAngle;
        var rotationAngle = _point$rotationAngle === undefined ? 0 : _point$rotationAngle;


        points[pointIdx] = {
            pageX: pageX, pageY: pageY, localX: localX, localY: localY,
            originX: localX, originY: localY,
            clientX: clientX, clientY: clientY, screenX: screenX, screenY: screenY,
            type: type, event: event, point: point, identifier: identifier, isTouch: isTouch,
            deltaX: 0, deltaY: 0, totalX: 0, totalY: 0,
            radiusX: radiusX, radiusY: radiusY, radiusA: rotationAngle * degToRad
        };
    }

    return points;
}

function reduceTouches(touches) {
    return Array.from(touches).reduce(function (touches, touch) {
        return _extends({}, touches, _defineProperty({}, touch.identifier, touch));
    }, {});
}
//# sourceMappingURL=normalize.js.map
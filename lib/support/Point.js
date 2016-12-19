'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = exports.Point = function () {
    function Point() {
        var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var touch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var target = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var identifier = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
        var radiusX = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
        var radiusY = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 1;
        var rotationAngle = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
        var x = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;
        var y = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 0;
        var pageX = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : 0;
        var pageY = arguments.length > 11 && arguments[11] !== undefined ? arguments[11] : 0;
        var clientX = arguments.length > 12 && arguments[12] !== undefined ? arguments[12] : 0;
        var clientY = arguments.length > 13 && arguments[13] !== undefined ? arguments[13] : 0;
        var screenX = arguments.length > 14 && arguments[14] !== undefined ? arguments[14] : 0;
        var screenY = arguments.length > 15 && arguments[15] !== undefined ? arguments[15] : 0;
        var targetX = arguments.length > 16 && arguments[16] !== undefined ? arguments[16] : 0;
        var targetY = arguments.length > 17 && arguments[17] !== undefined ? arguments[17] : 0;
        var targetPageX = arguments.length > 18 && arguments[18] !== undefined ? arguments[18] : 0;
        var targetPageY = arguments.length > 19 && arguments[19] !== undefined ? arguments[19] : 0;
        var targetClientX = arguments.length > 20 && arguments[20] !== undefined ? arguments[20] : 0;
        var targetClientY = arguments.length > 21 && arguments[21] !== undefined ? arguments[21] : 0;
        var targetScreenX = arguments.length > 22 && arguments[22] !== undefined ? arguments[22] : 0;
        var targetScreenY = arguments.length > 23 && arguments[23] !== undefined ? arguments[23] : 0;

        _classCallCheck(this, Point);

        this.time = time;
        this.event = event;
        this.touch = touch;
        this.target = target;
        this.identifier = identifier;
        this.x = x;
        this.y = y;
        this.pageX = pageX;
        this.pageY = pageY;
        this.clientX = clientX;
        this.clientY = clientY;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.screenX = screenX;
        this.screenY = screenY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.targetPageX = targetPageX;
        this.targetPageY = targetPageY;
        this.targetClientX = targetClientX;
        this.targetClientY = targetClientY;
        this.targetScreenX = targetScreenX;
        this.targetScreenY = targetScreenY;
        this.rotationAngle = rotationAngle;
    }

    _createClass(Point, [{
        key: 'clone',
        value: function clone(props) {
            return !props ? Object.create(this) : Object.assign(Object.create(this), props);
        }
    }]);

    return Point;
}();

Point.prototype.type = '';
Point.prototype.time = 0;
Point.prototype.index = 0;
Point.prototype.event = null;
Point.prototype.touch = null;
Point.prototype.target = null;
Point.prototype.targetTop = 0;
Point.prototype.targetLeft = 0;
Point.prototype.targetRight = 0;
Point.prototype.targetBottom = 0;
Point.prototype.parentTop = 0;
Point.prototype.parentLeft = 0;
Point.prototype.parentRight = 0;
Point.prototype.parentBottom = 0;
Point.prototype.identifier = null;
Point.prototype.x = 0;
Point.prototype.y = 0;
Point.prototype.pageX = 0;
Point.prototype.pageY = 0;
Point.prototype.radiusX = 1;
Point.prototype.radiusY = 1;
Point.prototype.screenX = 0;
Point.prototype.screenY = 0;
Point.prototype.targetX = 0;
Point.prototype.targetY = 0;
Point.prototype.targetPageX = 0;
Point.prototype.targetPageY = 0;
Point.prototype.targetClientX = 0;
Point.prototype.targetClientY = 0;
Point.prototype.targetScreenX = 0;
Point.prototype.targetScreenY = 0;
Point.prototype.rotationAngle = 0;

Point.prototype.movementX = 0;
Point.prototype.movementY = 0;
Point.prototype.movementT = 0;
Point.prototype.magnitude = 0;
Point.prototype.direction = 0;
Point.prototype.movementXTotal = 0;
Point.prototype.movementYTotal = 0;
Point.prototype.movementTTotal = 0;
Point.prototype.timeOrigin = 0;
Point.prototype.pageXOrigin = 0;
Point.prototype.pageYOrigin = 0;
Point.prototype.xOrigin = 0;
Point.prototype.yOrigin = 0;
Point.prototype.screenXOrigin = 0;
Point.prototype.screenYOrigin = 0;
Point.prototype.targetPageXOrigin = 0;
Point.prototype.targetPageYOrigin = 0;
Point.prototype.targetXOrigin = 0;
Point.prototype.targetYOrigin = 0;
Point.prototype.targetClientXOrigin = 0;
Point.prototype.targetClientYOrigin = 0;
//# sourceMappingURL=Point.js.map
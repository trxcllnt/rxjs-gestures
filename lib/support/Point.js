"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = exports.Point = function () {
    function Point() {
        var time = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
        var event = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
        var touch = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
        var target = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
        var identifier = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];
        var radiusX = arguments.length <= 5 || arguments[5] === undefined ? 1 : arguments[5];
        var radiusY = arguments.length <= 6 || arguments[6] === undefined ? 1 : arguments[6];
        var rotationAngle = arguments.length <= 7 || arguments[7] === undefined ? 0 : arguments[7];
        var x = arguments.length <= 8 || arguments[8] === undefined ? 0 : arguments[8];
        var y = arguments.length <= 9 || arguments[9] === undefined ? 0 : arguments[9];
        var pageX = arguments.length <= 10 || arguments[10] === undefined ? 0 : arguments[10];
        var pageY = arguments.length <= 11 || arguments[11] === undefined ? 0 : arguments[11];
        var clientX = arguments.length <= 12 || arguments[12] === undefined ? 0 : arguments[12];
        var clientY = arguments.length <= 13 || arguments[13] === undefined ? 0 : arguments[13];
        var screenX = arguments.length <= 14 || arguments[14] === undefined ? 0 : arguments[14];
        var screenY = arguments.length <= 15 || arguments[15] === undefined ? 0 : arguments[15];
        var targetX = arguments.length <= 16 || arguments[16] === undefined ? 0 : arguments[16];
        var targetY = arguments.length <= 17 || arguments[17] === undefined ? 0 : arguments[17];
        var targetPageX = arguments.length <= 18 || arguments[18] === undefined ? 0 : arguments[18];
        var targetPageY = arguments.length <= 19 || arguments[19] === undefined ? 0 : arguments[19];
        var targetClientX = arguments.length <= 20 || arguments[20] === undefined ? 0 : arguments[20];
        var targetClientY = arguments.length <= 21 || arguments[21] === undefined ? 0 : arguments[21];
        var targetScreenX = arguments.length <= 22 || arguments[22] === undefined ? 0 : arguments[22];
        var targetScreenY = arguments.length <= 23 || arguments[23] === undefined ? 0 : arguments[23];

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
        key: "clone",
        value: function clone() {
            return Object.create(this);
        }
    }]);

    return Point;
}();

Point.prototype.time = 0;
Point.prototype.index = 0;
Point.prototype.event = null;
Point.prototype.touch = null;
Point.prototype.target = null;
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
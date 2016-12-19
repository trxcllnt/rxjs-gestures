'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NormalizeSubscriber = exports.NormalizeOperator = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _support = require('../support');

var _Subscriber2 = require('rxjs/Subscriber');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NormalizeOperator = exports.NormalizeOperator = function () {
    function NormalizeOperator(origin, Gestures, scheduler) {
        _classCallCheck(this, NormalizeOperator);

        this.origin = origin || undefined;
        this.Gestures = Gestures;
        this.scheduler = scheduler;
    }

    _createClass(NormalizeOperator, [{
        key: 'call',
        value: function call(subscriber, source) {
            return source.subscribe(new NormalizeSubscriber(subscriber, this.origin, this.Gestures, this.scheduler));
        }
    }]);

    return NormalizeOperator;
}();

var NormalizeSubscriber = exports.NormalizeSubscriber = function (_Subscriber) {
    _inherits(NormalizeSubscriber, _Subscriber);

    function NormalizeSubscriber(subscriber, origin, Gestures, scheduler) {
        _classCallCheck(this, NormalizeSubscriber);

        var _this = _possibleConstructorReturn(this, (NormalizeSubscriber.__proto__ || Object.getPrototypeOf(NormalizeSubscriber)).call(this, subscriber));

        _this.origin = origin;
        _this.previous = origin;
        _this.Gestures = Gestures;
        _this.scheduler = scheduler;
        _this.sampleX = 0;
        _this.sampleY = 0;
        _this.sampleT = scheduler.now();
        return _this;
    }

    _createClass(NormalizeSubscriber, [{
        key: '_next',
        value: function _next(multitouchEvent) {

            if (multitouchEvent instanceof _support.Point) {
                return _get(NormalizeSubscriber.prototype.__proto__ || Object.getPrototypeOf(NormalizeSubscriber.prototype), '_next', this).call(this, this.previous = multitouchEvent);
            }

            var time = this.scheduler.now();
            var origin = this.origin,
                lastWindowTime = this.lastWindowTime;
            var type = multitouchEvent.type,
                index = multitouchEvent.index,
                event = multitouchEvent.event,
                touch = multitouchEvent.touch,
                target = multitouchEvent.target,
                screenX = multitouchEvent.screenX,
                screenY = multitouchEvent.screenY,
                pageX = multitouchEvent.pageX,
                pageY = multitouchEvent.pageY,
                clientX = multitouchEvent.clientX,
                clientY = multitouchEvent.clientY,
                deltaX = multitouchEvent.deltaX,
                deltaY = multitouchEvent.deltaY,
                deltaZ = multitouchEvent.deltaZ,
                _multitouchEvent$radi = multitouchEvent.radiusX,
                radiusX = _multitouchEvent$radi === undefined ? 1 : _multitouchEvent$radi,
                _multitouchEvent$radi2 = multitouchEvent.radiusY,
                radiusY = _multitouchEvent$radi2 === undefined ? 1 : _multitouchEvent$radi2,
                _multitouchEvent$rota = multitouchEvent.rotationAngle,
                rotationAngle = _multitouchEvent$rota === undefined ? 0 : _multitouchEvent$rota;


            if (!origin) {
                this.origin = origin = NormalizeSubscriber.createOrigin(multitouchEvent, touch, time, this.Gestures);
            }

            var _previous = this.previous,
                previous = _previous === undefined ? origin : _previous;
            var prevX = previous.pageX,
                prevY = previous.pageY;


            var movementX = pageX - prevX;
            var movementY = pageY - prevY;
            var movementT = time - previous.time;
            var movementXTotal = movementX + previous.movementXTotal;
            var movementYTotal = movementY + previous.movementYTotal;
            var movementTTotal = movementT + previous.movementTTotal;

            var sampleX = this.sampleX,
                sampleY = this.sampleY,
                sampleT = this.sampleT;

            var sampleXTotal = void 0,
                sampleYTotal = void 0,
                sampleTTotal = time - sampleT;

            if (sampleTTotal >= 100) {
                sampleXTotal = 0;
                sampleYTotal = 0;
                sampleTTotal = 1;
                this.sampleT = sampleT = time;
                this.sampleX = sampleX = pageX;
                this.sampleY = sampleY = pageY;
            } else {
                sampleXTotal = pageX - sampleX;
                sampleYTotal = pageY - sampleY;
            }

            var distance = Math.sqrt(sampleXTotal * sampleXTotal + sampleYTotal * sampleYTotal) || 0;
            var speed = Math.sqrt(distance / (sampleTTotal || 1)) || 0;
            var direction = Math.atan2(movementY / movementT, movementX / movementT) || 0;

            var point = origin.clone();

            point.type = type;
            point.time = time;
            point.index = index;
            point.touch = touch;
            point.event = event;
            point.pageX = pageX;
            point.pageY = pageY;
            point.movementT = movementT;
            point.movementX = movementX;
            point.movementY = movementY;
            point.deltaX = deltaX;
            point.deltaY = deltaY;
            point.deltaZ = deltaZ;
            point.clientX = clientX;
            point.clientY = clientY;
            point.screenX = screenX;
            point.screenY = screenY;
            point.radiusX = radiusX;
            point.radiusY = radiusY;
            point.speed = speed;
            point.direction = direction;
            point.rotationAngle = rotationAngle;
            point.movementXTotal = movementXTotal;
            point.movementYTotal = movementYTotal;
            point.movementTTotal = movementTTotal;

            point.x += movementXTotal;
            point.y += movementYTotal;
            point.targetX += movementXTotal;
            point.targetY += movementYTotal;
            point.targetPageX += movementXTotal;
            point.targetPageY += movementYTotal;
            point.targetClientX += movementXTotal;
            point.targetClientY += movementYTotal;
            point.targetScreenX += movementXTotal;
            point.targetScreenY += movementYTotal;

            _get(NormalizeSubscriber.prototype.__proto__ || Object.getPrototypeOf(NormalizeSubscriber.prototype), '_next', this).call(this, this.previous = point);
        }
    }], [{
        key: 'createOrigin',
        value: function createOrigin(event, touch, time, Gestures) {
            var identifier = touch.identifier;
            var topLevelElement = Gestures.topLevelElement;
            var type = event.type,
                target = event.target,
                pageX = event.pageX,
                pageY = event.pageY,
                clientX = event.clientX,
                clientY = event.clientY,
                screenX = event.screenX,
                screenY = event.screenY,
                _event$radiusX = event.radiusX,
                radiusX = _event$radiusX === undefined ? 1 : _event$radiusX,
                _event$radiusY = event.radiusY,
                radiusY = _event$radiusY === undefined ? 1 : _event$radiusY,
                _event$rotationAngle = event.rotationAngle,
                rotationAngle = _event$rotationAngle === undefined ? 0 : _event$rotationAngle;
            var _target$offsetParent = target.offsetParent,
                offsetParent = _target$offsetParent === undefined ? topLevelElement : _target$offsetParent,
                offsetLeft = target.offsetLeft,
                offsetTop = target.offsetTop,
                scrollTop = target.scrollTop,
                scrollLeft = target.scrollLeft;

            var _target$getBoundingCl = target.getBoundingClientRect(),
                targetTop = _target$getBoundingCl.top,
                targetLeft = _target$getBoundingCl.left,
                targetRight = _target$getBoundingCl.right,
                targetBottom = _target$getBoundingCl.bottom;

            var _offsetParent$getBoun = offsetParent.getBoundingClientRect(),
                parentTop = _offsetParent$getBoun.top,
                parentLeft = _offsetParent$getBoun.left,
                parentRight = _offsetParent$getBoun.right,
                parentBottom = _offsetParent$getBoun.bottom;

            var x = clientX - targetLeft - scrollLeft;
            var y = clientY - targetTop - scrollTop;
            var targetPageX = targetLeft - scrollLeft + topLevelElement.pageXOffset;
            var targetPageY = targetTop - scrollTop + topLevelElement.pageYOffset;
            var targetX = targetLeft - parentLeft - offsetLeft - scrollLeft;
            var targetY = targetTop - parentTop - offsetTop - scrollTop;
            var targetClientX = targetLeft - scrollLeft;
            var targetClientY = targetTop - scrollTop;
            var targetScreenX = screenX - clientX + targetLeft - scrollLeft;
            var targetScreenY = screenY - clientY + targetTop - scrollTop;

            var origin = new _support.Point(time, null, null, target, identifier, radiusX, radiusY, rotationAngle, x, y, pageX, pageY, clientX, clientY, screenX, screenY, targetX, targetY, targetPageX, targetPageY, targetClientX, targetClientY, targetScreenX, targetScreenY);
            origin.type = type;
            origin.xOrigin = origin.x;
            origin.yOrigin = origin.y;
            origin.targetTop = targetTop;
            origin.targetLeft = targetLeft;
            origin.targetRight = targetRight;
            origin.targetBottom = targetBottom;
            origin.parentTop = parentTop;
            origin.parentLeft = parentLeft;
            origin.parentRight = parentRight;
            origin.parentBottom = parentBottom;
            origin.pageXOrigin = origin.pageX;
            origin.pageYOrigin = origin.pageY;
            origin.clientXOrigin = origin.clientX;
            origin.clientYOrigin = origin.clientY;
            origin.screenXOrigin = origin.screenX;
            origin.screenYOrigin = origin.screenY;
            origin.targetXOrigin = origin.targetX;
            origin.targetYOrigin = origin.targetY;
            origin.targetPageXOrigin = origin.targetPageX;
            origin.targetPageYOrigin = origin.targetPageY;
            origin.targetClientXOrigin = origin.targetClientX;
            origin.targetClientYOrigin = origin.targetClientY;
            origin.targetScreenXOrigin = origin.targetScreenX;
            origin.targetScreenYOrigin = origin.targetScreenY;

            return origin;
        }
    }]);

    return NormalizeSubscriber;
}(_Subscriber2.Subscriber);
//# sourceMappingURL=NormalizeOperator.js.map
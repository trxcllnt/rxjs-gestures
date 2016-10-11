'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DecelerateSubscriber = exports.DecelerateOperator = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rxjs = require('rxjs');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DecelerateOperator = exports.DecelerateOperator = function () {
    function DecelerateOperator(u, speedLimit, scheduler) {
        _classCallCheck(this, DecelerateOperator);

        if (u === 0) {
            u = 1;
        }
        if (u < 0) {
            u = Math.abs(u);
        }
        if (u > 100) {
            u /= Math.pow(10, Math.ceil(Math.log10(u))) * 100;
        }
        this.u = u / 100;
        this.speedLimit = Math.abs(speedLimit);
        this.scheduler = scheduler;
    }

    _createClass(DecelerateOperator, [{
        key: 'call',
        value: function call(subscriber, source) {
            return source._subscribe(new DecelerateSubscriber(subscriber, this.u, this.speedLimit, this.scheduler));
        }
    }]);

    return DecelerateOperator;
}();

var DecelerateSubscriber = exports.DecelerateSubscriber = function (_Subscriber) {
    _inherits(DecelerateSubscriber, _Subscriber);

    function DecelerateSubscriber(destination, u, speedLimit, scheduler) {
        _classCallCheck(this, DecelerateSubscriber);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DecelerateSubscriber).call(this, destination, null, scheduler));

        _this.u = u;
        _this.point = null;
        _this.hasPoint = false;
        _this.scheduler = scheduler;
        _this.speedLimit = speedLimit;
        return _this;
    }

    _createClass(DecelerateSubscriber, [{
        key: '_next',
        value: function _next(point) {
            _get(Object.getPrototypeOf(DecelerateSubscriber.prototype), '_next', this).call(this, (this.hasPoint = true) && (this.point = point));
        }
    }, {
        key: '_complete',
        value: function _complete() {

            if (!this.hasPoint) {
                return _get(Object.getPrototypeOf(DecelerateSubscriber.prototype), '_complete', this).call(this);
            }

            var u = this.u;
            var point = this.point;
            var speedLimit = this.speedLimit;
            var scheduler = this.scheduler;
            var _point$index = point.index;
            var index = _point$index === undefined ? 0 : _point$index;
            var _point$movementT = point.movementT;
            var movementT = _point$movementT === undefined ? 1 : _point$movementT;
            var direction = point.direction;


            if (!index || index <= 0) {
                return _get(Object.getPrototypeOf(DecelerateSubscriber.prototype), '_complete', this).call(this);
            }

            var magnitude = Math.min(point.magnitude, speedLimit);
            var duration = Math.sqrt(magnitude / movementT / (9.8 /*normalForce*/ * u)) || 0;

            if (!duration || duration <= 0) {
                return _get(Object.getPrototypeOf(DecelerateSubscriber.prototype), '_complete', this).call(this);
            }

            var distanceX = Math.cos(direction) * magnitude * duration;
            var distanceY = Math.sin(direction) * magnitude * duration;

            this.add(scheduler.schedule(DecelerateSubscriber.dispatch, 0, {
                point: point,
                start: point,
                time: scheduler.now(),
                duration: duration * 100,
                subscriber: this.destination,
                distanceX: distanceX, distanceY: distanceY, scheduler: scheduler
            }));
        }
    }], [{
        key: 'dispatch',
        value: function dispatch(state) {
            var time = state.time;
            var start = state.start;
            var point = state.point;
            var scheduler = state.scheduler;
            var subscriber = state.subscriber;
            var distanceX = state.distanceX;
            var distanceY = state.distanceY;
            var duration = state.duration;


            var now = scheduler.now();
            var elapsed = now - time;

            if (elapsed > duration) {
                subscriber.complete();
            } else {

                var easingFunc = quadOut;
                var pageX = easingFunc(elapsed, start.pageX, distanceX, duration);
                var pageY = easingFunc(elapsed, start.pageY, distanceY, duration);

                point = point.clone();

                point.movementT = now - point.time;
                point.movementX = pageX - point.pageX;
                point.movementY = pageY - point.pageY;
                point.movementXTotal = point.movementX + point.movementXTotal;
                point.movementYTotal = point.movementY + point.movementYTotal;
                point.x = easingFunc(elapsed, start.x, distanceX, duration);
                point.y = easingFunc(elapsed, start.y, distanceY, duration);
                point.clientX = easingFunc(elapsed, start.clientX, distanceX, duration);
                point.clientY = easingFunc(elapsed, start.clientY, distanceY, duration);
                point.screenX = easingFunc(elapsed, start.screenX, distanceX, duration);
                point.screenY = easingFunc(elapsed, start.screenY, distanceY, duration);
                point.targetX = easingFunc(elapsed, start.targetX, distanceX, duration);
                point.targetY = easingFunc(elapsed, start.targetY, distanceY, duration);
                point.targetPageX = easingFunc(elapsed, start.targetPageX, distanceX, duration);
                point.targetPageY = easingFunc(elapsed, start.targetPageY, distanceY, duration);
                point.targetClientX = easingFunc(elapsed, start.targetClientX, distanceX, duration);
                point.targetClientY = easingFunc(elapsed, start.targetClientY, distanceY, duration);
                point.targetScreenX = easingFunc(elapsed, start.targetScreenX, distanceX, duration);
                point.targetScreenY = easingFunc(elapsed, start.targetScreenY, distanceY, duration);

                point.time = now;
                point.pageX = pageX;
                point.pageY = pageY;
                state.point = point;

                subscriber.next(point);

                this.schedule(state, 0);
            }
        }
    }]);

    return DecelerateSubscriber;
}(_rxjs.Subscriber);

function quadOut(time, begin, change, duration) {
    return -change * (time = time / duration) * (time - 2) + begin;
}
//# sourceMappingURL=DecelerateOperator.js.map
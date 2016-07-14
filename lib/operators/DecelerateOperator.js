'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DecelerateSubscriber = exports.DecelerateOperator = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Subscriber = require('rxjs/Subscriber');

var _DeltaOperator = require('./DeltaOperator');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DecelerateOperator = exports.DecelerateOperator = function () {
    function DecelerateOperator(u, normalForce, scheduler) {
        _classCallCheck(this, DecelerateOperator);

        this.u = u;
        this.normalForce = normalForce;
        this.scheduler = scheduler;
    }

    _createClass(DecelerateOperator, [{
        key: 'call',
        value: function call(subscriber, source) {
            return source._subscribe(new DecelerateSubscriber(subscriber, this.u, this.normalForce, this.scheduler));
        }
    }]);

    return DecelerateOperator;
}();

var DecelerateSubscriber = exports.DecelerateSubscriber = function (_DeltaSubscriber) {
    _inherits(DecelerateSubscriber, _DeltaSubscriber);

    function DecelerateSubscriber(destination, u, normalForce, scheduler) {
        _classCallCheck(this, DecelerateSubscriber);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DecelerateSubscriber).call(this, destination, null, scheduler));

        _this.u = u;
        _this.hasEvent = false;
        _this.scheduler = scheduler;
        _this.normalForce = normalForce;
        return _this;
    }

    _createClass(DecelerateSubscriber, [{
        key: 'next',
        value: function next(event) {
            _get(Object.getPrototypeOf(DecelerateSubscriber.prototype), 'next', this).call(this, (this.hasEvent = true) && event);
        }
    }, {
        key: 'complete',
        value: function complete() {

            if (!this.hasEvent) {
                return _get(Object.getPrototypeOf(DecelerateSubscriber.prototype), 'complete', this).call(this);
            }

            var u = this.u;
            var normalForce = this.normalForce;
            var prev = this.prev;
            var scheduler = this.scheduler;
            var interval = prev.interval;
            var magnitude = prev.magnitude;
            var direction = prev.direction;

            var duration = Math.sqrt(magnitude / interval / (normalForce * u));
            var distanceX = Math.cos(direction) * magnitude * duration;
            var distanceY = Math.sin(direction) * magnitude * duration;

            this.add(scheduler.schedule(DecelerateSubscriber.dispatch, 0, {
                time: scheduler.now(),
                start: prev, event: prev,
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
            var event = state.event;
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
                subscriber.next(state.event = _extends({}, event, {
                    time: now, pageX: pageX, pageY: pageY,
                    interval: now - event.time,
                    deltaX: pageX - event.pageX,
                    deltaY: pageY - event.pageY,
                    totalX: pageX - event.pageX + event.totalX,
                    totalY: pageY - event.pageY + event.totalY,
                    localX: easingFunc(elapsed, start.localX, distanceX, duration),
                    localY: easingFunc(elapsed, start.localY, distanceY, duration),
                    clientX: easingFunc(elapsed, start.clientX, distanceX, duration),
                    clientY: easingFunc(elapsed, start.clientY, distanceY, duration),
                    screenX: easingFunc(elapsed, start.screenX, distanceX, duration),
                    screenY: easingFunc(elapsed, start.screenY, distanceY, duration)
                }));
                this.schedule(state, 0);
            }
        }
    }]);

    return DecelerateSubscriber;
}(_DeltaOperator.DeltaSubscriber);

function quadOut(time, begin, change, duration) {
    return -change * (time = time / duration) * (time - 2) + begin;
}
//# sourceMappingURL=DecelerateOperator.js.map
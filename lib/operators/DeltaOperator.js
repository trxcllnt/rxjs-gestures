'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DeltaSubscriber = exports.DeltaOperator = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Subscriber2 = require('rxjs/Subscriber');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DeltaOperator = exports.DeltaOperator = function () {
    function DeltaOperator(point, scheduler) {
        _classCallCheck(this, DeltaOperator);

        this.point = point;
        this.scheduler = scheduler;
    }

    _createClass(DeltaOperator, [{
        key: 'call',
        value: function call(subscriber, source) {
            return source._subscribe(new DeltaSubscriber(subscriber, this.point, this.scheduler));
        }
    }]);

    return DeltaOperator;
}();

var DeltaSubscriber = exports.DeltaSubscriber = function (_Subscriber) {
    _inherits(DeltaSubscriber, _Subscriber);

    function DeltaSubscriber(subscriber, point, scheduler) {
        _classCallCheck(this, DeltaSubscriber);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DeltaSubscriber).call(this, subscriber));

        _this.prev = point;
        _this.time = scheduler.now();
        _this.scheduler = scheduler;
        return _this;
    }

    _createClass(DeltaSubscriber, [{
        key: '_next',
        value: function _next(curr) {
            var time = this.time;
            var prev = this.prev;
            var scheduler = this.scheduler;


            this.prev = curr;
            this.time = scheduler.now();
            var interval = this.time - time;

            if (prev) {
                var originX = prev.originX;
                var originY = prev.originY;
                var prevX = prev.pageX;
                var prevY = prev.pageY;
                var currX = curr.pageX;
                var currY = curr.pageY;


                var now = scheduler.now();
                var deltaX = currX - prevX;
                var deltaY = currY - prevY;
                var totalX = deltaX + prev.totalX;
                var totalY = deltaY + prev.totalY;
                var direction = Math.atan2(deltaY / interval, deltaX / interval);
                var magnitude = Math.abs(Math.sqrt(Math.pow(currX, 2) + Math.pow(currY, 2)) - Math.sqrt(Math.pow(prevX, 2) + Math.pow(prevY, 2)));

                curr.deltaX = deltaX;
                curr.deltaY = deltaY;
                curr.totalX = totalX;
                curr.totalY = totalY;
                curr.originX = originX;
                curr.originY = originY;

                curr.time = now;
                curr.interval = interval;
                curr.magnitude = magnitude;
                curr.direction = direction;
            } else {
                curr.time = this.time;
                curr.interval = interval;
            }

            _get(Object.getPrototypeOf(DeltaSubscriber.prototype), '_next', this).call(this, curr);
        }
    }]);

    return DeltaSubscriber;
}(_Subscriber2.Subscriber);
//# sourceMappingURL=DeltaOperator.js.map
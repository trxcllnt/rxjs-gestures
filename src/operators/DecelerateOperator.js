import { Subscriber } from 'rxjs';

export class DecelerateOperator {
    constructor(u, normalForce, scheduler) {
        this.u = u;
        this.normalForce = normalForce;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source._subscribe(new DecelerateSubscriber(
            subscriber, this.u, this.normalForce, this.scheduler
        ));
    }
}

export class DecelerateSubscriber extends Subscriber {
    constructor(destination, u, normalForce, scheduler) {
        super(destination, null, scheduler);
        this.u = u;
        this.point = null;
        this.hasPoint = false;
        this.scheduler = scheduler;
        this.normalForce = normalForce;
    }
    _next(point) {
        super._next((this.hasPoint = true) && (this.point = point));
    }
    _complete() {

        if (!this.hasPoint) {
            return super._complete();
        }

        const { u, normalForce, point, scheduler } = this;
        const { deltaT, magnitude = 0, direction } = point;
        const duration = Math.sqrt((magnitude / deltaT) / (normalForce * u));
        const distanceX = Math.cos(direction) * magnitude * duration;
        const distanceY = Math.sin(direction) * magnitude * duration;

        this.add(scheduler.schedule(DecelerateSubscriber.dispatch, 0, {
            time: scheduler.now(),
            point, start: point,
            duration: duration * 100,
            subscriber: this.destination,
            distanceX, distanceY, scheduler,
        }));
    }
    static dispatch(state) {

        let { time, start, point,
              scheduler, subscriber,
              distanceX, distanceY, duration } = state;

        const now = scheduler.now();
        const elapsed = now - time;

        if (elapsed > duration) {
            subscriber.complete();
        } else {

            const easingFunc = quadOut;
            const pageX = easingFunc(elapsed, start.pageX, distanceX, duration);
            const pageY = easingFunc(elapsed, start.pageY, distanceY, duration);
            const targetPageX = easingFunc(elapsed, start.targetPageX, distanceX, duration);
            const targetPageY = easingFunc(elapsed, start.targetPageY, distanceX, duration);

            point = point.clone();

            point.deltaT = now - point.time;
            point.deltaX = pageX - point.pageX;
            point.deltaY = pageY - point.pageY;
            point.deltaXTotal = point.deltaX + point.deltaXTotal;
            point.deltaYTotal = point.deltaY + point.deltaYTotal;
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
}

function quadOut(time, begin, change, duration) {
    return -change * (time = time / duration) * (time - 2) + begin;
}

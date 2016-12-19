import { Subscriber } from 'rxjs/Subscriber';

export class DecelerateOperator {
    constructor(u, speedLimit, scheduler) {
        if (u === 0) { u = 100; }
        if (u < 0) { u = Math.abs(u); }
        if (u > 100) {
            u /= Math.pow(10, Math.ceil(Math.log10(u))) * 100;
        }
        this.u = u / 100;
        this.scheduler = scheduler;
        this.speedLimit = Math.abs(speedLimit);
    }
    call(subscriber, source) {
        return source.subscribe(new DecelerateSubscriber(
            subscriber, this.u, this.speedLimit, this.scheduler
        ));
    }
}

export class DecelerateSubscriber extends Subscriber {
    constructor(destination, u, speedLimit, scheduler) {
        super(destination, null, scheduler);
        this.u = u;
        this.point = null;
        this.hasPoint = false;
        this.scheduler = scheduler;
        this.speedLimit = speedLimit;
    }
    _next(point) {
        super._next((this.hasPoint = true) && (this.point = point));
    }
    _complete() {

        if (!this.hasPoint) {
            return super._complete();
        }

        const { u, point, speedLimit, scheduler } = this;
        const { index = 0, movementT = 1, direction } = point;

        if (!index || index <= 0) {
            return super._complete();
        }

        const time = scheduler.now();

        if (time - point.time >= 25) {
            super._next(point.clone({ speed: 0 }));
            return super._complete();
        }

        const speed = Math.min(speedLimit, point.speed) || 0;
        const duration = 1000 * (speed / (9.8 /*normalForce*/ * u)) || 0;

        if (!duration || duration <= 0) {
            return super._complete();
        }

        const distanceX = Math.cos(direction) * speed * duration;
        const distanceY = Math.sin(direction) * speed * duration;

        this.unsubscribe();
        this.closed = this.isStopped = false;
        this.add(scheduler.schedule(DecelerateSubscriber.dispatch, 0, {
            start: point,
            time, point, duration,
            subscriber: this.destination,
            distanceX, distanceY, scheduler,
        }));
    }
    static dispatch(state) {

        let { time, start, point,
              scheduler, subscriber,
              distanceX, distanceY, duration } = state;

        const easingFunc = quadOut;
        const now = scheduler.now();
        const elapsed = Math.min(now - time, duration);
        const pageX = easingFunc(elapsed, start.pageX, distanceX, duration);
        const pageY = easingFunc(elapsed, start.pageY, distanceY, duration);

        point = point.clone();

        point.movementT = now - point.time;
        point.movementX = pageX - point.pageX;
        point.movementY = pageY - point.pageY;
        point.movementXTotal = point.movementX + point.movementXTotal;
        point.movementYTotal = point.movementY + point.movementYTotal;
        point.x = easingFunc(elapsed, start.x, distanceX, duration);
        point.y = easingFunc(elapsed, start.y, distanceY, duration);
        point.speed = easingFunc(elapsed, start.speed, - start.speed, duration);
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

        if (elapsed >= duration) {
            subscriber.complete();
        } else {
            this.schedule(state, 0);
        }
    }
}

function quadOut(time, begin, change, duration) {
    return -change * (time = time / duration) * (time - 2) + begin;
}

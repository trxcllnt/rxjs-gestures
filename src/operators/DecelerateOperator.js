import { Subscriber } from 'rxjs';
import { DeltaSubscriber } from './DeltaOperator';

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

export class DecelerateSubscriber extends DeltaSubscriber {
    constructor(destination, u, normalForce, scheduler) {
        super(destination, null, scheduler);
        this.u = u;
        this.hasEvent = false;
        this.scheduler = scheduler;
        this.normalForce = normalForce;
    }
    next(event) {
        super.next((this.hasEvent = true) && event);
    }
    complete() {

        if (!this.hasEvent) {
            return super.complete();
        }

        const { u, normalForce, prev, scheduler } = this;
        const { interval, magnitude, direction } = prev;
        const duration = Math.sqrt((magnitude / interval) / (normalForce * u));
        const distanceX = Math.cos(direction) * magnitude * duration;
        const distanceY = Math.sin(direction) * magnitude * duration;

        this.add(scheduler.schedule(DecelerateSubscriber.dispatch, 0, {
            time: scheduler.now(),
            start: prev, event: prev,
            duration: duration * 100,
            subscriber: this.destination,
            distanceX, distanceY, scheduler,
        }));
    }
    static dispatch(state) {

        const { time, start, event,
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
            subscriber.next(state.event = {
                ...event,
                time: now, pageX, pageY,
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
                screenY: easingFunc(elapsed, start.screenY, distanceY, duration),
            });
            this.schedule(state, 0);
        }
    }
}

function quadOut(time, begin, change, duration) {
    return -change * (time = time / duration) * (time - 2) + begin;
}

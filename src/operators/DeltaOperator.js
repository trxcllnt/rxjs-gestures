import { Subscriber } from 'rxjs/Subscriber';

export class DeltaOperator {
    constructor(point, scheduler) {
        this.point = point;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source._subscribe(new DeltaSubscriber(subscriber, this.point, this.scheduler));
    }
}

export class DeltaSubscriber extends Subscriber {
    constructor(subscriber, point, scheduler) {
        super(subscriber);
        this.prev = point;
        this.time = scheduler.now();
        this.scheduler = scheduler;
    }
    _next(curr) {

        const { time, prev, scheduler } = this;

        this.prev = curr;
        this.time = scheduler.now();
        const interval = this.time - time;

        if (prev) {

            const { originX, originY,
                    pageX: prevX, pageY: prevY } = prev;
            const { pageX: currX, pageY: currY } = curr;

            const now = scheduler.now();
            const deltaX = currX - prevX;
            const deltaY = currY - prevY;
            const totalX = deltaX + prev.totalX;
            const totalY = deltaY + prev.totalY;
            const direction = Math.atan2(deltaY / interval, deltaX / interval);
            const magnitude = Math.abs(
                Math.sqrt(Math.pow(currX, 2) + Math.pow(currY, 2)) -
                Math.sqrt(Math.pow(prevX, 2) + Math.pow(prevY, 2))
            );

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

        super._next(curr);
    }
}

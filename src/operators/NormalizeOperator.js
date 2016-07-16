import { Point } from '../support';
import { Subscriber } from 'rxjs';

export class NormalizeOperator {
    constructor(origin, Gestures, scheduler) {
        this.origin = origin || undefined;
        this.Gestures = Gestures;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source._subscribe(new NormalizeSubscriber(subscriber, this.origin, this.Gestures, this.scheduler));
    }
}

export class NormalizeSubscriber extends Subscriber {
    constructor(subscriber, origin, Gestures, scheduler) {
        super(subscriber);
        this.origin = origin;
        this.previous = origin;
        this.Gestures = Gestures;
        this.scheduler = scheduler;
    }
    _next(multitouchEvent) {

        if (multitouchEvent instanceof Point) {
            return super._next(this.previous = multitouchEvent);
        }

        let { origin } = this;
        const time = this.scheduler.now();

        const { event, touch, target,
                pageX, pageY, clientX, clientY, screenX, screenY,
                radiusX = 1, radiusY = 1, rotationAngle = 0 } = multitouchEvent;

        if (!origin) {
            this.origin = origin = NormalizeSubscriber.createOrigin(
                multitouchEvent, touch, time, this.Gestures
            );
        }

        const { previous = origin } = this;
        const { pageX: prevX, pageY: prevY } = previous;

        const deltaX = pageX - prevX;
        const deltaY = pageY - prevY;
        const deltaT = time - previous.time;
        const deltaXTotal = deltaX + previous.deltaXTotal;
        const deltaYTotal = deltaY + previous.deltaYTotal;
        const direction = Math.atan2(deltaY / deltaT, deltaX / deltaT) || 0;
        const magnitude = Math.abs(
            Math.sqrt(Math.pow(pageX, 2) + Math.pow(pageY, 2)) -
            Math.sqrt(Math.pow(prevX, 2) + Math.pow(prevY, 2))
        );

        const point = origin.clone();

        point.time = time;
        point.touch = touch;
        point.event = event;
        point.pageX = pageX;
        point.pageY = pageY;
        point.deltaT = deltaT;
        point.deltaX = deltaX;
        point.deltaY = deltaY;
        point.clientX = clientX;
        point.clientY = clientY;
        point.screenX = screenX;
        point.screenY = screenY;
        point.radiusX = radiusX;
        point.radiusY = radiusY;
        point.magnitude = magnitude;
        point.direction = direction;
        point.deltaXTotal = deltaXTotal;
        point.deltaYTotal = deltaYTotal;
        point.rotationAngle = rotationAngle;

        point.targetX += deltaXTotal;
        point.targetY += deltaYTotal;
        point.targetPageX += deltaXTotal;
        point.targetPageY += deltaYTotal;
        point.targetClientX += deltaXTotal;
        point.targetClientY += deltaYTotal;
        point.targetScreenX += deltaXTotal;
        point.targetScreenY += deltaYTotal;

        super._next(this.previous = point);
    }
    static createOrigin(event, touch, time, Gestures) {

        const { identifier } = touch;
        const { topLevelElement } = Gestures;
        const { target, pageX, pageY,
                clientX, clientY, screenX, screenY,
                radiusX = 1, radiusY = 1, rotationAngle = 0 } = event;
        const { offsetParent = topLevelElement,
                offsetLeft, offsetTop, scrollTop, scrollLeft } = target;
        const { top: targetTop, left: targetLeft } = target.getBoundingClientRect();
        const { top: parentTop, left: parentLeft } = offsetParent.getBoundingClientRect();

        const x = clientX - targetLeft - scrollLeft;
        const y = clientY - targetTop - scrollTop;
        const targetPageX = targetLeft - scrollLeft + topLevelElement.pageXOffset;
        const targetPageY = targetTop - scrollTop + topLevelElement.pageYOffset;
        const targetX = targetLeft - parentLeft - offsetLeft - scrollLeft;
        const targetY = targetTop - parentTop - offsetTop - scrollTop;
        const targetClientX = targetLeft - scrollLeft;
        const targetClientY = targetTop - scrollTop;
        const targetScreenX = (screenX - clientX) + targetLeft - scrollLeft;
        const targetScreenY = (screenY - clientY) + targetTop - scrollTop;

        const origin = new Point(time, null, null, target, identifier,
                                 radiusX, radiusY, rotationAngle,
                                 x, y,
                                 pageX, pageY,
                                 clientX, clientY,
                                 screenX, screenY,
                                 targetX, targetY,
                                 targetPageX, targetPageY,
                                 targetClientX, targetClientY,
                                 targetScreenX, targetScreenY);
        origin.xOrigin = origin.x;
        origin.yOrigin = origin.y;
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
}

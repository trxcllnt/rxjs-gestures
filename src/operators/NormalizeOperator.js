import { Point } from '../support';
import { Subscriber } from 'rxjs/Subscriber';

export class NormalizeOperator {
    constructor(origin, Gestures, scheduler) {
        this.origin = origin || undefined;
        this.Gestures = Gestures;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source.subscribe(new NormalizeSubscriber(subscriber, this.origin, this.Gestures, this.scheduler));
    }
}

export class NormalizeSubscriber extends Subscriber {
    constructor(subscriber, origin, Gestures, scheduler) {
        super(subscriber);
        this.origin = origin;
        this.previous = origin;
        this.Gestures = Gestures;
        this.scheduler = scheduler;
        this.sampleX = 0;
        this.sampleY = 0;
        this.sampleT = scheduler.now();
    }
    _next(multitouchEvent) {

        if (multitouchEvent instanceof Point) {
            return super._next(this.previous = multitouchEvent);
        }

        const time = this.scheduler.now();
        let { origin, lastWindowTime } = this;
        const { type, index, event, touch, target, screenX, screenY,
                pageX, pageY, clientX, clientY, deltaX, deltaY, deltaZ,
                button, buttons, radiusX = 1, radiusY = 1, rotationAngle = 0 } = multitouchEvent;

        if (!origin) {
            this.origin = origin = NormalizeSubscriber.createOrigin(
                multitouchEvent, touch, time, this.Gestures
            );
        }

        const { previous = origin } = this;
        const { pageX: prevX, pageY: prevY } = previous;

        const movementX = pageX - prevX;
        const movementY = pageY - prevY;
        const movementT = time - previous.time;
        const movementXTotal = movementX + previous.movementXTotal;
        const movementYTotal = movementY + previous.movementYTotal;
        const movementTTotal = movementT + previous.movementTTotal;

        const sampleTTotal = time - this.sampleT;
        const sampleXTotal = pageX - this.sampleX;
        const sampleYTotal = pageY - this.sampleY;

        if (sampleTTotal >= 100) {
            this.sampleT = time;
            this.sampleX = pageX;
            this.sampleY = pageY;
        }

        const distance = Math.sqrt(sampleXTotal * sampleXTotal + sampleYTotal * sampleYTotal) || 0;
        const speed = Math.sqrt((distance / (sampleTTotal || 1)) / 5) || 0;
        const direction = Math.atan2(movementY / movementT, movementX / movementT) || 0;

        const point = origin.clone();

        point.type = type;
        point.time = time;
        point.index = index;
        point.touch = touch;
        point.event = event;
        point.pageX = pageX;
        point.pageY = pageY;
        point.button = button;
        point.buttons = buttons;
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

        super._next(this.previous = point);
    }
    static createOrigin(event, touch, time, Gestures) {

        const { identifier } = touch;
        const { topLevelElement } = Gestures;
        const { type, target, pageX, pageY,
                clientX, clientY, screenX, screenY,
                radiusX = 1, radiusY = 1, rotationAngle = 0 } = event;

        const { scrollTop, scrollLeft } = target;
        const parent = target.offsetParent || target.parentNode || topLevelElement;

        const { top: targetTop, left: targetLeft,
                right: targetRight, bottom: targetBottom } = target.getBoundingClientRect();

        const { top: parentTop, left: parentLeft,
                right: parentRight, bottom: parentBottom } = parent.getBoundingClientRect();

        let { offsetLeft, offsetTop } = target;
        ('ownerSVGElement' in target) && (
            { x: offsetLeft, y: offsetTop } = target.getBBox());

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
        origin.type = type;
        origin.origin = origin;
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
}

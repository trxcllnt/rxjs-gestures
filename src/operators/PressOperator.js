import { selectId } from '../support';
import { Subscriber } from 'rxjs';

export class PressOperator {
    constructor(delay, radius, Gestures) {
        this.delay = delay;
        this.radius = radius;
        this.Gestures = Gestures;
    }
    call(subscriber, source) {
        return source._subscribe(new PressSubscriber(subscriber,
                                                     this.delay,
                                                     this.radius,
                                                     this.Gestures));
    }
}

export class PressSubscriber extends Subscriber {
    constructor(destination, delay, radius, Gestures) {
        super(destination);
        this.delay = delay;
        this.radius = radius;
        this.Gestures = Gestures;
    }
    _next(starts) {

        const { delay, radius, Gestures } = this;
        const { topLevelElement } = Gestures;
        const { key } = starts;
        const isMouse = key === 'mouse';
        const selectPoint = isMouse ? null : selectId(key);

        const moves = isMouse ?
            Gestures.move(topLevelElement) :
            Gestures.move(topLevelElement).filter(selectPoint);

        const ends = isMouse ?
            Gestures.end(topLevelElement) :
            Gestures.end(topLevelElement).filter(selectPoint);

        const cancels = isMouse ?
            Gestures.cancel(topLevelElement) :
            Gestures.cancel(topLevelElement).filter(selectPoint);

        super._next(Gestures.press(starts, delay, radius, moves, ends, cancels));
    }
}

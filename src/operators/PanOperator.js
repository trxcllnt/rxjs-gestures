import { selectId } from '../support';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
// import { MergeAllSubscriber } from 'rxjs/operator/mergeAll';

export class PanOperator {
    constructor(delay, radius, Gestures) {
        this.delay = delay;
        this.radius = radius;
        this.Gestures = Gestures;
    }
    call(subscriber, source) {
        return source._subscribe(new PanSubscriber(subscriber,
                                                   this.delay,
                                                   this.radius,
                                                   this.Gestures));
    }
}

export class PanSubscriber extends Subscriber {
// export class PanSubscriber extends MergeAllSubscriber {
    constructor(destination, delay, radius, Gestures) {
        super(destination);
        // super(destination, Number.POSITIVE_INFINITY);
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

        const presses = Gestures.press(starts, delay, radius, moves, ends, cancels);

        super._next(Gestures.pan(presses, delay, radius, moves, ends, cancels));
    }
}

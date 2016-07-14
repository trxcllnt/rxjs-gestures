import { selectId } from '../support';
import { Observable, Subscriber } from 'rxjs';
// import { MergeAllSubscriber } from 'rxjs/operator/mergeAll';

export class TapOperator {
    constructor(timeout, radius, Gestures) {
        this.timeout = timeout;
        this.radius = radius;
        this.Gestures = Gestures;
    }
    call(subscriber, source) {
        return source._subscribe(new TapSubscriber(subscriber,
                                                   this.timeout,
                                                   this.radius,
                                                   this.Gestures));
    }
}

export class TapSubscriber extends Subscriber {
// export class TapSubscriber extends MergeAllSubscriber {
    constructor(destination, timeout, radius, Gestures) {
        super(destination);
        // super(destination, Number.POSITIVE_INFINITY);
        this.timeout = timeout;
        this.radius = radius;
        this.Gestures = Gestures;
    }
    _next(starts) {

        const { timeout, radius, Gestures } = this;
        const { topLevelElement } = Gestures;

        const { key } = starts;
        const isMouse = key === 'mouse';
        const selectPoint = isMouse ? null : selectId(key);

        const ends = isMouse ?
            Gestures.end(topLevelElement) :
            Gestures.end(topLevelElement).filter(selectPoint);

        const cancels = isMouse ?
            Gestures.cancel(topLevelElement) :
            Gestures.cancel(topLevelElement).filter(selectPoint);

        super._next(Gestures.tap(starts, timeout, radius, ends, cancels));
    }
}

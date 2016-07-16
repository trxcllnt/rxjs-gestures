import { Subscriber } from 'rxjs';

export class StopPropagationOperator {
    constructor(immediate = false) {
        this.immediate = immediate;
    }
    call(subscriber, source) {
        return source._subscribe(new StopPropagationSubscriber(subscriber, this.immediate));
    }
}

class StopPropagationSubscriber extends Subscriber  {
    constructor(destination, immediate) {
        super(destination);
        this.immediate = immediate;
    }
    _next(maybeNormalized) {
        const { event = maybeNormalized } = maybeNormalized;
        if (!this.immediate) {
            event.stopPropagation(); } else {
            event.stopImmediatePropagation(); }
        super._next(maybeNormalized);
    }
}

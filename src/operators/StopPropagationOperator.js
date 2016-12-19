import { Subscriber } from 'rxjs/Subscriber';

export class StopPropagationOperator {
    constructor(immediate = false) {
        this.immediate = immediate;
    }
    call(subscriber, source) {
        return source.subscribe(new StopPropagationSubscriber(subscriber, this.immediate));
    }
}

class StopPropagationSubscriber extends Subscriber  {
    constructor(destination, immediate) {
        super(destination);
        this.immediate = immediate;
    }
    _next(maybeNormalized) {
        let { event = maybeNormalized } = maybeNormalized;
        if (event) {
            if (this.immediate) {
                // handle React events, which don't proxy the `stopImmediatePropagation` function
                if (typeof event.stopImmediatePropagation === 'function') {
                    event.stopImmediatePropagation();
                } else if (event.nativeEvent && (
                           typeof event.nativeEvent.stopImmediatePropagation == 'function')) {
                    event.nativeEvent.stopImmediatePropagation();
                } else if (typeof event.stopPropagation === 'function') {
                    event.stopPropagation();
                }
            } else if (typeof event.stopPropagation === 'function') {
                event.stopPropagation();
            }
        }
        super._next(maybeNormalized);
    }
}

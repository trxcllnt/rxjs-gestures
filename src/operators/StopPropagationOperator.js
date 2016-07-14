import { Subscriber } from 'rxjs/Subscriber';

export class StopPropagationOperator {
    constructor(immediate = false) {
        this.immediate = immediate;
    }
    call(subscriber, source) {
        return source._subscribe(new StopPropagationSubscriber(subscriber, this.immediate));
    }
}

class StopPropagationSubscriber extends Subscriber  {
    _next(normalizedEvent) {
        const { event } = normalizedEvent;
        !this.immediate ?
            event.stopPropagation() :
            event.stopImmediatePropagation();
        super._next(normalizedEvent);
    }
}

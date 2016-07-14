import { Subscriber } from 'rxjs';

export class PreventDefaultOperator {
    call(subscriber, source) {
        return source._subscribe(new PreventDefaultSubscriber(subscriber));
    }
}

class PreventDefaultSubscriber extends Subscriber  {
    _next(normalizedEvent) {
        const { event } = normalizedEvent;
        event.preventDefault();
        super._next(normalizedEvent);
    }
}

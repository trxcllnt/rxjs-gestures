import { Subscriber } from 'rxjs';

export class PreventDefaultOperator {
    call(subscriber, source) {
        return source._subscribe(new PreventDefaultSubscriber(subscriber));
    }
}

class PreventDefaultSubscriber extends Subscriber  {
    _next(maybeNormalized) {
        const { event = maybeNormalized } = maybeNormalized;
        event && event.preventDefault && event.preventDefault();
        super._next(maybeNormalized);
    }
}

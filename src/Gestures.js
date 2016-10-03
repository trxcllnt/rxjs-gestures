import $$observable from 'symbol-observable';
import { Subject, Scheduler, Observable } from 'rxjs';
import { epsilon, selectId } from './support';
import { TapOperator, PanOperator,
         NormalizeOperator, PressOperator,
         MultitouchOperator, DecelerateOperator,
         PreventDefaultOperator, StopPropagationOperator } from './operators';

const mouseEvents = {
    start: 'mousedown', end: 'mouseup',
    move: 'mousemove', cancel: 'mouseleave',
    wheel: 'wheel', mousewheel: 'mousewheel',
};

const touchEvents = {
    start: 'touchstart', end: 'touchend',
    move: 'touchmove', cancel: 'touchcancel'
};

function identity(x){ return x; }
function getIdentifier({ identifier }){ return identifier || 'mouse'; }
function getTopLevelElement() {
    return typeof window !== 'undefined' ?
        window : typeof document !== 'undefined' ?
            document : global;
}

export function install(topLevelElement = getTopLevelElement()) {
    return class InstalledGestures extends Gestures {
        static topLevelElement = topLevelElement;
    }
}

export class Gestures extends Observable {
    static topLevelElement = getTopLevelElement();
    constructor(target, ...events) {
        if (!target || typeof target === 'function' || typeof target !== 'object') {
            super(target);
        } else if (typeof target[$$observable] === 'function') {
            super();
            this.source = target[$$observable]();
        } else if (events.length === 1) {
            super();
            this.source = Observable.fromEvent(target, event[0]);
        } else {
            super();
            this.source = Observable.merge(...events.map((event) =>
                Observable.fromEvent(target, event)
            ));
        }
    }
    static from(...args) {
        return new Gestures(...args);
    }
    lift(operator) {
        const observable = new this.constructor(this);
        observable.operator = operator;
        return observable;
    }
    preventDefault() {
        return this.lift(new PreventDefaultOperator());
    }
    stopPropagation(immediate = false) {
        return this.lift(new StopPropagationOperator(immediate));
    }
    decelerate(coefficientOfFriction = 0.25, normalForce = 9.8, scheduler = Scheduler.animationFrame) {
        return this.lift(new DecelerateOperator(coefficientOfFriction, normalForce, scheduler));
    }
    inside({ x: radiusX, y: radiusY }) {
        return this.filter(({ movementXTotal, movementYTotal }) => !epsilon(
            radiusX, radiusY, movementXTotal, movementYTotal
        ));
    }
    outside({ x: radiusX, y: radiusY }) {
        return this.filter(({ movementXTotal, movementYTotal }) => epsilon(
            radiusX, radiusY, movementXTotal, movementYTotal
        ));
    }
    normalize(origin, Gestures_ = Gestures, scheduler = Scheduler.animationFrame) {
        return this.lift(new NormalizeOperator(origin, Gestures_, scheduler));
    }
    static startsById(target = this.topLevelElement) {
        return this.start(target).groupBy(getIdentifier);
    }
    static start(target = this.topLevelElement) {
        return new this(target, mouseEvents.start, touchEvents.start).lift(new MultitouchOperator());
    }
    static move(target = this.topLevelElement) {
        return new this(target, mouseEvents.move, touchEvents.move).lift(new MultitouchOperator());
    }
    static end(target = this.topLevelElement) {
        return new this(target, mouseEvents.end, touchEvents.end).lift(new MultitouchOperator());
    }
    static cancel(target = this.topLevelElement) {
        return new this(target, mouseEvents.cancel, touchEvents.cancel).lift(new MultitouchOperator());
    }
    static tap(target = this.topLevelElement, timeout = 250, radius = { x: 10, y: 10 }, ends/*OrInputs*/ = 1, cancels) {
        if (arguments.length <= 4) {
            return (this
                .startsById(target)
                .lift(new TapOperator(timeout, radius, this))
            );
        }
        return (new this(target)
            .preventDefault()
            .normalize(null, this)
            .mergeMap((start) => ends
                .preventDefault()
                .normalize(start, this)
                .inside(radius)
                .timeoutWith(timeout, Observable.empty())
            )
            .takeUntil(cancels)
            .take(1)
        );
    }
    static press(target = this.topLevelElement, delay = 0, radius = { x: 10, y: 10 }, moves/*OrInputs*/ = 1, ends, cancels) {
        if (arguments.length <= 4) {
            return this
                .startsById(target)
                .lift(new PressOperator(delay, radius, this));
        } else if (delay <= 0) {
            return (new this(target)
                .normalize(null, this)
                .take(1)
            );
        }
        return (new this(target)
            .preventDefault()
            .normalize(null, this)
            .mergeMap((start) => Observable
                .timer(delay)
                .withLatestFrom(moves
                    .normalize(start, this)
                    .startWith(start), (i, move) => move)
                .takeUntil(ends
                    .merge(cancels)
                    .merge(moves
                        .normalize(start, this)
                        .outside(radius)))
            )
            .take(1)
        );
    }
    static pan(target = this.topLevelElement, delay = 0, radius = { x: 10, y: 10 }, moves/*OrInputs*/ = 1, ends, cancels) {
        if (arguments.length <= 4) {
            return this
                .startsById(target)
                .lift(new PanOperator(delay, radius, this));
        }
        return (new this(target)
            .preventDefault()
            .mergeMap((start) => moves
                .normalize(start, this)
                .startWith(start))
            .takeUntil(ends.merge(cancels))
        );
    }
}

export default Gestures;

import $$observable from 'symbol-observable';
import { epsilon, selectId } from './support';
import { Scheduler, Observable, ReplaySubject } from 'rxjs';
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
function getReplaySubject1() { return new ReplaySubject(1); }
function getTopLevelElement() {
    return typeof window !== 'undefined' ?
        window : typeof document !== 'undefined' ?
            document : global;
}

export function install(topLevelElement = getTopLevelElement()) {
    return wrapStaticObservableMethods(
        Observable,
        class InstalledGestures extends Gestures {
            static topLevelElement = topLevelElement;
            lift(operator) {
                const observable = new InstalledGestures(this);
                observable.operator = operator;
                return observable;
            }
        });
}

class Gestures extends Observable {
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
    lift(operator) {
        const observable = new Gestures(this);
        observable.operator = operator;
        return observable;
    }
    preventDefault() {
        return this.lift(new PreventDefaultOperator());
    }
    stopPropagation(immediate = false) {
        return this.lift(new StopPropagationOperator(immediate));
    }
    decelerate(coefficientOfFriction = 25, speedLimit = 200, scheduler = Scheduler.animationFrame) {
        return this.lift(new DecelerateOperator(coefficientOfFriction, speedLimit, scheduler));
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
    normalize(origin, Gestures_ = this.constructor, scheduler = Scheduler.animationFrame) {
        return this.lift(new NormalizeOperator(origin, Gestures_, scheduler));
    }
    static startsById(target = this.topLevelElement, inputs = 1) {
        return this
            .start(target)
            .groupBy(getIdentifier, null, null, getReplaySubject1)
            .take(inputs);
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
    static tap(target = this.topLevelElement, {
                   inputs = 1, timeout = 250,
                   radius = { x: 10, y: 10 }
               } = {}, ends, cancels) {

        if (arguments.length <= 2) {
            return (this
                .startsById(target, inputs)
                .lift(new TapOperator(timeout, radius, this))
            );
        }

        ends = (ends instanceof this) && ends || new this(ends);
        target = (target instanceof this) && target || new this(target);

        return target
            .preventDefault()
            .normalize(null, this)
            .mergeMap((start) => ends
                .preventDefault()
                .normalize(start, this)
                .inside(radius)
                .timeoutWith(timeout, Observable.empty())
            )
            .takeUntil(cancels)
            .take(1);
    }
    static press(target = this.topLevelElement, {
                     inputs = 1, delay = 0,
                     radius = { x: 10, y: 10 }
                 } = {}, moves, ends, cancels) {
        if (arguments.length <= 2) {
            return (this
                .startsById(target, inputs)
                .lift(new PressOperator(delay, radius, this))
            );
        }

        target = (target instanceof this) && target || new this(target);

        if (delay <= 0) {
            return target
                .normalize(null, this)
                .take(1);
        }

        moves = (moves instanceof this) && moves || new this(moves);

        return target
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
            .take(1);
    }
    static pan(target = this.topLevelElement, {
                   inputs = 1, delay = 0,
                   radius = { x: 10, y: 10 },
               } = {}, moves, ends, cancels) {
        if (arguments.length <= 2) {
            return this
                .startsById(target, inputs)
                .lift(new PanOperator(delay, radius, this))
        }
        ends = (ends instanceof this) && ends || new this(ends);
        moves = (moves instanceof this) && moves || new this(moves);
        target = (target instanceof this) && target || new this(target);
        return target
            .preventDefault()
            .mergeMap((start) => moves
                .merge(ends)
                .normalize(start, this)
                .startWith(start))
            .takeUntil(ends.merge(cancels));
    }
}

Gestures = wrapStaticObservableMethods(Observable, Gestures);

export { Gestures };
export default Gestures;

function wrapStaticObservableMethods(Observable, Gestures) {
    function createStaticWrapper(staticMethodName) {
        return function(...args) {
            return new Gestures(Observable[staticMethodName](...args));
        }
    }
    for (const staticMethodName in Observable) {
        Gestures[staticMethodName] = createStaticWrapper(staticMethodName);
    }
    Gestures.bindCallback = (...args) => (...args2) => new Gestures(Observable.bindCallback(...args)(...args2));
    Gestures.bindNodeCallback = (...args) => (...args2) => new Gestures(Observable.bindNodeCallback(...args)(...args2));
    return Gestures;
}

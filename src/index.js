import 'rxjs/add/operator/let';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/never';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/timeoutWith';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/timeInterval';
import 'rxjs/add/operator/withLatestFrom';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import $$observable from 'symbol-observable';
import { async } from 'rxjs/scheduler/async';
import { epsilon, selectId, normalize } from './support';
import { TapOperator, PanOperator,
         DeltaOperator, PressOperator,
         DecelerateOperator, PreventDefaultOperator,
         StopPropagationOperator } from './operators';

const mouseEvents = {
    start: 'mousedown', end: 'mouseup',
    move: 'mousemove', cancel: 'mouseleave',
    wheel: 'wheel',
};

const touchEvents = {
    start: 'touchstart', end: 'touchend',
    move: 'touchmove', cancel: 'touchcancel'
};

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
    delta(point, scheduler = async) {
        return this.lift(new DeltaOperator(point, scheduler));
    }
    decelerate(coefficientOfFriction = 0.25, normalForce = 9.8, scheduler = async) {
        return this.lift(new DecelerateOperator(coefficientOfFriction, normalForce, scheduler));
    }
    inside({ x: radiusX, y: radiusY }, point) {
        return this.delta(point).filter(({ totalX, totalY }) => !epsilon(
            radiusX, radiusY, totalX, totalY
        ));
    }
    outside({ x: radiusX, y: radiusY }, point) {
        return this.delta(point).filter(({ totalX, totalY }) => epsilon(
            radiusX, radiusY, totalX, totalY
        ));
    }
    static startsById(target = this.topLevelElement) {
        const { topLevelElement } = this;
        return this
            .start(target)
            .multicast(() => new Subject(), (starts) => Observable.merge(
                starts.take(1),
                starts.takeWhile(({ identifier }) => (
                    identifier !== 'mouse'
                ))
            ))
            .let(Gestures.from)
            .groupBy(getIdentifier, null, (starts) => this
                .race(this.end(topLevelElement), this.cancel(topLevelElement))
                .filter(selectId(starts.key))
            );
    }
    static start(target = this.topLevelElement) {
        return new this(target, mouseEvents.start, touchEvents.start).mergeMap(normalize);
    }
    static move(target = this.topLevelElement) {
        return new this(target, mouseEvents.move, touchEvents.move).mergeMap(normalize);
    }
    static end(target = this.topLevelElement) {
        return new this(target, mouseEvents.end, touchEvents.end).mergeMap(normalize);
    }
    static cancel(target = this.topLevelElement) {
        return new this(target, mouseEvents.cancel, touchEvents.cancel).mergeMap(normalize);
    }
    static tap(target = this.topLevelElement, timeout = 250, radius = { x: 10, y: 10 }, ends, cancels) {
        if (arguments.length <= 3) {
            return this.startsById(target).lift(new TapOperator(timeout, radius, this));
        }
        return new this(target).preventDefault().mergeMap((start) => ends
            .inside(radius, start)
            .map((end) => ({ ...end, type: start.type }))
            .timeoutWith(timeout, Observable.empty())
        )
        .takeUntil(cancels)
        .take(1);
    }
    static pan(target = this.topLevelElement, delay = 0, radius = { x: 10, y: 10 }, moves, ends, cancels) {
        if (arguments.length <= 3) {
            return this.startsById(target).lift(new PanOperator(delay, radius, this));
        }
        return new this(target)
            .preventDefault()
            .mergeMap((start) => moves.delta(start).startWith(start))
            .takeUntil(ends.merge(cancels));
    }
    static press(target = this.topLevelElement, delay = 0, radius = { x: 10, y: 10 }, moves, ends, cancels) {
        if (arguments.length <= 3) {
            return this.startsById(target).lift(new PressOperator(delay, radius, this));
        }
        return (delay <= 0 ? target : new this(target)
            .preventDefault().mergeMap((start) => Observable
                .timer(delay)
                .withLatestFrom(moves.startWith(start), (i, move) => ({
                    ...move, type: start.type
                }))
                .takeUntil(ends
                    .merge(cancels)
                    .merge(moves.outside(radius, start)))
            )
        )
        .take(1);
    }
}

function identity(x){ return x; }
function getIdentifier({ identifier }){ return identifier; }
function getTopLevelElement() {
    return typeof window !== 'undefined' ?
        window : typeof document !== 'undefined' ?
            document : global;
}

export { Gestures as default };

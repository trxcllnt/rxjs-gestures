import { Point } from '../support';
import { identity } from 'rxjs/util/identity';
import { MergeMapSubscriber } from 'rxjs/operators/mergeMap';

export class MultitouchOperator {
    call(subscriber, source) {
        return source.subscribe(new MultitouchSubscriber(subscriber));
    }
}

const degToRad = Math.PI / 180;

export class MultitouchSubscriber extends MergeMapSubscriber {
    constructor(destination) {
        super(destination, identity);
        this.index = 0;
    }
    _next(event) {

        if (event instanceof Point) {
            return this.notifyNext(event, event, ++this.index, 0);
        }

        const index = this.index++;
        const { type, button, buttons,
                currentTarget: target } = event;
        const isTouch = (type[0] === 't');

        if (!isTouch) {
            const { pageX, pageY, clientX, clientY, screenX, screenY } = event;
            this.notifyNext(event, {
                button, buttons,
                type, event, touch: event, target,
                index, pageX, pageY, screenX, screenY,
                clientX, clientY, radiusX: 1, radiusY: 1,
                identifier: 'mouse', rotationAngle: 0
            }, index, 0);
        } else {
            let touchesIndex = -1;
            const touches = event.changedTouches;
            const touchesLen = touches.length;
            while (++touchesIndex < touchesLen) {
                const touch = touches[touchesIndex];
                const { identifier, pageX, pageY,
                        screenX, screenY, clientX, clientY,
                        radiusX = 1, radiusY = 1, rotationAngle = 0 } = touch;
                this.notifyNext(event, {
                    button, buttons: 0,
                    type, event, touch, target, identifier,
                    index, pageX, pageY, screenX, screenY,
                    clientX, clientY, radiusX, radiusY,
                    rotationAngle: rotationAngle * degToRad
                }, index, touchesIndex);
            }
        }
    }
}

/*
// const changes = !isTouch ? [event] : Array.from(event.changedTouches);
// const targets = !isTouch ? changes : reduceTouches(event.targetTouches);
// const touches = !isTouch ? targets : changes.filter((touch) => (
//     targets.hasOwnProperty(touch.identifier)
// ));
function reduceTouches(touches) {
    return Array.from(touches).reduce((touches, touch) => ({
        ...touches, [touch.identifier]: touch
    }), {})
}
*/

import { Observable } from 'rxjs/Observable';

const degToRad = Math.PI / 180;

export function normalize(event) {

    const points = [];
    const { type, target } = event;
    const isTouch = (type[0] === 't');
    const { top, left } = target.getBoundingClientRect();
    const { clientTop, clientLeft, scrollTop, scrollLeft } = target;
    const touches = !isTouch ? [event] : Array.from(event.changedTouches);
    // const changes = !isTouch ? [event] : Array.from(event.changedTouches);
    // const targets = !isTouch ? changes : reduceTouches(event.targetTouches);
    // const touches = !isTouch ? targets : changes.filter((touch) => (
    //     targets.hasOwnProperty(touch.identifier)
    // ));

    let pointIdx = -1;
    const length = touches.length;

     while (++pointIdx < length) {
        const point = touches[pointIdx];
        const { clientX, clientY } = point;
        const localY = clientY - top - clientTop + scrollTop;
        const localX = clientX - left - clientLeft + scrollLeft;
        const { identifier = 'mouse',
                pageX, pageY, screenX, screenY,
                radiusX = 1, radiusY = 1, rotationAngle = 0 } = point;

        points[pointIdx] = {
            pageX, pageY, localX, localY,
            originX: localX, originY: localY,
            clientX, clientY, screenX, screenY,
            type, event, point, identifier, isTouch,
            deltaX: 0, deltaY: 0, totalX: 0, totalY: 0,
            radiusX, radiusY, radiusA: rotationAngle * degToRad
        };
    }

    return points;
}

function reduceTouches(touches) {
    return Array.from(touches).reduce((touches, touch) => ({
        ...touches, [touch.identifier]: touch
    }), {})
}

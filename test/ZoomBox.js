import React from 'react';
import { Gestures } from '../lib/index';
import { Observable } from 'rxjs';
import compose from 'recompose/compose';
import mapPropsStream from 'recompose/mapPropsStream';
import createEventHandler from 'recompose/createEventHandler';

function zoomGesture(starts) {
    return Gestures
        .tap(starts, { inputs: 2 })
        .combineAll()
        .repeat()
        .map((points, touches) => ({
            points,
            touches: touches + 1,
            targetX: undefined,
            targetY: undefined,
            targetWidth: undefined,
            targetHeight: undefined
        }))
        .startWith({});

        // .mergeMap(([pointsA, pointsB]) => pointsA.combineLatest(pointsB))
        // .map(([pointA, pointB]) => {
        //     const pointAX = pointA.targetXOrigin + pointA.targetXTotal;
        //     const pointBX = pointB.targetXOrigin + pointB.targetXTotal;
        //     const pointAY = pointA.targetYOrigin + pointA.targetYTotal;
        //     const pointBY = pointB.targetYOrigin + pointB.targetYTotal;
        //     const targetTop = Math.min(pointAY, pointBY);
        //     const targetLeft = Math.min(pointAX, pointBX);
        //     const targetRight = Math.max(pointAX, pointBX);
        //     const targetBottom = Math.max(pointAY, pointBY);
        //     return {
        //         targetX: targetTop + 'px',
        //         targetY: targetLeft + 'px',
        //         targetWidth: (targetRight - targetLeft) + 'px',
        //         targetHeight: (targetBottom - targetTop) + 'px',
        //     };
        // })

        // .pan(starts)
        // .repeat()
        // .mergeAll()
        // .map(({ targetX, targetY,
        //         targetTop, targetLeft,
        //         targetRight, targetBottom }) => ({
        //     targetX: targetX + 'px',
        //     targetY: targetY + 'px',
        //     targetWidth: (targetRight - targetLeft) + 'px',
        //     targetHeight: (targetBottom - targetTop) + 'px',
        // }))
        // .startWith({});
}

const Zoomable = mapPropsStream((props) => {
    const { handler: onStart, stream: starts } = createEventHandler();
    const points = zoomGesture(starts);
    return props.combineLatest(points, (props, point) => ({
        onStart, ...point, ...props
    }))
    .catch((err) => Observable.of({ err }));
});

const ZoomBox = Zoomable(({
    err,
    style, onStart,
    touches = 0,
    points = [],
    initialX, initialY,
    targetX = initialX,
    targetY = initialY,
    targetWidth = style.width || '0px',
    targetHeight = style.height || '0px', ...props
}) => {
    return (
        <div {...props}
             onMouseDown={onStart}
             onTouchStart={onStart}
             style={{
                 ...style,
                 width: `${targetWidth}`,
                 height: `${targetHeight}`,
                 transform: `translate3d(${targetX}, ${targetY}, 0px)`
             }}>
            <p>{touches}</p>
            <p>{points.toString()}</p>
            {err && <p>{err.toString()}</p>}
        </div>
    );
});

export { ZoomBox };
export default ZoomBox;

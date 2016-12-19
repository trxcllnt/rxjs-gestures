import React from 'react';
import { Gestures } from '../lib/index';
import { Observable } from 'rxjs';
import compose from 'recompose/compose';
import mapPropsStream from 'recompose/mapPropsStream';
import createEventHandler from 'recompose/createEventHandler';

function zoomGesture(starts) {
    return Gestures
        .pan(starts, { inputs: 2 })
        .pairwise()
        .repeat()
        .switchMap(([panA, panB]) => panA
            .combineLatest(panB, (pointA, pointB, index) => {

                const width = pointA.targetRight - pointA.targetLeft;
                const height = pointA.targetBottom - pointA.targetTop;

                const pointAX = pointA.targetXOrigin + pointA.movementXTotal;
                const pointBX = pointB.targetXOrigin + pointB.movementXTotal;
                const pointAY = pointA.targetYOrigin + pointA.movementYTotal;
                const pointBY = pointB.targetYOrigin + pointB.movementYTotal;

                const minX = Math.min(pointAX, pointBX);
                const minY = Math.min(pointAY, pointBY);
                const maxX = Math.max(pointAX, pointBX);
                const maxY = Math.max(pointAY, pointBY);

                return {
                    index,
                    status: 'zooming',
                    targetX: minX + 'px',
                    targetY: minY + 'px',
                    targetWidth: width + (maxX - minX) + 'px',
                    targetHeight: height + (maxY - minY) + 'px',
                };
            })
            .concat(Observable.of({
                status: 'completed',
            }))
        )
        .startWith({ status: 'started' });
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
    index = 0,
    style = {},
    points = [],
    err, status, onStart,
    initialX, initialY,
    targetX = initialX,
    targetY = initialY,
    targetWidth = style.width || '0px',
    targetHeight = style.height || '0px', ...props
}) => {
    return (
        <div style={{
            top: 0, left: 0,
            position: `absolute`,
            width: `100%`, height: `100%`,
        }}>
            <p>{status}</p>
            <div {...props}
                 onMouseDown={onStart}
                 onTouchStart={onStart}
                 style={{
                     ...style,
                     width: `${targetWidth}`, height: `${targetHeight}`,
                     transform: `translate3d(${targetX}, ${targetY}, 0px)`
                 }}>
                <span>{index}</span><br/>
                <span>({targetX}, {targetY})</span><br/>
                <span>{points.length}</span><br/>
                <span>{points.map(({ x, y }) => `\n(${x}, ${y})`).join('')}</span>
                {err && <p>{err.toString()}</p>}
            </div>
        </div>
    );
});

export { ZoomBox };
export default ZoomBox;

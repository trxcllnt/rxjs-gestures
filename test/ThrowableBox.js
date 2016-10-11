import React from 'react';
import { Gestures } from '../lib/index';
import compose from 'recompose/compose';
import mapPropsStream from 'recompose/mapPropsStream';
import createEventHandler from 'recompose/createEventHandler';

function throwWithMomentumGesture(starts) {
    return Gestures
        .pan(starts)
        .repeat()
        .mergeMap((panGesture) => panGesture
            .decelerate(1)
            .takeUntil(starts))
        .map(({ targetX, targetY,
                targetTop, targetLeft,
                parentTop, parentLeft,
                targetRight, targetBottom,
                parentRight, parentBottom }) => ({
            targetX: reflectCoordinate(targetX, (parentRight - parentLeft) -
                                                (targetRight - targetLeft)) + 'px',
            targetY: reflectCoordinate(targetY, (parentBottom - parentTop) -
                                                (targetBottom - targetTop)) + 'px'
        }))
        .startWith({});
}

const ThrowWithMomentum = mapPropsStream((props) => {
    const { handler: onStart, stream: starts } = createEventHandler();
    const points = throwWithMomentumGesture(starts);
    return props.combineLatest(points, (props, { targetX, targetY }) => ({
        onStart, ...props, targetX, targetY
    }));
});

const ThrowableBox = ThrowWithMomentum(({
    style, onStart,
    initialX, initialY,
    targetX = initialX,
    targetY = initialY,
    ...props
}) => {
    return (
        <div {...props}
             onMouseDown={onStart}
             onTouchStart={onStart}
             style={{
                ...style,
                transform: `translate3d(${targetX}, ${targetY}, 0px)`
            }}
        />
    );
});

function reflectCoordinate(value, bounds) {
    const multiple = Math.round(value / bounds);
    const direction = multiple % 2 === 0 ? 1 : -1;
    return (value - (bounds * multiple)) * direction;
}

export { ThrowableBox };
export default ThrowableBox;

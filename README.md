# rxjs-gestures

Unified mouse + touch interaction as RxJS Observables. Abstracts away mouse vs. touch events so you can get on to more important things.

```es6
import { Gestures } from 'rxjs-gestures';

const rect = document.body.appendChild(document.createElement('div'));
rect.style.width = '100px';
rect.style.height = '100px';
rect.style.border = '1px solid black';
rect.style.background = 'black';
rect.style.opacity = 0.35;
rect.style.transform = 'translate3d(100px, 100px, 0px)';

// Listen to "start" events -- either mousedown or touchstart
Gestures.start(rect).subscribe(({ pageY, pageX }) =>
    console.log(`start at (${pageX}, ${pageY})`)
);

// Listen to "move" events -- mousemove or touchmove
Gestures.move(rect).subscribe(({ pageY, pageX }) =>
    console.log(`end at (${pageX}, ${pageY})`)
);

// Listen to "end" events -- mouseup or touchend
Gestures.end(rect).subscribe(({ pageY, pageX }) =>
    console.log(`end at (${pageX}, ${pageY})`)
);

// Listen to "start" events, but group them into inner Observables by their input
// identifier. For mouse, there's only one group. For touch, there can be many.
Gestures.startsById(rect)
    .do((starts) => console.log(`input ${starts.key} just touched the surface`))
    .flatMap((starts) => starts.delay(500))
    .subscribe(({ pageY, pageX, identifier }) =>
        console.log(`got delayed start on ${event.identifier} at (${pageX}, ${pageY})`)
    );

// Listen to "tap" events -- a start, followed by an end, as long as the
// end is before a certain time *and* within a certain radius from the start.
Gestures.tap(rect,
    250, /* <-- if end happens after this timeout, the tap cancels */
    { x: 10, y: 10 } /* <-- if input moves more than 10x10px before the timeout, the tap cancels */)
    // Composite gestures all use `startsById` internally, so they emit an
    // Observable of the desired gesture for each distinct input device.
    .mergeAll()
    .subscribe(({ pageY, pageX, identifier }) =>
        console.log(`tapped with ${event.identifier} at (${pageX}, ${pageY})`)
    );

// Listen to "press" events -- a start, followed by an end, as long as the
// end is after a certain time *and* within a certain radius from the start.
// Passing 0 for delay is equivalent to calling Gestures.startsById()
Gestures.press(rect,
    450, /* <-- if an end occurs before this delay, the press cancels */
    { x: 10, y: 10 } /* <-- if input moves more than 10x10px before the delay, the press cancels */)
    .mergeAll()
    .subscribe(({ pageY, pageX, identifier }) =>
        console.log(`pressed with ${event.identifier} at (${pageX}, ${pageY})`)
    );

// Listen to "pan" events -- a press, followed by any number of moves, then an end.
// Internally, pan uses Gestures.press(), so pan-immediate vs. pan-after-long-press
// is handled in the same way.
Gestures.pan(rect
    /*, 450 <-- uncomment for long press */
    /*, { x: 50, y: 50 } <-- uncomment to change the invalidation area */)
    .mergeAll()
    .subscribe(({ pageY, pageX, identifier }) =>
        console.log(`panning with ${event.identifier} at (${pageX}, ${pageY})`)
    );

// Listen for "pan" events
Gestures.pan(rect).flatMap((pan ) => 
    // For each input (mouse, finger, etc.), convert the pan's coorinates
    // into  rect coordinates. When the pan completes, decelerate from the
    // pan's end velocity vector to zero. Essentially this "fakes" more
    // move events, but the subscriber doesn't know the difference.
    pan .decelerate()
        .scan(({ top, left }, { deltaX, deltaY, event }) => ({
            top: top + deltaY,
            left: left + deltaX,
            target: event.target,
        }), rect.getBoundingClientRect())
    )
    // Move the rectangle
    .subscribe(({ top, left, target }) => {
        rect.style.transform = `translate3d(${left}px, ${top}px, 0px)`;
    });

```

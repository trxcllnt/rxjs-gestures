import h from 'snabbdom/h';
import { Gestures } from '../lib/index';
import { Component } from 'reaxtor';
import { Observable, Subject } from 'rxjs';

export class App extends Component {
    initialize(models, depth) {

        const tapButton = new Button({
            label: 'Tap me! (< 250ms)',
            type: `tap`, delay: 250,
            index: 0, depth: depth + 1,
            models: models.deref('tap'),
        });
        const pressButton = new Button({
            label: 'Press me (> 450ms)',
            type: `press`, delay: 450,
            index: 1, depth: depth + 1,
            models: models.deref('press'),
        });
        const dragArea = new SelectArea({
            index: 2, depth: depth + 1,
            models: models.deref('drag'),
        });

        return models.switchMap(([model, state]) => Observable.combineLatest(
            tapButton, pressButton, dragArea,
            (...childVDoms) => [model, state, ...childVDoms]
        ));
    }
    loadProps(model) {
        return model.get(
            `tap.count`,
            `drag.area`,
            `press.count`
        );
    }
    render(model, { tap, press, drag }, tapButton, pressButton, dragArea) {
        return (
            <div key_={this.key} id='app' style_={{
                     fontFamily: 'sans',
                     boxSizing: 'border-box',
                }}>
                <p>Tapped: {tap.count}</p>
                <p>Pressed: {press.count}</p>{[
                tapButton, pressButton, dragArea
            ]}</div>
        );
    }
}

class Button extends Component {
    loadProps(model) {
        return model.get('count');
    }
    loadState(model, { count }) {

        const { type, label, delay = 250 } = this;
        const ends = this.listen('end');
        const start = this.listen('start');
        const activated = Gestures[type](start, delay)
            .mergeMap((activated) => activated
                .mapTo(1)
                .defaultIfEmpty(0)
                .scan((count, inc) => count + inc, count)
                .switchMap((count) => model.set({ json: { count }}))
                .pluck('json')
                .map(({ count }) => ({ count, down: false }))
            );

        return Observable.merge(
            activated,
            ends.mapTo({ down: false }),
            start.mapTo({ down: true }),
        );
    }
    render(model, { count = 0, down = false }) {
        return (
            <div on-touchstart={this.dispatch('start')}
                 on-touchend={this.dispatch('end')}
                 on-mouseup={this.dispatch('end')}
                 on-mousedown={this.dispatch('start')}
                 style_={{
                     padding: `15px`,
                     textAlign: 'center',
                     border: down ? `1px solid gray` : '1px solid transparent',
                     backgroundColor: down ? `lightgreen` : `green` }}>
                <h3>{ this.label }</h3>
                <p>({ count })</p>
            </div>
        );
    }
}

class SelectArea extends Component {
    loadProps(model) {
        return model.get(`area`);
    }
    loadState(model, { area = null }) {

        const hasSelectedArea = area != null;
        const ends = Gestures.end(this.listen('end'));
        const taps = Gestures.tap(this.listen('start')).mergeAll();
        const starts = Gestures.start(this.listen('start'));
        // const taps = Observable.merge(
        //     Gestures.tap(this.listen('start')),
        //     Gestures.tap(this.listen('box-start')),
        // );

        const dragBox = Gestures
            .pan(this.listen('box-start'))
            .mergeMap((pan) => pan
                .decelerate(0.1, 9.8)
                .map(({ totalX, totalY }) => ({
                    top: area.top + totalY,
                    left: area.left + totalX,
                    right: area.right + totalX,
                    bottom: area.bottom + totalY
                }))
                .let(writeRectsOnChange)
                .map(({ area }) => ({ drag: true, area }))
            );

        const dragCrosshairs = Gestures
            .pan(this.listen('start'))
            .mergeMap((pan) => pan
                .map(({ originX, originY, totalX, totalY }) => ({
                    top: Math.min(originY, originY + totalY),
                    left: Math.min(originX, originX + totalX),
                    right: Math.max(originX, originX + totalX),
                    bottom: Math.max(originY, originY + totalY)
                }))
                .let(writeRectsOnChange)
                .map(({ area }) => ({ drag: false, area }))
            );

        const rects = !hasSelectedArea ?
            dragCrosshairs :
            Observable.race(dragBox, dragCrosshairs).repeat();

        return Observable.merge(
            rects,
            ends.mapTo({ down: false }),
            starts.mapTo({ down: true }),
            taps.repeat().switchMap(() => model
                .set({ json: { area: null }})
                .pluck('json')
                .startWith({ down: false })
            )
        );

        function writeRectsOnChange(rects) {
            return rects.multicast(() => new Subject(), (rects) => Observable.merge(
                rects.map((area) => ({ area })),
                rects
                    .takeLast(1)
                    .switchMap((rect) => model.set({ json: {
                        area: { $type: 'atom', value: rect }
                    }}))
                    .pluck('json')
                    .map(({ area }) => ({ area, down: false }))
            ));
        }
    }
    render(model, { drag = false, down = false, area = null }) {
        const hasSelectedArea = area != null;
        const { top = 0, left = 0,
                right = 0, bottom = 0 } = (area || {});
        return (
            <div key_='drag-area'
                 on-touchstart={this.dispatch('start')}
                 on-touchend={this.dispatch('end')}
                 on-mouseup={this.dispatch('end')}
                 on-mousedown={this.dispatch('start')}
                 style_={{
                    height: `1000px`,
                    cursor: `crosshair`,
                    position: 'relative',
                    border: `1px solid black`,
                    transformStyle: `preserve-3d`,
                    backgroundColor: down ? 'lightgray' : 'white'
                 }}>{!hasSelectedArea ? [] : [
                    <div key_='drag-selection'
                         on-touchstart={this.dispatch('box-start')}
                         on-mousedown={this.dispatch('box-start')}
                         style_={{
                             opacity: 0.25,
                             position: 'relative',
                             backgroundColor: 'black',
                             border: `1px dashed black`,
                             width: `${right - left}px`,
                             height: `${bottom - top}px`,
                             cursor: !drag ? '-webkit-grab' : '-webkit-grabbing',
                             pointerEvents: !drag && down ? 'none' : 'auto',
                             transform: `translate3d(${left}px, ${top}px, 0px)`,
                        }}>
                    </div>
            ]}</div>
        );
    }
}

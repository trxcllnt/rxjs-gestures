import { reaxtor, Model, Component } from 'reaxtor';
import { init } from 'snabbdom';
import snabbdomClass from 'snabbdom/modules/class';
import snabbdomProps from 'snabbdom/modules/props';
import snabbdomStyle from 'snabbdom/modules/style';
import snabbdomAttributes from 'snabbdom/modules/attributes';
import snabbdomEventlisteners from 'snabbdom/modules/eventlisteners';
import { animationFrame } from 'rxjs/scheduler/animationFrame';

const patchDOM = init([
    snabbdomClass,
    snabbdomProps, snabbdomStyle,
    snabbdomAttributes, snabbdomEventlisteners
]);

import { App } from './App';

const appModel = new Model({
    cache: {
        tap: { count: 0 },
        drag: { area: null },
        press: { count: 0 }
    }
});

const appVDoms =
    reaxtor(App, appModel)
        .auditTime(0, animationFrame)
        .scan((dRoot, [model, vRoot]) => {
            return patchDOM(dRoot, vRoot);
        }, getAppDOMNode());

appVDoms.subscribe();

function getAppDOMNode(appDomNode) {
    return appDomNode = (
        document.getElementById('app') ||
        document.body.appendChild((
            appDomNode = document.createElement('div')) && (
            appDomNode.id = 'app') && (
            appDomNode)
        )
    );
}

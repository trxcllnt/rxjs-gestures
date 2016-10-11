import React from 'react';
import { render } from 'react-dom';
import { Gestures } from '../lib/index';
import setObservableConfig from 'recompose/setObservableConfig';
import rxjsObservableConfig from 'recompose/rxjsObservableConfig';
setObservableConfig(rxjsObservableConfig);

import { ZoomBox } from './ZoomBox';
import { ThrowableBox } from './ThrowableBox';

class TouchLogger extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'TouchLogger';
        this.state = { type: '', touches: 0, targetID: '' };
    }
    render() {
        return (
            <div onTouchEnd={({ target = {}, touches = [] }) => this.setState({
                     type: 'touchend',
                     touches: touches.length,
                     targetID: target.id || ''
                 })}
                 onTouchMove={({ target = {}, touches = [] }) => this.setState({
                     type: 'touchmove',
                     touches: touches.length,
                     targetID: target.id || ''
                 })}
                 onTouchStart={({ target = {}, touches = [] }) => this.setState({
                     type: 'touchstart',
                     touches: touches.length,
                     targetID: target.id || ''
                 })}
                 {...this.props}>
            <span style={{ position: `absolute`}}>
                {`${this.state.type} ${this.state.touches} ${this.state.targetID}`}
            </span>
            {this.props.children}
            </div>
        );
    }
}

render((
    <TouchLogger style={{
            top: 0, left: 0,
            position: `absolute`,
            width: `100%`, height: `100%`,
        }}>

        {
        /*
        <ZoomBox id='zoom-box'
                 initialX='0px'
                 initialY='0px'
                 style={{
                     top: `50%`,
                     left: `50%`,
                     width: `7em`,
                     height: `7em`,
                     marginTop: `-3.5em`,
                     marginLeft: `-3.5em`,
                     position: `absolute`,
                     border: `1px solid blue`,
                     background: `rgba(0,0,0,0.3)`
                 }}/>
        */
        }

        {
        ///*
        <ThrowableBox id='throw-box'
                      initialX='0px'
                      initialY='0px'
                      style={{
                          top: `50%`,
                          left: `50%`,
                          width: `7em`,
                          height: `7em`,
                          marginTop: `-3.5em`,
                          marginLeft: `-3.5em`,
                          position: `absolute`,
                          border: `1px solid green`,
                          background: `rgba(0,0,0,0.3)`,
                      }}/>
        //*/
        }
    </TouchLogger>
), rootElement())

Gestures.start(document.body).preventDefault().subscribe();

function rootElement() {
    const element = document.getElementById('root');
    const style = {
        top: 0, left: 0,
        right: 0, bottom: 0,
        margin: 0, padding: 0,
        overflow: `hidden`,
        position: `absolute`
    };
    for (const prop in style) {
        element.style[prop] = style[prop];
    }
    return element;
}

/**
 * Created by vchirkov on 6/23/2017.
 */
import _ from 'lodash';
import {EventEmitter} from 'events';
import {Color} from 'three';
import {easeOutCubic as tween, linear as bgTween} from 'tween-functions';

import DemoScene from './DemoScene';
import HighlightedCirclePoints from './highlightedCirclePoints';
import Floats from './floats/floats';

import * as constants from './constants';

const presets = {
    normal: constants.neutral1,
    progress: {
        bad: constants.negative1,
        normal: constants.neutral2,
        good: constants.positive1
    },
    end: {
        bad: constants.negative2,
        good: constants.positive2
    }
};

/**
 * @class WebglStuff
 * @extends EventEmitter
 * @classdesc Class, that organizes CircularPoints, Floats and LightRing in one system
 */
export default class WebglStuff extends EventEmitter {
    /**
     * @constructor
     * @param {HTMLElement} el - Container element for scene <canvas/>
     * @param {Object} [initial = constants.initial] - params, that won't change through time
     * @param {Object} [preset = constants.neutral1] - params, that can be changed
     */
    constructor(el, initial = constants.initial, preset = constants.neutral1) {
        super();
        if (!el) {
            throw new Error('container element is not found. Please pass it as first argument to WebglStuff constructor');
        }

        this.initial = _.extend({}, initial, preset);

        this.demo = DemoScene.create(el, this.initial.background);

        this.highCircle = new HighlightedCirclePoints(this.initial.circles, this.initial.visible, this.initial.r, this.initial.space, this.initial.points, {
            pointsColor: this.initial.pointsColor,
            ringColor: this.initial.ringColor,
            opacity: this.initial.opacity,
            impact: this.initial.impact,
            stabilityStart: this.initial.stabilityStart,
            stabilityEnd: this.initial.stabilityEnd,
            diffusion: this.initial.diffusion,
            rotation: this.initial.rotation,
            perlin: this.initial.perlin,
            ringInside: this.initial.ringInside,
            ringOutside: this.initial.ringOutside,
            x: this.initial.x,
            y: this.initial.y,
            z: this.initial.z,
        });

        _.each(this.highCircle.circles, (circle) => this.demo.scene.add(circle.mesh));
        this.demo.scene.add(this.highCircle.ring.mesh);

        this.floats = new Floats({color: this.initial.floatsColor, opacity: this.initial.floatsOpacity});
        this.demo.scene.add(this.floats.mesh);

        this.demo.animate((step) => {
            this.emit(WebglStuff.ON_BEFORE_UPDATE);
            this.update(step);
            this.emit(WebglStuff.ON_UPDATE);
            this.highCircle.update(step);
            this.floats.update(step);
            this.emit(WebglStuff.ON_AFTER_UPDATE);
        });
    }

    transitTo(preset, duration) {
        return new Promise((res, rej) => {
            this._transitionRes && this._transitionRes();

            this._transitionRes = res;
            this._transitionRej = rej;

            this._beginTransition(preset, duration);

            this.emit(WebglStuff.ON_TRANSITION_START);
        });
    }

    _beginTransition(preset, duration) {
        this._transitionFrom = {
            visible: this.highCircle.circlesVisible(),
            pointsColor: this.highCircle.pointsColor(),
            ringColor: this.highCircle.ringColor(),
            opacity: this.highCircle.ring.opacity(),
            impact: this.highCircle.impact(),
            stabilityStart: this.highCircle.stabilityStart(),
            stabilityEnd: this.highCircle.stabilityEnd(),
            rotation: this.highCircle.rotation(),
            perlin: this.highCircle.perlin(),
            background: this.demo.renderer.getClearColor(),
            floatsOpacity: this.floats.material.opacity
        };

        this._transitionTo = _.defaults({}, preset, this._transitionTo, this._transitionFrom);

        this._transitionCurrent = 0;
        this._transitionDuration = duration;

        this.highCircle.perlin(this._transitionTo.perlin);
    }

    _onTransitionUpdate(step) {
        this._transitionCurrent = Math.min(this._transitionCurrent + step, this._transitionDuration);
        let cur = this._transitionCurrent;
        let dur = this._transitionDuration;
        let from = this._transitionFrom;
        let to = this._transitionTo;

        this.highCircle.circlesVisible(tween(cur, from.visible, to.visible, dur) | 0, to.opacityStep);
        this.highCircle.pointsColor(new Color(
            tween(cur, from.pointsColor.r, to.pointsColor.r, dur),
            tween(cur, from.pointsColor.g, to.pointsColor.g, dur),
            tween(cur, from.pointsColor.b, to.pointsColor.b, dur)
        ));

        this.highCircle.ringColor(new Color(
            tween(cur, from.ringColor.r, to.ringColor.r, dur),
            tween(cur, from.ringColor.g, to.ringColor.g, dur),
            tween(cur, from.ringColor.b, to.ringColor.b, dur)
        ));

        this.highCircle.ring.opacity(tween(cur, from.opacity, to.opacity, dur));
        this.highCircle.impact(tween(cur, from.impact, to.impact, dur));
        this.highCircle.stability(tween(cur, from.stabilityStart, to.stabilityStart, dur), tween(cur, from.stabilityEnd, to.stabilityEnd, dur));
        this.highCircle.rotation(tween(cur, from.rotation, to.rotation, dur));
        // this.highCircle.perlin(tween(cur, from.perlin, to.perlin, dur));
        this.demo.renderer.setClearColor(new Color(
            bgTween(cur, from.background.r, to.background.r, dur),
            bgTween(cur, from.background.g, to.background.g, dur),
            bgTween(cur, from.background.b, to.background.b, dur)
        ), 1);

        this.floats.material.opacity = tween(cur, from.floatsOpacity, to.floatsOpacity, dur);
        this.emit(WebglStuff.ON_TRANSITION_PROGRESS);
    }

    _clearTransition() {
        this._transitionFrom = null;
        this._transitionTo = null;
        this._transitionCurrent = null;
        this._transitionDuration = null;
    }

    endTransition() {
        this._clearTransition();
        this._transitionRes && this._transitionRes();
        this.emit(WebglStuff.ON_TRANSITION_END);
    }

    stopTransition() {
        this._clearTransition();
        this._transitionRej && this._transitionRej();
        this.emit(WebglStuff.ON_TRANSITION_STOP);
    }

    update(step) {
        if (this._transitionTo && this._transitionCurrent >= this._transitionDuration) {
            this.endTransition();
        }
        if (this._transitionFrom && this._transitionTo) {
            this._onTransitionUpdate(step);
        }
    }
}

WebglStuff.ON_TRANSITION_START = 'onTransitionStart';
WebglStuff.ON_TRANSITION_PROGRESS = 'onTransitionProgress';
WebglStuff.ON_TRANSITION_STOP = 'onTransitionStop';
WebglStuff.ON_TRANSITION_END = 'onTransitionEnd';
WebglStuff.ON_BEFORE_UPDATE = 'onBeforeUpdate';
WebglStuff.ON_UPDATE = 'onUpdate';
WebglStuff.ON_AFTER_UPDATE = 'onAfterUpdate';

WebglStuff.presets = presets;
WebglStuff.initial = constants.initial;
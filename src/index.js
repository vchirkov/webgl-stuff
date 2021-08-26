/**
 * Created by vchirkov on 6/23/2017.
 */
import {EventEmitter} from 'events';
import {Color} from 'three';
import {easeOutCubic as tween, linear as bgTween} from 'tween-functions';

import SceneSet from './util/SceneSet';
import HighlightedCirclePoints from './HighlightedCirclePoints';
import Floats from './floats/Floats';

import * as constants from './util/constants';

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

        this.initial = {...initial, ...preset};

        this.sceneSet = new SceneSet(el, this.initial.background);

        this.highCircle = new HighlightedCirclePoints(this.initial.circles, this.initial.visible, this.initial.r, this.initial.space, this.initial.points, {
            pointsColor: new Color(this.initial.pointsColor),
            ringColor: new Color(this.initial.ringColor),
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

        this.highCircle.circles.forEach(circle => this.sceneSet.scene.add(circle.mesh));
        this.sceneSet.scene.add(this.highCircle.ring.mesh);

        this.floats = new Floats({color: this.initial.floatsColor, opacity: this.initial.floatsOpacity});
        this.sceneSet.scene.add(this.floats.mesh);

        this.sceneSet.animate((step) => {
            this.emit(WebglStuff.ON_BEFORE_UPDATE);
            this.update(step);
            this.emit(WebglStuff.ON_UPDATE);
            this.highCircle.update(step);
            this.floats.update(step);
            this.emit(WebglStuff.ON_AFTER_UPDATE);
        });
    }

    transitTo(preset, duration = 0) {
        if (!duration) {
            return Promise.resolve(this.set(preset));
        } else {
            return new Promise((res, rej) => {
                this._transitionRes && this._transitionRes();

                this._transitionRes = res;
                this._transitionRej = rej;

                this._beginTransition(preset, duration);
                this._onTransitionUpdate(0);

                this.emit(WebglStuff.ON_TRANSITION_START);
            });
        }
    }

    set(preset) {
        preset.visible !== undefined && this.highCircle.circlesVisible(preset.visible | 0, preset.opacityStep || 1);
        preset.pointsColor !== undefined && this.highCircle.pointsColor(new Color(preset.pointsColor));
        preset.ringColor !== undefined && this.highCircle.ringColor(new Color(preset.ringColor));
        preset.opacity !== undefined && this.highCircle.ring.opacity(preset.opacity);
        preset.impact !== undefined && this.highCircle.impact(preset.impact);
        preset.stabilityStart !== undefined && this.highCircle.stabilityStart(preset.stabilityStart);
        preset.stabilityEnd !== undefined && this.highCircle.stabilityEnd(preset.stabilityEnd);
        preset.rotation !== undefined && this.highCircle.rotation(preset.rotation);
        preset.perlin !== undefined && this.highCircle.perlin(preset.perlin);
        preset.background !== undefined && this.sceneSet.renderer.setClearColor(new Color(preset.background));
        preset.floatsOpacity !== undefined && (this.floats.material.opacity = preset.floatsOpacity);
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
            background: this.sceneSet.renderer.getClearColor(),
            floatsOpacity: this.floats.material.opacity
        };

        this._transitionTo = {...this._transitionFrom, ...this._transitionTo, ...preset};
        console.log(preset.pointsColor);
        if (!(this._transitionTo.pointsColor instanceof Color)) {
            this._transitionTo.pointsColor = new Color(this._transitionTo.pointsColor);
        }

        if (!(this._transitionTo.ringColor instanceof Color)) {
            this._transitionTo.ringColor = new Color(this._transitionTo.ringColor);
        }

        if (!(this._transitionTo.background instanceof Color)) {
            this._transitionTo.background = new Color(this._transitionTo.background);
        }

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

        this.set({
            visible: tween(cur, from.visible, to.visible, dur),
            opacityStep: to.opacityStep,
            pointsColor: new Color(
                tween(cur, from.pointsColor.r, to.pointsColor.r, dur),
                tween(cur, from.pointsColor.g, to.pointsColor.g, dur),
                tween(cur, from.pointsColor.b, to.pointsColor.b, dur)
            ),
            ringColor: new Color(
                tween(cur, from.ringColor.r, to.ringColor.r, dur),
                tween(cur, from.ringColor.g, to.ringColor.g, dur),
                tween(cur, from.ringColor.b, to.ringColor.b, dur)
            ),
            opacity: tween(cur, from.opacity, to.opacity, dur),
            impact: tween(cur, from.impact, to.impact, dur),
            stabilityStart: tween(cur, from.stabilityStart, to.stabilityStart, dur),
            stabilityEnd: tween(cur, from.stabilityEnd, to.stabilityEnd, dur),
            rotation: tween(cur, from.rotation, to.rotation, dur),
            // perlin: tween(cur, from.perlin, to.perlin, dur),
            background: new Color(
                bgTween(cur, from.background.r, to.background.r, dur),
                bgTween(cur, from.background.g, to.background.g, dur),
                bgTween(cur, from.background.b, to.background.b, dur)
            ),
            floatsOpacity: tween(cur, from.floatsOpacity, to.floatsOpacity, dur)
        });

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
            this.set(this._transitionTo);
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

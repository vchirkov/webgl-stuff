/**
 * Created by vchirkov on 6/23/2017.
 */
import _ from 'lodash';
import {EventEmitter} from 'events';
import {Color} from 'three';
import DemoScene from './DemoScene';
import {easeOutCubic as tween, linear as bgTween} from 'tween-functions';
import HighlightedCirclePoints from './highlightedCirclePoints';
import Floats from './floats/floats';

const initial = {
    x: 0,
    y: 0,
    z: 0,
    circles: 45,
    r: 50,
    ringInside: 0.1,
    ringOutside: 1.5,
    space: 1,
    points: 100,
    diffusion: 0.5,
    floatsColor: new Color(0x000000)
};

const presets = {
    normal: {
        visible: 10,
        opacityStep: 0.125,
        pointsColor: new Color(1, 1, 1),
        ringColor: new Color(1, 1, 1),
        opacity: 0.1,
        impact: 0.04,
        stabilityStart: 1.05,
        stabilityEnd: 0.95,
        rotation: 0.0005,
        perlin: 0.00025,
        background: new Color(0.295, 0.295, 0.78),
        floatsOpacity: 0.6
    },
    progress: {
        bad: {
            visible: 40,
            opacityStep: 0.125,
            pointsColor: new Color(1, 1, 0),
            ringColor: new Color(1, 1, 0),
            opacity: 0.3,
            impact: 0.07,
            stabilityStart: 1.25,
            stabilityEnd: 0.85,
            rotation: 0.001,
            perlin: 0.0005,
            background: new Color(1, 0, 0),
            floatsOpacity: 1.1
        },
        normal: {
            visible: 25,
            opacityStep: 0.125,
            pointsColor: new Color(1, 1, 1),
            ringColor: new Color(1, 1, 1),
            opacity: 0,
            impact: 0.04,
            stabilityStart: 1.05,
            stabilityEnd: 0.95,
            rotation: 0.0005,
            perlin: 0.00025,
            background: new Color(0.295, 0.295, 0.78),
            floatsOpacity: 0.6
        },
        good: {
            visible: 30,
            opacityStep: 0.125,
            pointsColor: new Color(1, 1, 1),
            ringColor: new Color(1, 1, 1),
            opacity: 0,
            impact: 0.001,
            stabilityStart: 1.25,
            stabilityEnd: 1.25,
            rotation: 0.0001,
            perlin: 0.00005,
            background: new Color(0.14, 0.9, 0.372),
            floatsOpacity: 0.5
        }
    },
    end: {
        bad: {
            visible: 40,
            opacityStep: 0.125,
            pointsColor: new Color(1, 1, 0),
            ringColor: new Color(1, 1, 0),
            opacity: 0.4,
            impact: 0.08,
            stabilityStart: 1.15,
            stabilityEnd: 1.15,
            rotation: 0.001,
            perlin: 0.0005,
            background: new Color(1, 0, 0),
            floatsOpacity: 1.1
        },
        good: {
            visible: 25,
            opacityStep: 0.125,
            pointsColor: new Color(1, 1, 1),
            ringColor: new Color(1, 1, 1),
            opacity: 0,
            impact: 0.0001,
            stabilityStart: 1.25,
            stabilityEnd: 1.25,
            rotation: 0.0001,
            perlin: 0.00005,
            background: new Color(0.14, 0.9, 0.372),
            floatsOpacity: 0.7
        }
    }
};

export default class WebglStuff extends EventEmitter {
    constructor(el = document.getElementById('container'), init = initial, preset = presets.normal) {
        super();
        this.initial = _.extend({}, init, preset);

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
            this.emit('beforeUpdate');
            this.update(step);
            this.emit('update');
            this.highCircle.update(step);
            this.floats.update(step);
            this.emit('afterUpdate');
        });
    }

    transitTo(preset, duration) {
        return new Promise((res) => {
            this._transitionRes = res;
            this._beginTransition(preset, duration)
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

        this._transitionTo = preset;

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

        this.floats.material.opacity = tween(cur, from.floatsOpacity, to.floatsOpacity, dur)
    }

    stopTransition() {
        this._transitionFrom = null;
        this._transitionTo = null;
        this._transitionCurrent = null;
        this._transitionDuration = null;
        this._transitionRes();
    }

    update(step) {
        if (this._transitionTo && this._transitionCurrent >= this._transitionDuration) {
            this.stopTransition();
        }
        if (this._transitionFrom && this._transitionTo) {
            this._onTransitionUpdate(step);
        }
    }
}

WebglStuff.presets = presets;
WebglStuff.initial = initial;
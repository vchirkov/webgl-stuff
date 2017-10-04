/**
 * Created by vlad.chirkov on 30.5.17.
 */
import {NormalBlending, Points, Color} from 'three';
import CircularPointsMaterial from './CircularPointsMaterial';
import CircularPointsGeometry from './CircularPointsGeometry';
import InlineTextureLoader from '../util/InlineTextureLoader';

import base64Texture from './img/glow.png';

export default class CircularPoints {
    constructor(radius = 50, number, {color, impact, visibility, stability, perlin, rotation, x, y, z}) {
        this._radius = radius;
        this._number = number;
        this._color = color;
        this._spin = Math.random() - 0.5;

        this.geometry = new CircularPointsGeometry(this._radius, this._number);
        this.material = new CircularPointsMaterial({
            color: this._color,
            size: 16,
            map: InlineTextureLoader.load(base64Texture),
            blending: NormalBlending,
            transparent: true
        }, {impact, stability, perlin, rotation, spin: this._spin});

        this.mesh = new Points(this.geometry, this.material);
        this.mesh.position.set(x, y, z);
        this.mesh.visible = visibility;
    }

    color(val) {
        if (!_.isUndefined(val)) {
            this._color = new Color(val);
            this.material.color = this._color;
        }
        return this._color;
    }

    visible(val) {
        if (!_.isUndefined(val)) {
            this.mesh.visible = val;
        }
        return this.mesh.visible;
    }

    opacity(val) {
        if (!_.isUndefined(val)) {
            this.material.opacity = val;
        }
        return this.material.opacity;
    }

    uniform(name, val) {
        if (val && this.material.uniforms[name]) {
            this.material.uniforms[name].value = val;
        }
        return this.material.uniforms[name].value;
    }
}
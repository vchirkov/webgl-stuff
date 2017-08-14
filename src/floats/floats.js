/**
 * Created by vlad.chirkov on 14/07/2017.
 */
import {PlaneGeometry, Mesh} from 'three';
import FloatsMaterial from './floatsMaterial';

export default class Floats {
    constructor({impact, speed, color, opacity}) {
        this.opts = {
            impact: impact || 1,
            speed: speed || 0.0001,
            color,
            opacity
        };

        this.geometry = new PlaneGeometry(window.innerWidth, window.innerHeight);
        this.material = new FloatsMaterial({
            color: this.opts.color,
            transparent: true,
            opacity: this.opts.opacity,
        });

        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.position.set(0, 0, -20);
    }

    update(step) {
        this.uniform('time', this.uniform('time') + this.opts.speed * step);
    }

    uniform(name, val) {
        if (val && this.material.uniforms[name]) {
            this.material.uniforms[name].value = val;
        }
        return this.material.uniforms[name].value;
    }
}
/**
 * Created by vlad.chirkov on 2.6.17.
 */
import {Mesh, MeshBasicMaterial, NormalBlending, Color} from 'three';
import RadialRingGeometry from './RadialRingGeometry';
import InlineTextureLoader from '../util/InlineTextureLoader';

import base64Texture from './img/gradient.png';

export default class LightRing {
    constructor(innerR, outerR, segments, thetaLength, {color, opacity, x, y, z}) {
        this._innerR = innerR;
        this._outerR = outerR;
        this._segments = segments;
        this._color = color;
        this._opacity = opacity;

        this.geometry = new RadialRingGeometry(this._innerR, this._outerR, this._segments, null, 0, thetaLength);
        this.material = this.material = new MeshBasicMaterial({
            color: this._color,
            map: InlineTextureLoader.load(base64Texture),
            transparent: true,
            opacity: this._opacity,
            blending: NormalBlending
        });
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.position.set(x, y, z - 10);
    }

    innerR(val) {
        if (val !== undefined) {
            this._innerR = val;
            this.geometry.dispose();
            this.geometry = new RadialRingGeometry(this._innerR, this._outerR, this._segments);
            this.mesh.geometry = this.geometry;
        }
        return this._innerR;
    }

    outerR(val) {
        if (val !== undefined) {
            this._outerR = val;
            this.geometry.dispose();
            this.geometry = new RadialRingGeometry(this._innerR, this._outerR, this._segments);
            this.mesh.geometry = this.geometry;
        }
        return this._outerR;
    }

    color(val) {
        if (val !== undefined) {
            this._color = new Color(val);
            this.material.color = this._color;
        }
        return this._color;
    }

    opacity(val) {
        if (val !== undefined) {
            this._opacity = val;
            this.material.opacity = val;
        }
        return this._opacity;
    }
}

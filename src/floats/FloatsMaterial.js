/**
 * Created by vlad.chirkov on 31.5.17.
 */
import {MeshBasicMaterial, ShaderLib, UniformsUtils} from 'three';
import noiseBackgroundVert from './shaders/noiseBackgroundVert.glsl';
import noiseBackgroundFrag from './shaders/noiseBackgroundFrag.glsl';

export default class FloatsMaterial extends MeshBasicMaterial {
    constructor(parameters) {
        super(parameters);
        this.type = 'FloatsMaterial';

        this.uniforms = {
            ...UniformsUtils.clone(ShaderLib.basic.uniforms),
            time: {
                type: 'f',
                value: 0
            },
            color: {
                type: 'c',
                value: parameters.color
            }
        };

        this.vertexShader = noiseBackgroundVert;
        this.fragmentShader = noiseBackgroundFrag;
    }
}

/**
 * Created by vlad.chirkov on 31.5.17.
 */
import _ from 'lodash';
import {PointsMaterial, ShaderLib, UniformsUtils} from 'three';
import noisePointsVert from './shaders/noisePointsVert.glsl';


export default  class CircularPointsMaterial extends PointsMaterial {
    constructor(parameters, uniforms) {
        super(parameters);
        this.type = 'CircularPointsMaterial';

        let shader = ShaderLib['points'];
        this.uniforms = _.extend({
            perlin: {
                type: "f",
                value: uniforms.perlin || 0.0
            },
            rotation: {
                type: "f",
                value: uniforms.rotation || 0.0
            },
            impact: {
                type: "f",
                value: uniforms.impact || 0.004
            },
            stability: {
                type: "f",
                value: uniforms.stability || 0.95
            },
            spin:{
                type: "f",
                value: uniforms.spin || Math.random() - 0.5
            }
        }, UniformsUtils.clone(shader.uniforms));
        this.fragmentShader = shader.fragmentShader;
        this.vertexShader = noisePointsVert;
    }
}
'use strict';

var events = require('events');
var three = require('three');
var tweenFunctions = require('tween-functions');

class SceneSet {
    constructor(el, color = 0x000000) {
        this.el = el;
        this.renderer = new three.WebGLRenderer({antialias: true, alpha: true});
        this.renderer.setClearColor(color, 1);
        this.el.appendChild(this.renderer.domElement);
        this._prevTime = 0;

        this.scene = new three.Scene();
        this.camera = new three.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 5, 5000);
        this.camera.position.set(0, 0, 500);

        this.calculateDimensions();
        window.addEventListener('resize', () => this.calculateDimensions(), false);
    }

    calculateDimensions() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    animate(frame) {
        this._frame = (...args) => frame(...args);
        this._runAnimate();
    }

    _runAnimate() {
        this._animate = this._animate.bind(this);
        window.requestAnimationFrame(this._animate);
    }

    _animate(time) {
        window.requestAnimationFrame(this._animate);

        let step = time - this._prevTime;
        this._prevTime = time;

        this._frame && this._frame(step, time);
        this.render();
    }
}

var noisePointsVert = "uniform float size;\nuniform float scale;\nuniform float impact;\nuniform float stability;\nuniform float spin;\nuniform float rotation;\nuniform float perlin;\n\n//#include <common>\n#include <color_pars_vertex>\n\nvec3 mod289(vec3 x)\n{\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289(vec4 x)\n{\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x)\n{\n  return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec3 fade(vec3 t) {\n  return t*t*t*(t*(t*6.0-15.0)+10.0);\n}\n\n// Classic Perlin noise\nfloat cnoise(vec3 P)\n{\n  vec3 Pi0 = floor(P); // Integer part for indexing\n  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1\n  Pi0 = mod289(Pi0);\n  Pi1 = mod289(Pi1);\n  vec3 Pf0 = fract(P); // Fractional part for interpolation\n  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n  vec4 iy = vec4(Pi0.yy, Pi1.yy);\n  vec4 iz0 = Pi0.zzzz;\n  vec4 iz1 = Pi1.zzzz;\n\n  vec4 ixy = permute(permute(ix) + iy);\n  vec4 ixy0 = permute(ixy + iz0);\n  vec4 ixy1 = permute(ixy + iz1);\n\n  vec4 gx0 = ixy0 * (1.0 / 7.0);\n  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n  gx0 = fract(gx0);\n  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n  vec4 sz0 = step(gz0, vec4(0.0));\n  gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n  gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n\n  vec4 gx1 = ixy1 * (1.0 / 7.0);\n  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n  gx1 = fract(gx1);\n  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n  vec4 sz1 = step(gz1, vec4(0.0));\n  gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n  gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n\n  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\n  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\n  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\n  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\n  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\n  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\n  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\n  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);\n\n  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n  g000 *= norm0.x;\n  g010 *= norm0.y;\n  g100 *= norm0.z;\n  g110 *= norm0.w;\n  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n  g001 *= norm1.x;\n  g011 *= norm1.y;\n  g101 *= norm1.z;\n  g111 *= norm1.w;\n\n  float n000 = dot(g000, Pf0);\n  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n  float n111 = dot(g111, Pf1);\n\n  vec3 fade_xyz = fade(Pf0);\n  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n  return 2.2 * n_xyz;\n}\n\nvoid main() {\n\n\t#include <color_vertex>\n\t#include <begin_vertex>\n\n\tfloat s = sin(rotation * spin);\n    float c = cos(rotation * spin);\n\n    transformed.xy = vec2(transformed.x * c - transformed.y * s, transformed.y * c + transformed.x * s);\n\n\t#include <project_vertex>\n\n\t#ifdef USE_SIZEATTENUATION\n\t\tgl_PointSize = size * ( scale / - mvPosition.z );\n\t#else\n\t\tgl_PointSize = size;\n\t#endif\n\n\tfloat noise = cnoise(impact * transformed + vec3( perlin ));\n\n    transformed = stability * transformed + 2.0 * transformed * noise * (1.0 - stability);\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1.0 );\n\n}\n";

/**
 * Created by vlad.chirkov on 31.5.17.
 */


class CircularPointsMaterial extends three.PointsMaterial {
    constructor(parameters, uniforms) {
        super(parameters);
        this.type = 'CircularPointsMaterial';

        let shader = three.ShaderLib['points'];
        this.uniforms = {
            perlin: {
                type: 'f',
                value: uniforms.perlin || 0.0
            },
            rotation: {
                type: 'f',
                value: uniforms.rotation || 0.0
            },
            impact: {
                type: 'f',
                value: uniforms.impact || 0.004
            },
            stability: {
                type: 'f',
                value: uniforms.stability || 0.95
            },
            spin: {
                type: 'f',
                value: uniforms.spin || Math.random() - 0.5
            }, ...three.UniformsUtils.clone(shader.uniforms)
        };
        this.fragmentShader = shader.fragmentShader;
        this.vertexShader = noisePointsVert;
    }
}

/**
 * Created by vlad.chirkov on 30.5.17.
 */

class CircularPointsGeometry extends three.Geometry {
    constructor(radius, number) {
        super();
        this._radius = radius;
        this._number = number;

        for (let i = 0; i < this._number; i++) {
            let pos = Math.random() * 2 * Math.PI;
            this.vertices.push(new three.Vector3(Math.cos(pos) * this._radius, Math.sin(pos) * this._radius, 0));
        }
    }
}

class InlineTextureLoader {
    static load(base64Image) {
        let texture = new three.Texture();
        texture.image = new Image();
        texture.image.onload = function () {
            texture.needsUpdate = true;
        };

        texture.image.src = base64Image;
        return texture;
    }
}

var img$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAANJJREFUeNq8U+0OgyAMpIhGt/d/gO0Zt6CoMJpck4rgH5ORXPiy1+tRKaVk7gxrbg5XIYzqjrDnec8QuSTrkoBAMqizPmPDtyvOYksBE3QIGpSqHcF8P7cUWECCJ6wJCjjQ42ytKZDsY8YDGJFpg+xQqDq8gsgSIiZ4ZbyRaMDcKzMPBHvxClERy/7UNKQayQGc+QlMCOL6PxnfjAVenEyMwKIMndXzeagMrUZKqgwPMgcDDUjCVQniR6fqtkWCCMJUI9ABtmIs6Q5sEfz/b/wJMAD/oUlpbWvt9wAAAABJRU5ErkJggg==";

/**
 * Created by vlad.chirkov on 30.5.17.
 */

class CircularPoints {
    constructor(radius = 50, number, {color, impact, visibility, stability, perlin, rotation, x, y, z}) {
        this._radius = radius;
        this._number = number;
        this._color = color;
        this._spin = Math.random() - 0.5;

        this.geometry = new CircularPointsGeometry(this._radius, this._number);
        this.material = new CircularPointsMaterial({
            color: this._color,
            size: 16,
            map: InlineTextureLoader.load(img$1),
            blending: three.NormalBlending,
            transparent: true
        }, {impact, stability, perlin, rotation, spin: this._spin});

        this.mesh = new three.Points(this.geometry, this.material);
        this.mesh.position.set(x, y, z);
        this.mesh.visible = visibility;
    }

    color(val) {
        if (val !== undefined) {
            this._color = new three.Color(val);
            this.material.color = this._color;
        }
        return this._color;
    }

    visible(val) {
        if (val !== undefined) {
            this.mesh.visible = val;
        }
        return this.mesh.visible;
    }

    opacity(val) {
        if (val !== undefined) {
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

/**
 * Created by vchirkov on 6/3/2017.
 */

// RadialRingGeometry

function RadialRingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength) {

    three.Geometry.call(this);

    this.type = 'RingGeometry';

    this.parameters = {
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        thetaSegments: thetaSegments,
        phiSegments: phiSegments,
        thetaStart: thetaStart,
        thetaLength: thetaLength
    };

    this.fromBufferGeometry(new RadialRingBufferGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength));
    this.mergeVertices();

}

RadialRingGeometry.prototype = Object.create(three.Geometry.prototype);
RadialRingGeometry.prototype.constructor = RadialRingGeometry;

RadialRingGeometry.prototype.update = function(){
    var params = this.parameters;
    new RadialRingBufferGeometry(params.innerRadius, params.outerRadius, params.thetaSegments, params.phiSegments, params.thetaStart, params.thetaLength);

    this.mergeVertices();
};

// RadialRingBufferGeometry

function RadialRingBufferGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength) {

    three.BufferGeometry.call(this);

    this.type = 'RingBufferGeometry';

    this.parameters = {
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        thetaSegments: thetaSegments,
        phiSegments: phiSegments,
        thetaStart: thetaStart,
        thetaLength: thetaLength
    };

    innerRadius = innerRadius || 20;
    outerRadius = outerRadius || 50;

    thetaStart = thetaStart !== undefined ? thetaStart : 0;
    thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;

    thetaSegments = thetaSegments !== undefined ? Math.max(3, thetaSegments) : 8;
    phiSegments = phiSegments !== undefined ? Math.max(1, phiSegments) : 1;

    // buffers

    var indices = [];
    var vertices = [];
    var normals = [];
    var uvs = [];

    // some helper variables

    var segment;
    var radius = innerRadius;
    var radiusStep = ( ( outerRadius - innerRadius ) / phiSegments );
    var vertex = new three.Vector3();
    new three.Vector2();
    var j, i;

    // generate vertices, normals and uvs

    for (j = 0; j <= phiSegments; j++) {

        for (i = 0; i <= thetaSegments; i++) {

            // values are generate from the inside of the ring to the outside

            segment = thetaStart + i / thetaSegments * thetaLength;

            // vertex

            vertex.x = radius * Math.cos(segment);
            vertex.y = radius * Math.sin(segment);

            vertices.push(vertex.x, vertex.y, vertex.z);

            // normal

            normals.push(0, 0, 1);

            // uv

            uvs.push(i / thetaSegments);
            uvs.push(j / phiSegments);

        }

        // increase the radius for next row of vertices

        radius += radiusStep;

    }

    // indices

    for (j = 0; j < phiSegments; j++) {

        var thetaSegmentLevel = j * ( thetaSegments + 1 );

        for (i = 0; i < thetaSegments; i++) {

            segment = i + thetaSegmentLevel;

            var a = segment;
            var b = segment + thetaSegments + 1;
            var c = segment + thetaSegments + 2;
            var d = segment + 1;

            // faces

            indices.push(a, b, d);
            indices.push(b, c, d);

        }

    }

    // build geometry

    this.setIndex(indices);
    this.addAttribute('position', new three.Float32BufferAttribute(vertices, 3));
    this.addAttribute('normal', new three.Float32BufferAttribute(normals, 3));
    this.addAttribute('uv', new three.Float32BufferAttribute(uvs, 2));

}

RadialRingBufferGeometry.prototype = Object.create(three.BufferGeometry.prototype);
RadialRingBufferGeometry.prototype.constructor = RadialRingBufferGeometry;

var img = "data:image/png;base64,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";

/**
 * Created by vlad.chirkov on 2.6.17.
 */

class LightRing {
    constructor(innerR, outerR, segments, thetaLength, {color, opacity, x, y, z}) {
        this._innerR = innerR;
        this._outerR = outerR;
        this._segments = segments;
        this._color = color;
        this._opacity = opacity;

        this.geometry = new RadialRingGeometry(this._innerR, this._outerR, this._segments, null, 0, thetaLength);
        this.material = this.material = new three.MeshBasicMaterial({
            color: this._color,
            map: InlineTextureLoader.load(img),
            transparent: true,
            opacity: this._opacity,
            blending: three.NormalBlending
        });
        this.mesh = new three.Mesh(this.geometry, this.material);
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
            this._color = new three.Color(val);
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

/**
 * Created by vlad.chirkov on 2.6.17.
 */

class HighLightedCirclePoints {
    constructor(circlesNumber, circlesVisible, radius, space, pointsNumber, {
        pointsColor,
        ringColor,
        opacity,
        impact,
        stabilityStart,
        stabilityEnd,
        diffusion,
        rotation,
        perlin,
        ringInside,
        ringOutside,
        x,
        y,
        z
    }) {
        this._circlesNumber = circlesNumber;
        this._circlesVisible = circlesVisible;
        this._radius = radius;
        this._space = space;
        this._pointsNumber = pointsNumber;

        this._pointsColor = pointsColor;
        this._ringColor = ringColor;

        this._opts = {pointsColor, ringColor, opacity, impact, stabilityStart, stabilityEnd, diffusion};

        this._rotation = {
            speed: rotation,
            time: 0
        };

        this._perlin = {
            speed: perlin,
            time: 0
        };

        this._ringInside = ringInside || 1;
        this._ringOutside = ringOutside || 1;
        this._innerR = this._radius * this._ringInside;
        this._outerR = (this._radius + this._space * this._circlesNumber) * this._ringOutside;
        this.circles = [];

        for (let i = 0; i < this._circlesNumber; i++) {
            let r = this._radius + this._space * i;
            let n = this._pointsNumber - i * this._opts.diffusion | 0;
            this.circles.push(new CircularPoints(r, n, {
                color: pointsColor,
                impact,
                visibility: i < this._circlesVisible,
                x,
                y,
                z
            }));
        }

        this.stability(stabilityStart, stabilityEnd);

        this.ring = new LightRing(this._innerR, this._outerR, 50, Math.PI * 2, {color: ringColor, opacity, x, y, z});
    }

    uniform(name, valFrom, valTo) {
        if (!valTo) {
            return this.circles.map((circle) => circle.uniform(name, valFrom));
        } else {
            let valStep = (valTo - valFrom) / this.circles.length;
            return this.circles.map((circle, i) => circle.uniform(name, valFrom + valStep * i));
        }
    }

    stability(valFrom, valTo) {
        if (valFrom !== undefined) {
            this._opts.stabilityStart = valFrom;
        }

        if (valTo !== undefined) {
            this._opts.stabilityEnd = valTo;
        }

        this.uniform('stability', this._opts.stabilityStart, this._opts.stabilityEnd);
    }

    stabilityStart(val) {
        if (val !== undefined) {
            this._opts.stabilityStart = val;
            this.uniform('stability', val, this._opts.stabilityEnd);
        }
        return this._opts.stabilityStart;
    }

    stabilityEnd(val) {
        if (val !== undefined) {
            this._opts.stabilityEnd = val;
            this.uniform('stability', this._opts.stabilityStart, val);
        }
        return this._opts.stabilityEnd;
    }

    impact(val) {
        if (val !== undefined) {
            this._opts.impact = val;
            this.uniform('impact', val);
        }
        return this._opts.impact;
    }

    pointsColor(val) {
        if (val !== undefined) {
            this._pointsColor = val;
            this.circles.forEach(circle => circle.color(val));
        }

        return this._pointsColor;
    }

    ringColor(val) {
        if (val !== undefined) {
            this._ringColor = val;
            this.ring.color(val);
        }

        return this._ringColor;
    }

    rotation(speed) {
        if (speed !== undefined) {
            this._rotation.speed = speed;
        }
        return this._rotation.speed;
    }

    perlin(speed) {
        if (speed !== undefined) {
            this._perlin.speed = speed;
        }
        return this._perlin.speed;
    }

    update(step) {
        this._rotation.time += this._rotation.speed * step;
        this._perlin.time += this._perlin.speed * step;

        this.uniform('rotation', this._rotation.time);
        this.uniform('perlin', this._perlin.time);
    }

    circlesVisible(circlesVisible, opacityStep) {
        if (circlesVisible !== undefined) {
            this._circlesVisible = circlesVisible | 0;
            this.circles.forEach((circle, i) => {
                if (i < this._circlesVisible) {
                    if (circle.opacity() < 1) {
                        circle.opacity(Math.min(circle.opacity() + opacityStep, 1));
                    }
                    if (circle.opacity() > 0) {
                        circle.visible(true);
                    }
                } else {
                    if (circle.opacity() === 0) {
                        circle.visible(false);
                    } else {
                        circle.opacity(Math.max(circle.opacity() - opacityStep, 0));
                    }

                }

            });
        }
        return this._circlesVisible;

    }

}

var noiseBackgroundVert = "varying vec2 vUv;\n\nvoid main( void ) {\n\tvUv = vec2(uv.x * 2.0, uv.y * 4.0);\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}";

var noiseBackgroundFrag = "//\n// Description : Array and textureless GLSL 3D simplex noise function.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110409 (stegu)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//\n\nuniform float time;\nuniform float opacity;\nuniform vec3 color;\nvarying vec2 vUv;\n\nvec4 permute( vec4 x ) {\n\n\treturn mod( ( ( x * 34.0 ) + 1.0 ) * x, 289.0 );\n\n}\n\nvec4 taylorInvSqrt( vec4 r ) {\n\n\treturn 1.79284291400159 - 0.85373472095314 * r;\n\n}\n\nfloat snoise( vec3 v ) {\n\n\tconst vec2 C = vec2( 1.0 / 6.0, 1.0 / 3.0 );\n\tconst vec4 D = vec4( 0.0, 0.5, 1.0, 2.0 );\n\n\t// First corner\n\n\tvec3 i  = floor( v + dot( v, C.yyy ) );\n\tvec3 x0 = v - i + dot( i, C.xxx );\n\n\t// Other corners\n\n\tvec3 g = step( x0.yzx, x0.xyz );\n\tvec3 l = 1.0 - g;\n\tvec3 i1 = min( g.xyz, l.zxy );\n\tvec3 i2 = max( g.xyz, l.zxy );\n\n\tvec3 x1 = x0 - i1 + 1.0 * C.xxx;\n\tvec3 x2 = x0 - i2 + 2.0 * C.xxx;\n\tvec3 x3 = x0 - 1. + 3.0 * C.xxx;\n\n\t// Permutations\n\n\ti = mod( i, 289.0 );\n\tvec4 p = permute( permute( permute(\n\t\t\t i.z + vec4( 0.0, i1.z, i2.z, 1.0 ) )\n\t\t   + i.y + vec4( 0.0, i1.y, i2.y, 1.0 ) )\n\t\t   + i.x + vec4( 0.0, i1.x, i2.x, 1.0 ) );\n\n\t// Gradients\n\t// ( N*N points uniformly over a square, mapped onto an octahedron.)\n\n\tfloat n_ = 1.0 / 7.0; // N=7\n\n\tvec3 ns = n_ * D.wyz - D.xzx;\n\n\tvec4 j = p - 49.0 * floor( p * ns.z *ns.z );  //  mod(p,N*N)\n\n\tvec4 x_ = floor( j * ns.z );\n\tvec4 y_ = floor( j - 7.0 * x_ );    // mod(j,N)\n\n\tvec4 x = x_ *ns.x + ns.yyyy;\n\tvec4 y = y_ *ns.x + ns.yyyy;\n\tvec4 h = 1.0 - abs( x ) - abs( y );\n\n\tvec4 b0 = vec4( x.xy, y.xy );\n\tvec4 b1 = vec4( x.zw, y.zw );\n\n\n\tvec4 s0 = floor( b0 ) * 2.0 + 1.0;\n\tvec4 s1 = floor( b1 ) * 2.0 + 1.0;\n\tvec4 sh = -step( h, vec4( 0.0 ) );\n\n\tvec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;\n\tvec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;\n\n\tvec3 p0 = vec3( a0.xy, h.x );\n\tvec3 p1 = vec3( a0.zw, h.y );\n\tvec3 p2 = vec3( a1.xy, h.z );\n\tvec3 p3 = vec3( a1.zw, h.w );\n\n\t// Normalise gradients\n\n\tvec4 norm = taylorInvSqrt( vec4( dot( p0, p0 ), dot( p1, p1 ), dot( p2, p2 ), dot( p3, p3 ) ) );\n\tp0 *= norm.x;\n\tp1 *= norm.y;\n\tp2 *= norm.z;\n\tp3 *= norm.w;\n\n\t// Mix final noise value\n\n\tvec4 m = max( 0.6 - vec4( dot( x0, x0 ), dot( x1, x1 ), dot( x2, x2 ), dot( x3, x3 ) ), 0.0 );\n\tm = m * m;\n\treturn 42.0 * dot( m*m, vec4( dot( p0, x0 ), dot( p1, x1 ),\n\t\t\t\t\t\t\t\t  dot( p2, x2 ), dot( p3, x3 ) ) );\n\n}\n\nfloat surface( vec3 coord ) {\n\n\tfloat n = 0.0;\n\n\tn += 0.7  * abs( snoise( coord ) );\n\tn += 0.25 * abs( snoise( coord * 2.0 ) );\n\n\treturn n;\n\n}\n\nvoid main( void ) {\n\n\tvec3 coord = vec3( vUv, -time );\n\n\tfloat n = surface( coord );\n\n\tgl_FragColor = vec4( color, n * opacity);\n\n}\n\n\t\t";

/**
 * Created by vlad.chirkov on 31.5.17.
 */

class FloatsMaterial extends three.MeshBasicMaterial {
    constructor(parameters) {
        super(parameters);
        this.type = 'FloatsMaterial';

        this.uniforms = {
            ...three.UniformsUtils.clone(three.ShaderLib.basic.uniforms),
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

/**
 * Created by vlad.chirkov on 14/07/2017.
 */

class Floats {
    constructor({impact, speed, color, opacity}) {
        this.opts = {
            impact: impact || 1,
            speed: speed || 0.0001,
            color: new three.Color(color),
            opacity
        };

        this.geometry = new three.PlaneGeometry(window.innerWidth, window.innerHeight);
        this.material = new FloatsMaterial({
            color: this.opts.color,
            transparent: true,
            opacity: this.opts.opacity,
        });

        this.mesh = new three.Mesh(this.geometry, this.material);
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

/**
 * Created by vlad.chirkov on 10/3/17.
 */
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
    floatsColor: 0x000000
};

const neutral1 = {
    visible: 10,
    opacityStep: 0.125,
    pointsColor: 0xffffff,
    ringColor: 0xffffff,
    opacity: 0.1,
    impact: 0.04,
    stabilityStart: 1.05,
    stabilityEnd: 0.95,
    rotation: 0.0005,
    perlin: 0.00025,
    background: 0x4B4BC8,
    floatsOpacity: 0.6
};

const neutral2 = {
    visible: 25,
    opacityStep: 0.125,
    pointsColor: 0xffffff,
    ringColor: 0xffffff,
    opacity: 0,
    impact: 0.04,
    stabilityStart: 1.05,
    stabilityEnd: 0.95,
    rotation: 0.0005,
    perlin: 0.00025,
    background: 0x1a1a7f,
    floatsOpacity: 0.6
};

const negative1 = {
    visible: 40,
    opacityStep: 0.125,
    pointsColor: 0xffff00,
    ringColor: 0xffff00,
    opacity: 0.3,
    impact: 0.07,
    stabilityStart: 1.25,
    stabilityEnd: 0.85,
    rotation: 0.001,
    perlin: 0.0005,
    background: 0xff0000,
    floatsOpacity: 1.1
};

const negative2 = {
    visible: 40,
    opacityStep: 0.125,
    pointsColor: 0xffff00,
    ringColor: 0xffff00,
    opacity: 0.4,
    impact: 0.08,
    stabilityStart: 1.15,
    stabilityEnd: 1.15,
    rotation: 0.001,
    perlin: 0.0005,
    background: 0xff0000,
    floatsOpacity: 1.1
};

const positive1 = {
    visible: 30,
    opacityStep: 0.125,
    pointsColor: 0xffffff,
    ringColor: 0xffffff,
    opacity: 0,
    impact: 0.001,
    stabilityStart: 1.25,
    stabilityEnd: 1.25,
    rotation: 0.0001,
    perlin: 0.00005,
    background: 0x24E65F,
    floatsOpacity: 0.5
};

const positive2 = {
    visible: 25,
    opacityStep: 0.125,
    pointsColor: 0xffffff,
    ringColor: 0xffffff,
    opacity: 0,
    impact: 0.0001,
    stabilityStart: 1.25,
    stabilityEnd: 1.25,
    rotation: 0.0001,
    perlin: 0.00005,
    background: 0x24E65F,
    floatsOpacity: 0.7
};

/**
 * Created by vchirkov on 6/23/2017.
 */

const presets = {
    normal: neutral1,
    progress: {
        bad: negative1,
        normal: neutral2,
        good: positive1
    },
    end: {
        bad: negative2,
        good: positive2
    }
};

/**
 * @class WebglStuff
 * @extends EventEmitter
 * @classdesc Class, that organizes CircularPoints, Floats and LightRing in one system
 */
class WebglStuff extends events.EventEmitter {
    /**
     * @constructor
     * @param {HTMLElement} el - Container element for scene <canvas/>
     * @param {Object} [initial = constants.initial] - params, that won't change through time
     * @param {Object} [preset = constants.neutral1] - params, that can be changed
     */
    constructor(el, initial$1 = initial, preset = neutral1) {
        super();
        if (!el) {
            throw new Error('container element is not found. Please pass it as first argument to WebglStuff constructor');
        }

        this.initial = {...initial$1, ...preset};

        this.sceneSet = new SceneSet(el, this.initial.background);

        this.highCircle = new HighLightedCirclePoints(this.initial.circles, this.initial.visible, this.initial.r, this.initial.space, this.initial.points, {
            pointsColor: new three.Color(this.initial.pointsColor),
            ringColor: new three.Color(this.initial.ringColor),
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
        preset.pointsColor !== undefined && this.highCircle.pointsColor(new three.Color(preset.pointsColor));
        preset.ringColor !== undefined && this.highCircle.ringColor(new three.Color(preset.ringColor));
        preset.opacity !== undefined && this.highCircle.ring.opacity(preset.opacity);
        preset.impact !== undefined && this.highCircle.impact(preset.impact);
        preset.stabilityStart !== undefined && this.highCircle.stabilityStart(preset.stabilityStart);
        preset.stabilityEnd !== undefined && this.highCircle.stabilityEnd(preset.stabilityEnd);
        preset.rotation !== undefined && this.highCircle.rotation(preset.rotation);
        preset.perlin !== undefined && this.highCircle.perlin(preset.perlin);
        preset.background !== undefined && this.sceneSet.renderer.setClearColor(new three.Color(preset.background));
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
        if (!(this._transitionTo.pointsColor instanceof three.Color)) {
            this._transitionTo.pointsColor = new three.Color(this._transitionTo.pointsColor);
        }

        if (!(this._transitionTo.ringColor instanceof three.Color)) {
            this._transitionTo.ringColor = new three.Color(this._transitionTo.ringColor);
        }

        if (!(this._transitionTo.background instanceof three.Color)) {
            this._transitionTo.background = new three.Color(this._transitionTo.background);
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
            visible: tweenFunctions.easeOutCubic(cur, from.visible, to.visible, dur),
            opacityStep: to.opacityStep,
            pointsColor: new three.Color(
                tweenFunctions.easeOutCubic(cur, from.pointsColor.r, to.pointsColor.r, dur),
                tweenFunctions.easeOutCubic(cur, from.pointsColor.g, to.pointsColor.g, dur),
                tweenFunctions.easeOutCubic(cur, from.pointsColor.b, to.pointsColor.b, dur)
            ),
            ringColor: new three.Color(
                tweenFunctions.easeOutCubic(cur, from.ringColor.r, to.ringColor.r, dur),
                tweenFunctions.easeOutCubic(cur, from.ringColor.g, to.ringColor.g, dur),
                tweenFunctions.easeOutCubic(cur, from.ringColor.b, to.ringColor.b, dur)
            ),
            opacity: tweenFunctions.easeOutCubic(cur, from.opacity, to.opacity, dur),
            impact: tweenFunctions.easeOutCubic(cur, from.impact, to.impact, dur),
            stabilityStart: tweenFunctions.easeOutCubic(cur, from.stabilityStart, to.stabilityStart, dur),
            stabilityEnd: tweenFunctions.easeOutCubic(cur, from.stabilityEnd, to.stabilityEnd, dur),
            rotation: tweenFunctions.easeOutCubic(cur, from.rotation, to.rotation, dur),
            // perlin: tween(cur, from.perlin, to.perlin, dur),
            background: new three.Color(
                tweenFunctions.linear(cur, from.background.r, to.background.r, dur),
                tweenFunctions.linear(cur, from.background.g, to.background.g, dur),
                tweenFunctions.linear(cur, from.background.b, to.background.b, dur)
            ),
            floatsOpacity: tweenFunctions.easeOutCubic(cur, from.floatsOpacity, to.floatsOpacity, dur)
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
WebglStuff.initial = initial;

module.exports = WebglStuff;

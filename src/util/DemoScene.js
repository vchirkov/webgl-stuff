import {WebGLRenderer, Scene, PerspectiveCamera} from 'three';
import TrackballControls from 'three-trackballcontrols';
import Stats from 'stats.js';
import dat from 'dat.gui/build/dat.gui';


export  default class DemoScene {
    constructor(el, color = 0x000000, stats = false, gui = false, controls = false) {
        this.el = el;
        this.renderer = new WebGLRenderer({antialias: true, alpha: true});
        this.renderer.setClearColor(color, 1);
        this.el.appendChild(this.renderer.domElement);
        this._prevTime = 0;

        this.scene = new Scene();
        this.camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 5, 5000);
        this.camera.position.set(0, 0, 500);

        if (gui) {
            this.gui = new dat.GUI();
        }

        if (controls) {
            this.initControls();
        }

        if (stats) {
            this.stats = new Stats();
            this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(this.stats.dom);
        }

        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    static create(...args) {
        return new DemoScene(...args);
    }

    initControls() {
        this.controls = new TrackballControls(this.camera, this.el);
        this.controls.rotateSpeed = 10;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.9;
        this.controls.noZoom = false;
        this.controls.noPan = false;
        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;
        this.controls.keys = [65, 17, 16];
    }

    onWindowResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    update() {
        this.stats && this.stats.begin();
        this.controls && this.controls.update();
        this.stats && this.stats.end();
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
        this.update();
        this.render();
    }
}
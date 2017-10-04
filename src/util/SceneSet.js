import {WebGLRenderer, Scene, PerspectiveCamera} from 'three';

export  default class SceneSet {
    constructor(el, color = 0x000000) {
        this.el = el;
        this.renderer = new WebGLRenderer({antialias: true, alpha: true});
        this.renderer.setClearColor(color, 1);
        this.el.appendChild(this.renderer.domElement);
        this._prevTime = 0;

        this.scene = new Scene();
        this.camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 5, 5000);
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
/**
 * Created by vlad.chirkov on 10/9/17.
 */
import TrackballControls from 'three-trackballcontrols';
import Stats from 'stats.js';
import dat from 'dat.gui/build/dat.gui';
import WebglStuff from '../src/index';
import * as clipboard from 'clipboard-polyfill/text';
import Noty from 'noty';
import 'noty/lib/noty.css';

const KEYS = [
    65, // 'a'
    17, // 'ctrl',
    16  // 'alt'
];

export default class Demo {
    constructor(el, preset = {...WebglStuff.presets.normal}, duration = 3000) {
        this.el = el;
        this.preset = preset;
        this.duration = duration;

        this.wgs = new WebglStuff(this.el, WebglStuff.initial, this.preset);
        this.sceneSet = this.wgs.sceneSet;

        this.gui = new dat.GUI();
        this.controls = new TrackballControls(this.sceneSet.camera, this.sceneSet.el);
        this.stats = new Stats();

        this.initGui();
        this.initControls();
        this.initStats();

        this.bindUpdate();
    }

    initGui() {
        // duration
        this.gui.add(this, 'duration')
            .min(0).max(60 * 1000)
            .step(100)
            .onChange(() => this.transit());

        this.initGuiPresetButtons().open();
        this.initGuiCircles().open();
        this.initGuiHighlight();
        this.initGuiBackground();
        this.initClipboard();
    }

    initGuiCircles() {
        let circles = this.gui.addFolder('Circles settings');
        circles.add(this.preset, 'visible')
            .min(0).max(WebglStuff.initial.circles)
            .step(1)
            .onChange(() => this.transit());
        circles.add(this.preset, 'opacityStep')
            .min(0).max(1)
            .step(0.1)
            .onChange(() => this.transit());
        circles.addColor(this.preset, 'pointsColor')
            .onChange(() => this.transit());
        circles.add(this.preset, 'impact')
            .min(-1).max(1)
            .step(0.001)
            .onChange(() => this.transit());
        circles.add(this.preset, 'stabilityStart')
            .min(0.5).max(2)
            .step(0.001)
            .onChange(() => this.transit());
        circles.add(this.preset, 'stabilityEnd')
            .min(0.5).max(2)
            .step(0.001)
            .onChange(() => this.transit());
        circles.add(this.preset, 'rotation')
            .min(-0.01).max(0.01)
            .step(0.00001)
            .onChange(() => this.transit());
        circles.add(this.preset, 'perlin')
            .min(-0.01).max(0.01)
            .step(0.00001)
            .onChange(() => this.transit());
        return circles;
    }

    initGuiHighlight() {
        let highlight = this.gui.addFolder('Highlight settings');
        highlight.addColor(this.preset, 'ringColor')
            .onChange(() => this.transit());
        highlight.add(this.preset, 'opacity')
            .min(0).max(1)
            .step(0.1)
            .onChange(() => this.transit());
        return highlight;
    }

    initGuiBackground() {
        let background = this.gui.addFolder('Background settings');
        background.addColor(this.preset, 'background')
            .onChange(() => this.transit());
        background.add(this.preset, 'floatsOpacity')
            .min(0).max(1)
            .step(0.01)
            .onChange(() => this.transit());
        return background;
    }

    initGuiPresetButtons() {

        let presetActions = {
            'neutral': () => this.transit(WebglStuff.presets.progress.normal, true),
            'positive': () => this.transit(WebglStuff.presets.progress.good, true),
            'negative': () => this.transit(WebglStuff.presets.progress.bad, true),
            'more negative': () => this.transit(WebglStuff.presets.end.bad, true)
        };


        let presetButtons = this.gui.addFolder('Presets');
        presetButtons.add(presetActions, 'neutral');
        presetButtons.add(presetActions, 'positive');
        presetButtons.add(presetActions, 'negative');
        presetButtons.add(presetActions, 'more negative');
        return presetButtons;
    }

    initClipboard() {
        let clipboardAction = {
            'copy preset': () => {
                try {
                    clipboard.writeText(JSON.stringify(this.preset, null, 4))
                        .then(() => new Noty({
                            type: 'success',
                            text: 'Yay, copied :)',
                            layout: 'bottomRight',
                            progressBar: false,
                            killer: true,
                            timeout: 1000,
                            animation: {
                                close: null
                            }
                        }).show());
                } catch (e) {
                    new Noty({
                        type: 'error',
                        text: 'Huh, couldn\'t copy :(',
                        layout: 'bottomRight',
                        killer: true,
                        timeout: 1000
                    }).show()
                }
            }
        };
        this.gui.add(clipboardAction, 'copy preset');
        return this.gui;
    }

    transit(preset, update = false) {
        if (preset) {
            Object.assign(this.preset, preset);
            Object.values(this.gui.__folders).forEach(folder => folder.__controllers.forEach(c => c.updateDisplay()));
        }
        this.wgs.transitTo(this.preset, this.duration);
    }

    initControls() {
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.9;
        this.controls.noRotate = true;
        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;
        this.controls.keys = KEYS;
    }

    initStats() {
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom);
    }

    bindUpdate() {
        this.wgs.on(WebglStuff.ON_BEFORE_UPDATE, () => this.stats.begin());
        this.wgs.on(WebglStuff.ON_UPDATE, () => this.controls.update());
        this.wgs.on(WebglStuff.ON_AFTER_UPDATE, () => this.stats.end());
    }
}

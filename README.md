# Webgl stuff
Circular set of points, that can change it's behaviour dynamically.
Whole thing consists of:
* Floating points [source](./src/circularPoints/circularPoints.js)
* Highlight [source](./src/lightRing/lightRing.js)
* Noise background [source](./src/floats/floats.js)


## Installation
```
npm install webgl-stuff --save
```
[**webgl-stuff.js**+ source files]()  
[**webgl-stuff.min.js**]()

## Usage
```javascript
import WebglStuff from 'webgl-stuff';
const ws = new WebglStuff(document.getElementById('container'));
ws.transitTo(preset, duration);
```
```javascript
const ws = require('webgl-stuff')(document.getElementById('container'));
ws.transitTo(preset, duration);
```
```javascript
let ws = new WebglStuff(document.getElementById('container'));

(async () => {
    await timeout(5000);
    await ws.transitTo(WebglStuff.presets.progress.bad, 3000);
    await timeout(5000);
    await ws.transitTo(WebglStuff.presets.progress.normal, 5000);
})();

function timeout(dur) {
    return new Promise((res) => setTimeout(res, dur));
}
```

### Arguments
```javascript
/**
 * @class WebglStuff
 * @extends EventEmitter
 * @classdesc Class, that organizes CircularPoints, Floats and LightRing in one system
 */
export default class WebglStuff extends EventEmitter {
    /**
     * @constructor
     * @param {HTMLElement} el - Container element for scene <canvas/>
     * @param {Object} [initial = constants.initial] - params, that won't change through time
     * @param {Object} [preset = constants.neutral1] - params, that can be changed
     */
    constructor(el, initial = constants.initial, preset = constants.neutral1) {
        // ...
    }
    //...
```

#### **el**
Any `<div/>` with reasonable size should work.  
As calculation is executed per pixel, big elements can cause lags
#### **initial** 
Set of initial, unchangeable props
  * **x: 0** - position by `x` axis
  * **y: 0** - position by `y` axis
  * **z: 0** - position by `z` axis
  * **circles: 45** - number of particle circles
  * **r: 50** - inner radius of ring set (radius of the smallest particle ring)
  * **ringInside: 0.1** - inner radius of highlight circle
  * **ringOutside: 1.5** - outer radius of highlight circle
  * **space: 1** - distance between circles  
  biggest particle circle will have `radius = r + space * circles`
  * **points: 100** - number of points for smallest circle
  * **diffusion: 0.5** - reduction of points based on ring index  
  `pointsNumber = points - diffusion * ringIndex`
  * **floatsColor: new Color(0x000000)** - color of background noise.  
  *to avoid dirty blending it's suggested to use either #000 or #fff*
#### **preset**
Set of props, that can mutate through time
  * **visible: 10** - how many circles are visible right now
  * **opacityStep: 0.125** - how much should opacity change with each frame according to *visible* prop
  * **pointsColor: new Color(1, 1, 1)** - color of circular points
  * **ringColor: new Color(1, 1, 1)** - color of highlight ring
  * **opacity: 0.1** - opacity of highlight ring
  * **impact: 0.04** - how *rattling*
  * **stabilityStart: 1.05** - how big is the amplitude for inner circle
  * **stabilityEnd: 0.95** - how big is the amplitude for outer circle
  * **rotation: 0.0005** - rotation speed for circles 
  * **perlin: 0.00025** - perlin noise seed offset  
  (don't think about it too much, just play around)
  * **background: new Color(0.295, 0.295, 0.78)** - background color
  * **floatsOpacity: 0.6** - opacity of noise background

## Methods
### transitTo()
```javascript
// ...
await ws.transitTo(preset, duration);
// ...
```
**preset** - full or partial set of changeable props
```javascript
// ...
// transition to "normal" preset
await ws.transitTo(WebglStuff.presets.progress.normal, duration);
// ...
```
```javascript
// ...
// only change number of visible circles
await ws.transitTo({visible: 10}, duration);
// ...
```
**duration** - duration of transition in ms.
```javascript
// ...
// transition will take one second
await ws.transitTo(preset, 1000);
// ...
```
### stopTransition()
interrupt current transition.
Will **reject** promise from transitTo, that is in progress 
```javascript
// ...
// interrupt current transition
ws.stopTransition();
// ...
```
### endTransition()
finish current transition.
Will **resolve** promise from transitTo, that is in progress 
```javascript
// ...
// finish current transition
ws.endTransition();
// ...
```
## Events
events available:
* **WebglStuff.ON_TRANSITION_START** - emits, when all transition parameters are ready, but no transition update was applied
* **WebglStuff.ON_TRANSITION_PROGRESS** - emits on evety transition tick
* **WebglStuff.ON_TRANSITION_STOP** - emits, when transition was stopped
* **WebglStuff.ON_TRANSITION_END** - emits, when transition was ended manually or after transition reached end state
* **WebglStuff.ON_BEFORE_UPDATE** - emits, before any updates
* **WebglStuff.ON_UPDATE** - emits, when transition params have been updated, but no changes were applied to the objects
* **WebglStuff.ON_AFTER_UPDATE** - emits, when changes were applied to the objects
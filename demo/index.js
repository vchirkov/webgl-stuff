/**
 * Created by vlad.chirkov on 30.5.17.
 */

import WebglStuff from '../src';

let wgs = new WebglStuff(document.getElementById('container'));

(async () => {
    await timeout(5000);
    await wgs.transitTo(WebglStuff.presets.progress.bad, 5000);
    await timeout(5000);
    await wgs.transitTo(WebglStuff.presets.progress.normal, 5000);
    await timeout(5000);
    wgs.transitTo(WebglStuff.presets.progress.good, 5000);
    await timeout(1000);
    await wgs.transitTo(WebglStuff.presets.end.bad, 5000);
    await timeout(7000);
    await wgs.transitTo(WebglStuff.presets.end.good, 5000);
})();

function timeout(dur) {
    return new Promise((res) => setTimeout(res, dur));
}
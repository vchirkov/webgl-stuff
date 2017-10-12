/**
 * Created by vlad.chirkov on 30.5.17.
 */
import Demo from './Demo';

new Demo(document.getElementById('container'));

let greetings = `%cHi Mate!
Nice to meet you here,
but better check out the sources on Github :)
%chttps://github.com/vchirkov/webgl-stuff/ `;

console.log(greetings, 'font-size: 16px; color: #bada55;', 'color: #000000; font-size: 16px');

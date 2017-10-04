import {Texture} from 'three';

export default class InlineTextureLoader {
    static load(base64Image) {
        let texture = new Texture();
        texture.image = new Image();
        texture.image.onload = function () {
            texture.needsUpdate = true;
        };

        texture.image.src = base64Image;
        return texture;
    }
}
/**
 * Created by vlad.chirkov on 2.6.17.
 */
import CircularPoints from './circularPoints/CircularPoints';
import LightRing from './lightRing/LightRing';

export default class HighLightedCirclePoints {
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
                        circle.opacity(Math.min(circle.opacity() + opacityStep, 1))
                    }
                    if (circle.opacity() > 0) {
                        circle.visible(true);
                    }
                } else {
                    if (circle.opacity() === 0) {
                        circle.visible(false);
                    } else {
                        circle.opacity(Math.max(circle.opacity() - opacityStep, 0))
                    }

                }

            });
        }
        return this._circlesVisible;

    }

}

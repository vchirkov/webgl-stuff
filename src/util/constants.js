/**
 * Created by vlad.chirkov on 10/3/17.
 */
export const initial = {
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

export const neutral1 = {
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

export const neutral2 = {
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
    background: 0x4B4BC8,
    floatsOpacity: 0.6
};

export const negative1 = {
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

export const negative2 = {
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

export const positive1 = {
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

export const positive2 = {
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
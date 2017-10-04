/**
 * Created by vlad.chirkov on 10/3/17.
 */
import {Color} from 'three';

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
    floatsColor: new Color(0x000000)
};

export const neutral1 = {
    visible: 10,
    opacityStep: 0.125,
    pointsColor: new Color(1, 1, 1),
    ringColor: new Color(1, 1, 1),
    opacity: 0.1,
    impact: 0.04,
    stabilityStart: 1.05,
    stabilityEnd: 0.95,
    rotation: 0.0005,
    perlin: 0.00025,
    background: new Color(0.295, 0.295, 0.78),
    floatsOpacity: 0.6
};

export const neutral2 = {
    visible: 25,
    opacityStep: 0.125,
    pointsColor: new Color(1, 1, 1),
    ringColor: new Color(1, 1, 1),
    opacity: 0,
    impact: 0.04,
    stabilityStart: 1.05,
    stabilityEnd: 0.95,
    rotation: 0.0005,
    perlin: 0.00025,
    background: new Color(0.295, 0.295, 0.78),
    floatsOpacity: 0.6
};

export const negative1 = {
    visible: 40,
    opacityStep: 0.125,
    pointsColor: new Color(1, 1, 0),
    ringColor: new Color(1, 1, 0),
    opacity: 0.3,
    impact: 0.07,
    stabilityStart: 1.25,
    stabilityEnd: 0.85,
    rotation: 0.001,
    perlin: 0.0005,
    background: new Color(1, 0, 0),
    floatsOpacity: 1.1
};

export const negative2 = {
    visible: 40,
    opacityStep: 0.125,
    pointsColor: new Color(1, 1, 0),
    ringColor: new Color(1, 1, 0),
    opacity: 0.4,
    impact: 0.08,
    stabilityStart: 1.15,
    stabilityEnd: 1.15,
    rotation: 0.001,
    perlin: 0.0005,
    background: new Color(1, 0, 0),
    floatsOpacity: 1.1
};

export const positive1 = {
    visible: 30,
    opacityStep: 0.125,
    pointsColor: new Color(1, 1, 1),
    ringColor: new Color(1, 1, 1),
    opacity: 0,
    impact: 0.001,
    stabilityStart: 1.25,
    stabilityEnd: 1.25,
    rotation: 0.0001,
    perlin: 0.00005,
    background: new Color(0.14, 0.9, 0.372),
    floatsOpacity: 0.5
};

export const positive2 = {
    visible: 25,
    opacityStep: 0.125,
    pointsColor: new Color(1, 1, 1),
    ringColor: new Color(1, 1, 1),
    opacity: 0,
    impact: 0.0001,
    stabilityStart: 1.25,
    stabilityEnd: 1.25,
    rotation: 0.0001,
    perlin: 0.00005,
    background: new Color(0.14, 0.9, 0.372),
    floatsOpacity: 0.7
};
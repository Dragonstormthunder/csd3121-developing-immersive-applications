/**
 * @fileoverview This file contains the tests for dynamic UI features.
 * @author your instructors
 * @lastUpdated 2025-03-17
 */

import { expect, test, describe } from 'vitest';
import { Mesh, NullEngine, Vector3 } from '@babylonjs/core';
import { AdvancedDynamicTexture, TextBlock } from '@babylonjs/gui';
import { App } from '../src/app';

// create a new app with a null engine
const engine = new NullEngine();
const app = new App(engine);

// tests for the "hello plane" mesh...
// - existing with the name "hello plane"
// - having a text block named "hello text"
// - and able to display the current distance between the "sphere" and the world origin
//   (the distance should be updated when the "sphere" moves)
describe('Dynamic UI tests to see whether the "hello plane" mesh:', async () => {
    // create a new scene
    const scene = await app.createScene();

    // test whether a "hello plane" mesh exists
    const plane = scene.getMeshByName('hello plane') as Mesh;
    test('exists as a type of Mesh,', () => {
        expect(plane).toBeInstanceOf(Mesh);
    });

    // test whether the "hello plane" mesh has a text block named "hello text"
    let textBlock: TextBlock;
    test('has a TextBlock with an AdvancedDynamicTexture', () => {
        const texture = scene.getTextureByName('hello texture') as AdvancedDynamicTexture;
        expect(texture).not.toBeNull();
        const control = texture.getControlByName('hello text') as TextBlock;
        expect(control).not.toBeNull();
        textBlock = control;
    });

    // test whether the "hello plane" mesh is able to display the current 
    // distance between the "sphere" and the "dragon" mesh
    test('and can display the current distance between the "sphere" and the "dragon".', () => {
        // get the "sphere" mesh from the scene
        const sphere = scene.getMeshByName('sphere') as Mesh;
        expect(sphere).toBeInstanceOf(Mesh);

        // get the "dragon" mesh from the scene
        const dragon = scene.getMeshByName('dragon') as Mesh;
        expect(dragon).toBeInstanceOf(Mesh);

        // get the distance between the "sphere" and the "dragon" mesh
        let d: string;
        sphere.position.set(Math.random() * 10, Math.random() * 10, Math.random() * 10);
        scene.render();
        d = Vector3.Distance(sphere.position, dragon.position).toFixed(2);
        expect(textBlock.text).toBe(`d: ${d}`);

        // move the "sphere" mesh to a new position and update the distance
        sphere.position.set(Math.random() * 10, Math.random() * 10, Math.random() * 10);
        scene.render();
        d = Vector3.Distance(sphere.position, dragon.position).toFixed(2);
        expect(textBlock.text).toBe(`d: ${d}`);
    });
});

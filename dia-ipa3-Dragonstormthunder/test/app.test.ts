/**
 * @fileoverview Tests for the App class.
 * @author your instructors
 * @lastUpdated 2025-03-18
 * @note that we removed VideoDome from last assignent to reduce complexity
 */

import { expect, test, describe, vi } from 'vitest';
import { Mesh, MeshBuilder, NullEngine, Scene } from '@babylonjs/core';
import { AdvancedDynamicTexture, TextBlock } from '@babylonjs/gui';
import { App } from '../src/app'
import * as hello from '../src/hello';

// create a new App instance with a NullEngine
const engine = new NullEngine();
const app = new App(engine);

// Basic scene tests from previous assignment:
// - the App class has a "createScene()" method
// - the "createScene()" method returns a promise
// - the Scene instance has a camera, a light, and a mesh
describe('Basic tests to check whether app.createScene()', async () => {
    const scenePromise = app.createScene();
    const scene = await scenePromise;

    test('created an instance of Scene, which at least has', () => {
        expect(scene).toBeInstanceOf(Scene);
    });
    test('a camera,', () => {
        expect(scene).toHaveProperty('cameras');
        expect(scene.cameras.length).toBeGreaterThanOrEqual(1);
    });
    test('a light,', () => {
        expect(scene).toHaveProperty('lights');
        expect(scene.lights.length).toBeGreaterThanOrEqual(1);
    });
    test('and a mesh.', () => {
        expect(scene).toHaveProperty('meshes');
        expect(scene.meshes.length).toBeGreaterThanOrEqual(1);
    });
});

// Various environment creation tasks from previous assignment:
// - has a video dome named "video dome" that plays a video named "video.mp4"
// - has a sphere mesh named "sphere"
// - has a plane mesh named "hello plane"
// - has a texture named "hello texture"
// - has a text control named "hello text" containing the text "Hello, XR!" created
// - the "Hello, XR!" message was created by the createHelloMessage() function
describe('Scene creation tests to check whether scene instance has:', async () => {
    const sphereSpy = vi.spyOn(MeshBuilder, 'CreateSphere');
    const planeSpy = vi.spyOn(MeshBuilder, 'CreatePlane');
    const helloSpy = vi.spyOn(hello, 'createHelloMessage');

    const scene = await app.createScene();

    describe('primitive meshes created by "MeshBuilder", including:', () => {
        test('a sphere mesh named "sphere"', () => {
            const sphere = scene.getMeshByName('sphere') as Mesh;
            expect(sphere).not.toBeNull();
            expect(sphereSpy).toHaveBeenCalled();
            expect(sphereSpy).toHaveReturnedWith(sphere);
        });
        test('and a plane mesh named "hello plane",', () => {
            const plane = scene.getMeshByName('hello plane') as Mesh;
            expect(plane).not.toBeNull();
            expect(planeSpy).toHaveBeenCalled();
            expect(planeSpy).toHaveReturnedWith(plane);
        });
    });

    describe('a "Hello, XR!" message displayed using:', () => {
        test('an "AdvancedDynamicTexture" named "hello texture",', () => {
            const texture = scene.getTextureByName('hello texture') as AdvancedDynamicTexture;
            expect(texture).not.toBeNull();
        });
        test('a "TextBlock" named "hello text"', () => {
            const texture = scene.getTextureByName('hello texture') as AdvancedDynamicTexture;
            expect(texture).not.toBeNull();
            const control = texture.getControlByName('hello text') as TextBlock;
            expect(control).not.toBeNull();
            expect(control).toHaveProperty('text', 'Hello, XR!');
        });
        test('and a string created by the createHelloMessage() function', () => {
            expect(helloSpy).toHaveBeenCalled();
            expect(helloSpy).toHaveBeenLastCalledWith('XR');
        });
    });
});

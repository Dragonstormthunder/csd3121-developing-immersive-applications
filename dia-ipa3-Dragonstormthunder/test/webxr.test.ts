/**
 * @fileoverview This file contains the tests for WebXR features.
 * @author your instructors
 * @lastUpdated 2025-03-17
 */

import { expect, test, describe, vi, beforeEach } from 'vitest';
import { NullEngine, WebXRDefaultExperience, WebXRDefaultExperienceOptions } from '@babylonjs/core';
import { App } from '../src/app';

// create a new app with a null engine
const engine = new NullEngine();
const app = new App(engine);

// tests whether:
// - the App creates a default WebXR experience
// - with a session mode of "immersive-vr"
// - camera named "webxr" is created
describe('WebXR initialization tests to see whether:', () => {
    const xrExpCreateSpy = vi.spyOn(WebXRDefaultExperience, "CreateAsync");

    // clear all the mocks before each test
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // test whether the createDefaultXRExperienceAsync API call is made
    // TODO determine method to gracefully log this as a failed test when 
    //      expected parameters are not found
    //      - currently, the test will pass if the parameters found
    //      - the test will run for ~30s and throw a "Worker exited unexpectedly" error
    test("a default XR experience is created asynchronously,", async () => {
        await app.createScene();
        expect(xrExpCreateSpy).toHaveBeenCalled();
    });

    // test whether the API call is made with the correct session mode
    test('with a session mode of "immersive-vr".', async () => {
        const scene = await app.createScene();
        expect(xrExpCreateSpy).toHaveBeenLastCalledWith(
            scene,
            expect.objectContaining({
                uiOptions: expect.objectContaining({
                    sessionMode: "immersive-vr",
                }),
            }) as WebXRDefaultExperienceOptions
        );
    });

    // test whether ground plane was set for teleportation in the XR experience
    // TODO find soln to the problem that is similar to the prev test above
    test('teleportation params are set correctly', async () => {
        const scene = await app.createScene();
        expect(xrExpCreateSpy).toHaveBeenLastCalledWith(
            scene,
            expect.objectContaining({
                teleportationOptions: expect.objectContaining({
                    timeToTeleport: 2000,
                    floorMeshes: [scene.getMeshByName("ground")],
                }),
            }) as WebXRDefaultExperienceOptions
        );
    }, 5000);
    
});

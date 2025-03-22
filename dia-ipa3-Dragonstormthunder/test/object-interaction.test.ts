/**
 * @fileoverview This file contains the tests for various interactions.
 * @author your instructors
 * @lastUpdated 2025-03-18
 */

import { expect, test, describe, vi, beforeAll } from 'vitest';
import { Matrix, Mesh, NullEngine, Scene, Vector3, Viewport } from '@babylonjs/core';
import { App } from '../src/app';

// create a new app with a null engine
const engine = new NullEngine();
const app = new App(engine);

/**
 * Get the screen coordinates of a mesh.
 * @param scene The scene.
 * @param mesh The mesh.
 * @returns The screen coordinates.
 */
function getScreenCoordinates(scene: Scene, mesh: Mesh) {
    const renderWidth = scene.getEngine().getRenderWidth();
    const renderHeight = scene.getEngine().getRenderHeight();

    return Vector3.Project(
        mesh.position, //vector to project
        Matrix.Identity(), //world matrix
        scene.getTransformMatrix(), //transform matrix
        new Viewport(0, 0, renderWidth, renderHeight) //viewport
    );
}

/**
 * Simulate a drag interaction.
 * @param scene The scene.
 * @param mesh The mesh.
 * @param toScreenX The x-coordinate to drag to.
 * @param toScreenY The y-coordinate to drag to.
 * @param moveCounts The number of move steps.
 */
function simulateDrag(scene: Scene, mesh: Mesh, toScreenX: number = 30, 
    toScreenY: number = toScreenX, moveCounts: number = 3) {
    let { x: screenX, y: screenY } = getScreenCoordinates(scene, mesh);
    let pickResult = scene.pick(screenX, screenY);
    const pointerEventInit = { pointerId: 1 } as PointerEventInit;
    const movementX = (toScreenX - screenX) / moveCounts;
    const movementY = (toScreenY - screenY) / moveCounts;

    for (let i = 0; i <= moveCounts; i++) {
        setTimeout(() => {
            // start drag
            if (i === 0) {
                console.log('================= drag start');
                console.log(`screenX: ${screenX.toFixed(2)}, screenY: ${screenY.toFixed(2)}, pickedMesh: ${pickResult.pickedMesh?.name} at frame ${scene.getFrameId()}`);
                scene.simulatePointerDown(pickResult, pointerEventInit);
            }

            // move drag
            if (i < moveCounts) {
                pickResult = scene.pick(screenX += movementX, screenY += movementY);
                console.log('----------------- drag move:', i);
                console.log(`screenX: ${screenX.toFixed(2)}, screenY: ${screenY.toFixed(2)} at frame ${scene.getFrameId()}`);
                scene.simulatePointerMove(pickResult, pointerEventInit);
            }

            // release drag
            if (i === moveCounts) {
                console.log(`================= drag end at frame ${scene.getFrameId()}`);
                scene.simulatePointerUp(pickResult, pointerEventInit);
            }
        }, 1000 * i);
    }

    console.log(`***mesh position at start (not updated yet): ${mesh.position.x.toFixed(2)}, ${mesh.position.y.toFixed(2)}, ${mesh.position.z.toFixed(2)}`);
}

/**
 * Simulate a click interaction.
 * @param scene The scene.
 * @param mesh The mesh to click.
 */
 function simulateClick(scene: Scene, mesh: Mesh) {
    const { x: screenX, y: screenY } = getScreenCoordinates(scene, mesh);
    const pickResult = scene.pick(screenX, screenY);
    const pointerEventInit = { pointerId: 1 } as PointerEventInit;

    console.log('================= click');
    console.log(`screenX: ${screenX.toFixed(2)}, screenY: ${screenY.toFixed(2)}, pickedMesh: ${pickResult.pickedMesh?.name} at frame ${scene.getFrameId()}`);
    console.log('================= click end')

    scene.simulatePointerDown(pickResult, pointerEventInit);
    scene.simulatePointerUp(pickResult, pointerEventInit);
}

// tests for the "dragon" mesh...
// - existing with the name "dragon"
// - at a certain position and scale
describe('New custom dragon object test loaded from "https://raw.githubusercontent.com/BabylonJS/Assets/master/meshes/Georgia-Tech-Dragon/dragon.glb" ', async () => {
    const scene = await app.createScene();
    const dragon = await vi.waitUntil(
        () => scene.getMeshByName('dragon')! as Mesh,
        { timeout: 15000, interval: 1000 }
    );

    test('exists as a type of Mesh,', () => {
        expect(dragon).not.toBeNull();
        expect(dragon).toBeInstanceOf(Mesh);
    });

    test('positioned 10 units to the rear,', () => {
        expect(dragon.position.toString()).toEqual(new Vector3(0, 0, 10).toString());
    });
     
    test('and enlarged 30 times.', () => {
        expect(dragon.scaling.toString()).toEqual(new Vector3(30, 30, 30).toString());
    });
});

// tests for the "sphere" mesh interactions...
// - existing with the name "sphere"
// - pickable with a pointer device
// - draggable with a pointer device
// - and will scale to twice its size in one second when clicked
describe('Object interaction tests to check whether the "sphere" mesh:', async () => {
    // setup the fake PointerEvent to simulate the mouse events
    beforeAll(() => {
        (window as any).PointerEvent =
            function (type: string, pointerEventInit?: PointerEventInit) {
                const evt = new (window as any).MouseEvent(type, pointerEventInit);
                evt.pointerId = pointerEventInit?.pointerId;
                evt.pointerType = 'mouse';
                return evt as PointerEvent;
            };
        vi.useFakeTimers(); // this is needed to simulate the time
    });

    // create a new scene and set the constant animation delta time to true
    const scene = await app.createScene();
    scene.useConstantAnimationDeltaTime = true;

    // let scene render a frame to calculate the transform matrix
    scene.render();

    // get the "sphere" mesh from the scene
    const sphere = scene.getMeshByName('sphere') as Mesh;

    // test whether a "sphere" mesh exists
    test('exists as a type of Mesh,', () => {
        expect(sphere).toBeInstanceOf(Mesh);
    });

    // test whether the "sphere" mesh is pickable
    test('is pickable,', () => {
        const { x: screenX, y: screenY } = getScreenCoordinates(scene, sphere);
        const pickResult = scene.pick(screenX, screenY);
        expect(pickResult.pickedMesh).not.toBeNull();
        expect(pickResult.pickedMesh?.name).toBe('sphere');
    });

    // test whether the "sphere" mesh is draggable
    test('is draggable with a pointer device (such as a mouse or controller,)', () => {
        // run the render loop to update the scene
        engine.runRenderLoop(() => {
            scene.render();
        });

        // the drag test works by:
        // - simulating a drag event on the sphere mesh
        // - advancing the timers by the time it takes to move the sphere mesh
        // - checking the screen coordinates of the sphere mesh is close to expected
        function testDrag(scene: Scene, mesh: Mesh, toScreenX: number, toScreenY: number, moveCounts: number) {
            simulateDrag(scene, mesh, toScreenX, toScreenY, moveCounts);
            vi.advanceTimersByTime(1000 * moveCounts);
            console.log('***mesh position after drag:', 
                mesh.position.x.toFixed(2), mesh.position.y.toFixed(2), mesh.position.z.toFixed(2));
            const { x: screenX, y: screenY } = getScreenCoordinates(scene, mesh);
            console.log('***screen coordinates after drag:', screenX.toFixed(2), screenY.toFixed(2));
            console.log('\n');
            expect(screenX).toBeCloseTo(toScreenX, 2);
            expect(screenY).toBeCloseTo(toScreenY, 2);
        }
        testDrag(scene, sphere, 50, 60, 2);
        testDrag(scene, sphere, 90, 60, 3);
    });

    // test whether the "sphere" mesh will scale accordingly
    test('and will scale to twice its size in one second when clicked.', () => {
        sphere.scaling.setAll(1);
        console.log('***sphere scaling before click:', sphere.scaling.toString(), 'in frame:', scene.getFrameId());
        simulateClick(scene, sphere);

        // advance the timers by the time it takes to scale the sphere mesh
        // - 1000ms is the expected scaling duration
        // - 16ms is the duration of 1 frame when fixed at 60fps (1000/60 is roughly 16ms)
        //   and we add this 1 frame duration just to be sure the action completes
        vi.advanceTimersByTime(1016);

        console.log('***sphere scaling after click:', sphere.scaling.toString(), 'in frame:', scene.getFrameId());
        expect(sphere.scaling.toString()).toEqual(new Vector3(2, 2, 2).toString());
    });
});

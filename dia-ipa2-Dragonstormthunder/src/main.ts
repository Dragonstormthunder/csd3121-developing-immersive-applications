/**
 * @file    main.ts
 * @author  Emma Natalie Soh (2202191\@sit.singaporetech.edu.sg)
 * @par     CSD3121 Developing Immersive Applications
 * @date    2 March 2025
 *
 * @brief   The main entry point for the application.
 *              - initializes the BabylonJS engine
 *              - creates the scene and runs the render loop
 *
 * To run this in vite, we need to type the command
 * "npm run dev".
 */

import { Engine } from '@babylonjs/core';
import { App } from './app';

// get the canvas element and create the BabylonJS engine
const canvas = <HTMLCanvasElement>document.getElementById('renderCanvas');
const engine = new Engine(canvas, true);

// expose the engine instance to the window object for tests
(window as any).engine = engine;

// create a scene from a new BabylonJS app instance
// then run the render loop
const app = new App(engine);
app.createScene().then(scene => {
    engine.runRenderLoop(() => {
        scene.render();
    })
});

// resize the engine on window resize
window.addEventListener('resize', function () {
    engine.resize();
});

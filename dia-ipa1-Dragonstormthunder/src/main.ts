/**
 * @fileoverview The main class for the project.
 * @author your instructors
 * @lastUpdated 2024-01-04
 * @brief The main entry point for the application. 
 *        - initializes the BabylonJS engine
 *        - creates the scene and runs the render loop
 *
 * To run this in vite, we need to type the command
 * "npm run dev".
 */

import { Engine } from '@babylonjs/core';
import { App } from './app';

// get the canvas element
//const canvas = <HTMLCanvasElement>document.getElementById('renderCanvas');
const canvas = document.getElementById("renderCanvas");

if (canvas instanceof HTMLCanvasElement)
{
    // initialize babylon engine
    const engine = new Engine(canvas, true);

    // create the scene and run the render loop
    const app = new App(engine);
    app.createScene().then(scene => {
        engine.runRenderLoop(() => {
            scene.render();
        })
    });

    // resize the canvas when the window is resized
    window.addEventListener('resize', function () {
        engine.resize();
    });
}

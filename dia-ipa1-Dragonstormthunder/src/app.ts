/**
 * @file    app.ts
 * @authors your instructors
 * @author  Emma Natalie Soh (2202191\@sit.singaporetech.edu.sg)
 * @par     CSD3121 Developing Immersive Applications
 * @date    11 January 2024
 *
 * @brief   This file defines the App class where the core engine logic
 *          resides. The app defines a simple scene.
 */

// import { Engine, Scene } from "@babylonjs/core";

// i prefer to have the namespace
import * as BABYLON from '@babylonjs/core/Legacy/legacy';

/**
 * @brief   This app defines a simple scene.
 */
export class App
{
    // the BabylonJS engine
    private engine: BABYLON.Engine;

    /**
     * @brief   Constructor to create the App object with an engine.
     *
     * @param   engine
     *          The Babylon engine to use for the application.
     */
    constructor(engine: BABYLON.Engine)
    {
        this.engine = engine;
    }

    /**
     * @brief   Create the scene.
     *
    *  This is the main entry point for the application.
    *
    * TODO the necessary code to create and return a scene with the following:
    *      1. Exactly 1 camera
    *      2. Exactly 1 light
    *      3. Exactly 1 primitive mesh (sphere, box, etc.)
    *      See BabylonJS documentation for more information:
    *      https://doc.babylonjs.com/
    *
     * @return  A promise that resolves when the application is done running.
     */
    async createScene()
    {
        // adapted tom the tutorial:
        // https://doc.babylonjs.com/journey/theFirstStep

        // create the scene
        const scene = new BABYLON.Scene(this.engine);

        // get the canvas
        const canvas = this.engine.getRenderingCanvas();

        // This creates and positions a free camera (non-mesh)
        let camera = new BABYLON.FreeCamera(
            "camera1", new BABYLON.Vector3(0, 5, -10), scene
        );

        // This targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new BABYLON.HemisphericLight(
            // "light", new BABYLON.Vector3(0, 1, 0), scene
            "light", new BABYLON.Vector3(0, +1, 0), scene
        );

        // Default intensity is 1.
        light.intensity = 1;

        var ground = BABYLON.MeshBuilder.CreateGround(
            "ground", {width: 4, height: 8}, scene
        );

        // not transparent rat
        // const groundMaterial = new BABYLON.StandardMaterial(
        //     "Ground Material", scene
        // );
        // groundMaterial.diffuseColor = BABYLON.Color3.White();
        // let groundTexture = new BABYLON.Texture(
        //     "rat.png", scene
        // );
        // groundMaterial.diffuseTexture = groundTexture;
        // ground.material = groundMaterial;

        // transparent rat adapted from
        // https://forum.babylonjs.com/t/is-it-possible-to-have-a-texture-with-transparent-areas-and-an-alpha-value/1169
        // https://www.babylonjs-playground.com/#NAIEGS#1
        const groundMaterial = new BABYLON.StandardMaterial(
            "Ground Material", scene
        );
        let groundTexture = new BABYLON.Texture(
            "rat.png", scene
        );
        groundMaterial.opacityTexture = groundTexture;
        groundMaterial.opacityTexture.hasAlpha = false;

        // normal mix
        // groundMaterial.diffuseColor = BABYLON.Color3.White();

        // red mix - make it look like an anger rat
        groundMaterial.diffuseColor = BABYLON.Color3.Red();

        groundMaterial.diffuseTexture = groundTexture;
        ground.material = groundMaterial;

        return scene;
    }

}

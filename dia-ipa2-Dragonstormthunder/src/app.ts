/**
 * @file    app.ts
 * @author  Emma Natalie Soh (2202191\@sit.singaporetech.edu.sg)
 * @par     CSD3121 Developing Immersive Applications
 * @date    4 March 2025
 *
 * @brief   This file defines the App class where the core engine logic
 *          resides. The app defines a simple scene.
 */

// named imports
import
{
    ArcRotateCamera,
    Color3,
    Engine,
    HemisphericLight,
    MeshBuilder,
    PointLight,
    Scene,
    Vector3,
    VideoDome
} from "@babylonjs/core";

import { AdvancedDynamicTexture, TextBlock } from "@babylonjs/gui";
import { createHelloMessage } from "./hello";

/**
 * @brief   This app defines a simple scene.
 */
export class App
{
    /**
     * The BABYLON Engine.
     */
    private engine: Engine;

    /**
     * The rendering canvas.
     */
    private canvas: HTMLCanvasElement

    /**
     * @brief   Constructor to create the App object with an engine.
     *
     * @param   _engine
     *          The Babylon engine to use for the application.
     */
    constructor(_engine: Engine)
    {
        this.engine = _engine;

        // assume the enegine has a rendering canvas
        this.canvas = this.engine.getRenderingCanvas()!;
    }

    /**
     * @brief   Create the scene.
     *
    *  This is the main entry point for the application.
    *
     * @return  A promise that resolves when the application is done running.
     */
    async createScene()
    {
        // adapted from the tutorial:
        // https://doc.babylonjs.com/journey/theFirstStep
        // and the Lecture06 code lecture

        // create the scene
        const scene = new Scene(this.engine);

        // create the camera
        this.createCamera(scene);

        // create the lights
        this.createLights(scene);

        // add debug shortcut to bring up the inspector
        this.addInspectorKeyBoardShortcut(scene)

        // add the videodome
        this.createSkyVideoDome(scene);

        // add the text
        this.createText(scene)

        // create the scene's geometry
        const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 1 });
        sphere.position.y = 1;
        sphere.position.z = 5;

        // returns a promise... as it will take a while for it to
        // set up

        // if we want it to wait, we need to put await here
        // and then we need to label this function as async
        const xr = await scene.createDefaultXRExperienceAsync({
            uiOptions: {
                // tells babylon whether it should be AR or VR
                sessionMode: 'immersive-vr'
            }
        });

        // useful for debugging purposes
        // window.xr = xr;
        (window as any).xr = xr;

        return scene;
    }

    /**
     * This function handles the creation of an ArcRotateCamera.
     *
     * @param   scene
     *          The scene that will own the camera.
     *
     * @return  The ArcRotateCamera instance that was newly created and
     *          configured.
     */
    private createCamera(scene: Scene): ArcRotateCamera {

        // arc camera that rotates around one point
        const camera = new ArcRotateCamera(
            "arcCamera",
            -Math.PI,       // rotation around longitudinal axis
            Math.PI / 2,    // rotation around latitundal axis
            5,              // radius
            Vector3.Zero(), // camera's target
            scene           // hosting scene
        );

        // handle the events
        camera.attachControl(this.canvas, true);

        return camera;
    }

    /**
     * This function handles the creation of the lights within the scene.
     *
     * @param   scene
     *          The scene that will own the lights.
     */
    private createLights(scene: Scene) {

        // light 1
        const hemiLight = new HemisphericLight(
            "hemiLight",
            new Vector3(-1, 1, 0), // direction of the light
            scene
        );
        hemiLight.intensity = 0.5;
        hemiLight.diffuse = new Color3(0, 0, 1);

        // light 2
        const pointLight = new PointLight(
            "pointLight",
            new Vector3(0, 1.5, 2), // position of the light
            scene
        );
        pointLight.intensity = 1
        pointLight.diffuse = new Color3(1, 0, 0);
    }

    /**
     * Let the user toggle the Inspector via a keyboard shortcut.
     * The interaction to toggle the Inspector is when CTRL + I
     * is down.
     *
     * @param   scene
     *          The scene that owns the interaction.
     */
    private addInspectorKeyBoardShortcut(scene: Scene) {

        // window is a top level object
        window.addEventListener("keydown", event => {
            // if all these keys are down
            if (event.ctrlKey && event.key == "i") {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide()
                } else {
                    scene.debugLayer.show()
                }
            }
        });

    }

    /**
     * Creates the text inside the scene.
     *
     * @param   scene
     *          The scene that owns the text.
     */
    private createText(scene: Scene) {

        // there is also an option you can turn on so that the plane
        // will always face the camera
        const helloPlane = MeshBuilder.CreatePlane(
            "hello plane",
            { width: 2.5, height: 1 },  // keeping the same aspect ratio
            scene
        );
        helloPlane.position.y = 0;
        helloPlane.position.z = 5;
        const helloTexture = AdvancedDynamicTexture.CreateForMesh(
            helloPlane, // mesh that receives the texture
            200,        // width: default 1024
            100,        // height: default 1024
            false       // whether this plane captures move events: default true
                        // switch off for efficiency
        );
        helloTexture.name = "hello texture";
        helloTexture.background = "white";  // see the size of the plne
        const helloText = new TextBlock("hello text");
        helloText.text = createHelloMessage("XR");
        helloText.color = "purple";
        helloText.fontSize = 40;

        // add control just lets the hello texture know that helloText
        // is what to show?
        helloTexture.addControl(helloText);
    }

    /**
     * Creates the sky dome that plays a 360 video.
     *
     * @param   scene
     *          The scene that owns the sky dome.
     */
    private createSkyVideoDome(scene: Scene) {

        // https://www.mettle.com/360vr-master-series-free-360-downloads-page/
        const dome = new VideoDome(
            "video dome",
            "assets/videos/video.mp4",
            {
                resolution: 32,
                size: 100
            },
            scene
        );

    }

}

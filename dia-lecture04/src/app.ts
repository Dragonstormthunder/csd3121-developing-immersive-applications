// each file is a module. in order to get access from outside,

import { Engine, MeshBuilder, Scene } from "babylonjs";
import { AdvancedDynamicTexture, TextBlock } from "babylonjs-gui";

// we need to export it
export class App {

    // by default these are public, but we can attach private
    private engine: Engine
    private canvas: HTMLCanvasElement

    constructor(engine: Engine, canvas: HTMLCanvasElement) {
        this.engine = engine;
        this.canvas = canvas;
        console.log('app is running');
    }


    async createScene() {

        // give a scene to the engine so that the engine can render the
        // scene

        const scene = new Scene(this.engine);

        // create default camera and light
        scene.createDefaultCameraOrLight();

        // create some primitive
        const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 1 });
        sphere.position.y = 1;
        sphere.position.z = 5;

        const helloPlane = MeshBuilder.CreatePlane('hello plane', { size: 15 });
        helloPlane.position.y = 0;
        helloPlane.position.z = 5;
        const helloTexture = AdvancedDynamicTexture.CreateForMesh(helloPlane);
        const helloText = new TextBlock('hello');
        helloText.text = 'Hello XR';
        helloText.color = 'purple';
        helloText.fontSize = 50;

        // add control just lets the hello texture know that helloText
        // is what to show?
        helloTexture.addControl(helloText);

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
}
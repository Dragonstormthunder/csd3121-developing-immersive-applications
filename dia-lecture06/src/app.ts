// each file is a module. in order to get access from outside,

// named imports
import
{
    AbstractMesh,
    Animation,
    ArcRotateCamera,
    Color3,
    Color4,
    CubeTexture,
    Engine,
    HemisphericLight,
    MeshBuilder,
    ParticleSystem,
    PointLight,
    Scene,
    SceneLoader,
    Sound,
    StandardMaterial,
    Texture,
    UniversalCamera,
    Vector3,
    VideoDome
} from "babylonjs";
import { AdvancedDynamicTexture, TextBlock } from "babylonjs-gui";

// side effect import
import 'babylonjs-loaders'; // import the loaders

// namespace import
//import * as BABYLON from 'babylonjs'

// we need to export it
export class App {

    // by default these are public, but we can attach private
    private engine: Engine;
    private canvas: HTMLCanvasElement;
    private sound: Sound;

    constructor(engine: Engine, canvas: HTMLCanvasElement) {
        this.engine = engine;
        this.canvas = canvas;
        console.log('app is running');
    }


    async createScene() {

        // give a scene to the engine so that the engine can render the
        // scene

        const scene = new Scene(this.engine);

        // load models
        this.loadModels(scene);

        // create default camera and light
        //scene.createDefaultCameraOrLight();
        this.createCamera(scene);

        // create a skybox
        //this.createSkybox(scene);
        // or create a skydome
        this.createSkyVideoDome(scene)

        // create lighting
        this.createLights(scene)

        // add debug shortcut
        this.addInspectorKeyBoardShortcut(scene)

        // add particles
        this.createParticles(scene)

        // add sounds
        this.addSounds(scene)

        // create some primitive
        const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 1 });
        sphere.position.y = 1;
        sphere.position.z = 5;

        this.createText();

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

    private createText() {

        // there is also an option you can turn on so that the plane
        // will always face the camera
        const helloPlane = MeshBuilder.CreatePlane(
            'hello plane',
            { width: 2.5, height: 1 }   // keeping the same aspect ratio
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
        helloTexture.background = "white";  // see the size of the plne
        const helloText = new TextBlock('hello');
        helloText.text = 'Hello XR';
        helloText.color = 'purple';
        helloText.fontSize = 50;

        // add control just lets the hello texture know that helloText
        // is what to show?
        helloTexture.addControl(helloText);

        // make it a button
        helloText.onPointerUpObservable.add(evtData => {
            alert("Hello Text at:\n(" + evtData.x + ", " + evtData.y + ")");
        });
        helloText.onPointerDownObservable.add(evtData => {
            this.sound.play();
        })
    }

    createSkybox(scene: Scene) {
        const skybox = MeshBuilder.CreateBox(
            "skybox",           // name
            { size: 3000 },      // options
            scene // this parameter is actually optional
            // tells the scene that this box belongs to it
        )

        const skyboxMaterial = new StandardMaterial("skybox-mat");

        skyboxMaterial.backFaceCulling = false;

        // static asset: the file path
        // although we have six skybox textures, babylonjs can
        // infer which texture should go where with the suffixes
        // nx, ny, nz, px, py, pz
        // https://doc.babylonjs.com/features/featuresDeepDive/environment/skybox
        skyboxMaterial.reflectionTexture = new CubeTexture(
            "assets/textures/skybox", scene
        );
        // specify the coordinate mode since it's a skybox
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        // assign the skybox material to the skybox
        skybox.material = skyboxMaterial;

        console.log("skybox finished setup")
    }

    createCamera(scene: Scene) {


        // arc camera that rotates around one point
        // const camera = new ArcRotateCamera(
        //     "arcCamera",
        //     -Math.PI,       // rotation around longitudinal axis
        //     Math.PI / 2,    // rotation around latitundal axis
        //     5,              // radius
        //     Vector3.Zero(), // camera's target
        //     scene           // hosting scene
        // )

        // universal camera. free camera with WASD Control
        // and you can shift your viewpoint with the mouse so you can
        // walk on a different "plane"
        const camera = new UniversalCamera(
            "uniCamera",
            Vector3.Zero(),
            scene
        )

        // handle the events
        camera.attachControl(this.canvas, true);
    }

    createLights(scene: Scene) {

        const hemiLight = new HemisphericLight(
            "hemiLight",
            new Vector3(-1, 1, 0), // direction of the light
            scene
        );
        hemiLight.intensity = 0.5;
        hemiLight.diffuse = new Color3(0, 0, 1);

        const pointLight = new PointLight(
            "pointLight",
            new Vector3(0, 1.5, 2), // position of the light
            scene
        );
        pointLight.intensity = 1
        pointLight.diffuse = new Color3(1, 0, 0);

    }

    createSkyVideoDome(scene: Scene) {

        // https://www.mettle.com/360vr-master-series-free-360-downloads-page/
        const dome = new VideoDome(
            "videoDome",
            "assets/videos/london_on_tower_bridge.mp4",
            {
                resolution: 32,
                size: 100
            },
            scene
        );

    }

    addInspectorKeyBoardShortcut(scene: Scene) {
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

    loadModels(scene: Scene) {

        // this is an ASYNC. It'll return a promise
        SceneLoader.ImportMeshAsync(
            "", // name
            "assets/meshes/",
            "aerobatic_plane.glb",
            scene

            // let the promise know what to do once the model is loaded
        ).then(result => {
            // result will be the abstract mesh
            // => passes the scope of the function into this lambda

            // the 0th index is always the root of the model
            // you can see it in the inspector
            const root = result.meshes[0];
            root.id = "plane_root";
            root.name = "plane_root";
            root.position.x = -1;
            // doesn't work
            //root.rotation.z = Math.PI / 2;
            root.rotation = new Vector3(0, 0, Math.PI);
            root.scaling.setAll(10.5);

            // call the create animation here
            this.createAnimation(scene, root);
        })
    }

    createAnimation(scene: Scene, model: AbstractMesh) {

        // create a bunch of key frames that rotate the model

        // main animation body
        const animation = new Animation(
            "rotationAnimation",    // name
            "rotation",             // property we want to animate
            30,                     // fps
            Animation.ANIMATIONTYPE_VECTOR3,    // the animation type
            Animation.ANIMATIONLOOPMODE_CYCLE,  // cycle the animation
        );

        // keyframes
        const keyframes = [
            {frame: 0, value: new Vector3(0, 0, 0)},
            {frame: 30, value: new Vector3(0, 2* Math.PI, 0)},
        ]

        // set the keys
        animation.setKeys(keyframes);

        model.animations = [];
        model.animations.push(animation);
        scene.beginAnimation(
            model,  // model to begin animation
            0,      // start frame
            30,     // end frame
            true    // defines if animation is looping
        );

    }

    createParticles(scene: Scene) {
        const particleSystem = new ParticleSystem(
            "particles",    // name
            5000,           // capacity
            scene
        );

        // need a texture for the particles
        particleSystem.particleTexture = new Texture(
            "assets/textures/flare.png"
        );

        // emitter
        particleSystem.emitter = new Vector3(0, 0, 0);

        // giving the exact same value means its a point
        particleSystem.minEmitBox = new Vector3(0, 0, 0);
        particleSystem.maxEmitBox = new Vector3(0, 0, 0);

        // three colors.
        // it will be blended from color1 to color2
        // color3 is used for reusing the particle after it's finished
        // last one is the alpha
        particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
        particleSystem.color2 = new Color4(0.3, 0.5, 1.0, 1.0);
        particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;

        particleSystem.minLifeTime = 0.3
        particleSystem.maxLifeTime = 1.5

        // max number of particles to emit per frame
        particleSystem.emitRate = 1500

        // range of directions the particle can emit
        // only works if its a box particle emitter
        particleSystem.direction1 = new Vector3(-1, 0, +1);
        particleSystem.direction2 = new Vector3(+1, 0, -1);

        particleSystem.minEmitPower = 0.2;
        particleSystem.maxEmitPower = 0.8;
        particleSystem.updateSpeed = 0.01;

        particleSystem.gravity = new Vector3(0, -9.8, 0);
        particleSystem.start()
    }

    addSounds(scene: Scene) {
        const music = new Sound(
            "music",        // name
            "assets/sounds/Vlad_Gluschenko_Brightness.wav",
            scene,
            null,   // ready to play callback void()
            { loop: true, autoplay: true }
        );

        // definitely did not steal from my gam300 oh no
        this.sound = new Sound(
            "sfx",
            "assets/sounds/button_click_gam300.mp3",
            scene,
            () => {
                // play the sound once loaded
                this.sound.play();
            },
            //{ loop: true },
        );
        // doesn't work because of async issues
        //sound.play()

    }

}
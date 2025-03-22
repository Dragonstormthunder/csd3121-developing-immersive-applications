// each file is a module. in order to get access from outside,

// named imports
import {
  AbstractMesh,
  ActionManager,
  Color3,
  Engine,
  GizmoManager,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  MultiPointerScaleBehavior,
  Observable,
  Observer,
  PointerDragBehavior,
  PointLight,
  Scene,
  Sound,
  StandardMaterial,
  Texture,
  Tools,
  TransformNode,
  UniversalCamera,
  Vector3,
  WebXRDefaultExperience,
  WebXRFeatureName,
  WebXRFeaturesManager,
  WebXRMotionControllerTeleportation,
} from "babylonjs";
import { HelloSphere, TextPlane } from "./components/meshes";

// side effect import
import "babylonjs-loaders"; // import the loaders

// namespace import
//import * as BABYLON from 'babylonjs'

enum MovementMode {
  Teleportation,
  Controller,
  Walk,
}

// we need to export it
export class App {
  // by default these are public, but we can attach private
  private engine: Engine;
  private canvas: HTMLCanvasElement;
  private sound: Sound;

  constructor(engine: Engine, canvas: HTMLCanvasElement) {
    this.engine = engine;
    this.canvas = canvas;
    console.log("app is running");
  }

  async createScene() {
    // give a scene to the engine so that the engine can render the
    // scene

    const scene = new Scene(this.engine);

    // create action manager
    scene.actionManager = new ActionManager(scene);

    this.createCamera(scene);

    // create lighting
    this.createLights(scene);

    // add sounds
    this.addSounds(scene)

    this.createText(scene);

    ////////////////////////////////////////////////////////////////////////////
    // create the scene
    ////////////////////////////////////////////////////////////////////////////

    // first sphere
    const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 1 });
    sphere.position.y = -0.5;
    sphere.position.z = 5;

    // second sphere
    const helloSphere = new HelloSphere("hello sphere", { diameter: 1 }, scene);
    helloSphere.position.set(0, 1, 5);
    helloSphere.sayHello("this is a test.");

    // ground
    const groundMaterial = new StandardMaterial("ground material", scene);
    groundMaterial.backFaceCulling = true;
    groundMaterial.diffuseTexture = new Texture(
      "assets/textures/rock4.png",
      scene
    );
    const ground = MeshBuilder.CreateGround("ground", {
      width: 12,
      height: 12,
    });
    ground.material = groundMaterial;
    ground.position.set(0, -1, 0);

    ////////////////////////////////////////////////////////////////////////////
    // interactions
    ////////////////////////////////////////////////////////////////////////////

    // three ways of implementing interactions
    // 1. behaviors
    // 2. actions
    // 3. observations

    ////////////////////////////////////////////////////////////////////////////
    // behavior
    // pointer can be anything: a mouse, touch input, a VR controller
    // pointer must be on the sphere for the interaction to trigger
    const pointerDragBehavior = new PointerDragBehavior({
      // drag the pointer along the y axis... 2D like behavior
      dragPlaneNormal: Vector3.Up(),
    });
    sphere.addBehavior(pointerDragBehavior);
    //sphere.removeBehavior(pointerDragBehavior);

    // let us move the sphere
    const helloSphereDragBehavior = new PointerDragBehavior({
      dragPlaneNormal: Vector3.Backward(), // 0, 0, -1
    });
    helloSphere.addBehavior(helloSphereDragBehavior);

    // multiple pointer scale
    // if two pointers are on the scale and they expand,
    // the sphere's size will be changed
    const multiPointerScaleBehavior = new MultiPointerScaleBehavior();
    helloSphere.addBehavior(multiPointerScaleBehavior);

    // more behaviors
    // kind of hard for mouse and keyboard, so we'll add a gizmo
    // default gizmo
    const gizmoManager = new GizmoManager(scene);
    //gizmoManager.positionGizmoEnabled = true;
    //gizmoManager.rotationGizmoEnabled = true;
    //gizmoManager.scaleGizmoEnabled = true;
    gizmoManager.boundingBoxGizmoEnabled = true;

    ////////////////////////////////////////////////////////////////////////////
    // observables
    // behaviors are actually built on top of observables
    // a behavior has multiple observables, when the event happens
    // they fire off their subscribers
    // evtData is the callback
    pointerDragBehavior.onDragStartObservable.add((evtData) => {
      console.log("drag start: pointer id: " + evtData.pointerId);
      console.log(evtData);
      this.sound.play();
    });

    // other observable stuff
    // 1. create an observable for detecting intersections
    // similiar to the hello mesh
    const onIntersectionObservable = new Observable<boolean>();
    // this registered function will be called before the frame render.
    // it's like an update loop
    scene.registerBeforeRender(function () {
      const isIntersecting = sphere.intersectsMesh(helloSphere);

      // let the subscribers know if it was intersecting
      // broadcast to everyone
      onIntersectionObservable.notifyObservers(isIntersecting);
    });
    // stores it. doesn't really do anything yet
    helloSphere.m_onIntersectionObservable = onIntersectionObservable;
    // colors
    const redColor = Color3.Red();
    const whiteColor = Color3.White();
    // make the callback that calls on the observable
    /*const ob =*/ helloSphere.m_onIntersectionObservable.add(
      (isIntersecting) => {
        // the boolean is isIntersecting
        // type cast since material is an abstract material
        const material = helloSphere.m_Mesh.material as StandardMaterial;
        const isRed = material.diffuseColor === redColor;
        if (isIntersecting && !isRed) {
          material.diffuseColor = redColor;
        } else if (!isIntersecting && isRed) {
          material.diffuseColor = whiteColor;
        }
      }
    );
    //helloSphere.m_onIntersectionObservable.remove(ob);

    // 2. create an obserable for checking distance
    const onDistanceChangeObservable = new Observable<number>();
    let previousState: number = null;
    // an event that triggers before rendering the scene
    // after physics and animations
    // another way to create callbacks instead of the register
    scene.onBeforeRenderObservable.add(() => {
      const currentState = Vector3.Distance(
        sphere.position,
        helloSphere.position
      );

      if (currentState !== previousState) {
        console.log("distance updated!");
        previousState = currentState;
        onDistanceChangeObservable.notifyObservers(currentState);
      }
    });
    // store it
    helloSphere.m_onDistanceChangeObservable = onDistanceChangeObservable;
    // callback
    const blueColor = Color3.Blue();
    helloSphere.m_onDistanceChangeObservable.add((distance) => {
      const isCloseEnough = distance <= 1.2;
      const material = helloSphere.m_Mesh.material as StandardMaterial;
      const isBlue = material.diffuseColor === blueColor;
      const isRed = material.diffuseColor === redColor;

      if (isCloseEnough && !isBlue && !isRed) {
        material.diffuseColor = blueColor;
      } else if (!isCloseEnough && isBlue) {
        material.diffuseColor = whiteColor;
      }
    });

    // 3. create observer
    const observer = new Observer<number>((distance) => {
      helloSphere.m_Label.m_TextBlock.text = "d: " + distance.toFixed(2);
    }, -1); // -1 is mask used to filter notifications

    // 4. add observer with the usual push
    // however this will override the initial value immediately
    //onDistanceChangeObservable.observers.push(observer);
    // 4. add observer able using coroutine
    // avoids changing the initial value of the sphere
    // generator function. this will be called twice
    const addObserverCoroutine = function* () {
      console.log("frame " + scene.getFrameId() + ": do nothing");
      // outputs frame 1: do nothing
      yield; // on first call it will just yield and do nothing
      // on the second call, it'll push the observable,
      // and then this coroutine will finish. there's nothing left
      console.log("frame " + scene.getFrameId() + ": add observer");
      // outputs frame 2: add observer
      onDistanceChangeObservable.observers.push(observer);
      yield;
      console.log("frame " + scene.getFrameId() + ": do nothing");
    };
    scene.onBeforeRenderObservable.runCoroutineAsync(addObserverCoroutine());

    ////////////////////////////////////////////////////////////////////////////
    // coroutines

    const coroutine = function* () {
      (async function () {
        // wait 2 seconds
        await Tools.DelayAsync(2000);
        console.log("frame " + scene.getFrameId() + ": fn1");
      })();

      yield;

      (async function () {
        // wait 2 seconds
        await Tools.DelayAsync(2000);
        console.log("frame " + scene.getFrameId() + ": fn2");
      })();

      yield;

      (async function () {
        // go immediately
        console.log("frame " + scene.getFrameId() + ": fn3");
      })();

      yield;

      (async function () {
        // wait 1 second
        await Tools.DelayAsync(1000);
        console.log("frame " + scene.getFrameId() + ": fn4");
      })();
    };
    // if you call without () you don't return the generator
    // so it causes problem. maybe it's because it returns a function pointer
    // instead? the error is:
    // Uncaught (in promise) TypeError: e.next() is not a function
    //scene.onBeforeRenderObservable.runCoroutineAsync(coroutine);
    scene.onBeforeRenderObservable.runCoroutineAsync(coroutine());
    // sample output:
    // frame 3: fn3
    // frame 169: fn4
    // frame 271: fn1
    // frame 297: fn2
    // fn1 is called on frame 1, fn2 called on frame 2, fn3 called frame3,
    // fn4 is called frame 4.

    ////////////////////////////////////////////////////////////////////////////
    // actions
    // in hello-mesh.ts
    ////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
    // XR setup
    ////////////////////////////////////////////////////////////////////////////

    // returns a promise... as it will take a while for it to
    // set up

    // if we want it to wait, we need to put await here
    // and then we need to label this function as async
    const xr = await scene.createDefaultXRExperienceAsync({
      uiOptions: {
        // tells babylon whether it should be AR or VR
        sessionMode: "immersive-vr",
      },
      // for locomotion + teleportation
      optionalFeatures: true,
    });

    // useful for debugging purposes
    // window.xr = xr;
    (window as any).xr = xr;

    ////////////////////////////////////////////////////////////////////////////
    // features
    ////////////////////////////////////////////////////////////////////////////
    const featureManager = xr.baseExperience.featuresManager;
    console.log(WebXRFeaturesManager.GetAvailableFeatures());

    ////////////////////////////////////////////////////////////////////////////
    // locomotion
    // manually change this if you want different modes
    const movement = MovementMode.Teleportation;
    this.initLocomotion(movement, xr, featureManager, ground, scene);

    ////////////////////////////////////////////////////////////////////////////
    // hand tracking
    try {
      featureManager.enableFeature(WebXRFeatureName.HAND_TRACKING, "latest", {
        xrInput: xr.input,
        jointMeshes: {
          // true
          // makes your hand look like a bunch of dots
          // that trace your palm and fingers
          disableDefaultHandMesh: true,
          // gives you ghostie hands
          // disableDefaultHandMesh: false
        },
      });
    } catch (error) {
      console.log("Error: " + error);
    }

    ////////////////////////////////////////////////////////////////////////////
    // hand/controller track
    // grabbing the mesh and moving and rotating and scaling it
    let mesh: AbstractMesh;
    xr.input.onControllerAddedObservable.add((controller) => {
      // when the motion controller is available, we'll add an observable
      controller.onMotionControllerInitObservable.add((motionController) => {
        // const ids = motionController.getComponentIds();
        // const trigger = motionController.getComponent(ids[0]);
        const trigger = motionController.getComponentOfType("trigger");
        // whenever the trigger's state changed, we see what changed
        trigger.onButtonStateChangedObservable.add(() => {
          if (trigger.changes.pressed) {
            // check if there's a mesh
            if (
              (mesh = xr.pointerSelection.getMeshUnderPointer(
                controller.uniqueId
              ))
            ) {
              console.log("mesh under controller pointer: " + mesh.name);
              if (mesh.name !== "ground") {
                const distance = Vector3.Distance(
                  motionController.rootMesh.getAbsolutePosition(),
                  mesh.getAbsolutePosition()
                );
                console.log("distance: " + distance);
                if (distance < 1) {
                  mesh.setParent(motionController.rootMesh);
                  console.log("grab mesh: " + mesh.name);
                }
              }
            } else {
              console.log(" no mesh under pointer");
            }
          } else {
            if (mesh && mesh.parent) {
              mesh.setParent(null);
              console.log("release mesh: " + mesh.name);
            }
          }
        });
      });
    });

    return scene;
  }

  private createText(scene: Scene) {
    const helloPlane = new TextPlane(
      scene,
      "hello plane",
      "Hello Xr",
      new Vector3(0, 2, 5),
      "white",
      "purple",
      50,
      2.5,
      1,
      250,
      100
    );

    // make it a button
    helloPlane.m_TextBlock.onPointerUpObservable.add((evtData) => {
      alert("Hello Text at:\n(" + evtData.x + ", " + evtData.y + ")");
    });
    helloPlane.m_TextBlock.onPointerDownObservable.add((evtData) => {
      //this.sound.play();
    });
  }

  private createCamera(scene: Scene) {
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
    const camera = new UniversalCamera("uniCamera", Vector3.Zero(), scene);

    // handle the events
    camera.attachControl(this.canvas, true);
  }

  private createLights(scene: Scene) {
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
    pointLight.intensity = 1;
    pointLight.diffuse = new Color3(1, 0, 0);
  }

  private addSounds(scene: Scene) {
    // definitely did not steal from my gam300 oh no
    this.sound = new Sound(
      "sfx",
      "assets/sounds/button_click_gam300.mp3",
      scene,
      () => {
        // play the sound once loaded
        this.sound.play();
      }
      //{ loop: true },
    );
    // doesn't work because of async issues
    //sound.play()
  }

  private initLocomotion(
    movement: MovementMode,
    xr: WebXRDefaultExperience,
    featureManager: WebXRFeaturesManager,
    ground: Mesh,
    scene: Scene
  ) {
    switch (movement) {
      case MovementMode.Teleportation:
        console.log("movement mode: teleportation");
        const teleportation = featureManager.enableFeature(
          WebXRFeatureName.TELEPORTATION,
          "stable",
          {
            xrInput: xr.input,
            floorMeshes: [ground],
            // wait for 2 seconds before confirming the teleport
            timeToTeleport: 2000,
            // use trigger only
            // some controller will let you use other buttons
            useMainComponentOnly: true,
            // specify how the indicate looks like
            defaultTargetMeshOptions: {
              teleportationFillColor: "#55FF99",
              teleportationBorderColor: "blue",
              torusArrowMaterial: ground.material,
            },
          },
          // automatically attach if possible. default true
          true,
          // this makes this feature required for this session.
          // if this feature is not available, the session will fail
          true
        ) as WebXRMotionControllerTeleportation;

        // more configuration
        teleportation.parabolicRayEnabled = true;
        teleportation.parabolicCheckRadius = 2;
        break;

      case MovementMode.Controller:
        console.log("movement mode: controller");
        // i think this just uses the joystick
        featureManager.disableFeature(WebXRFeatureName.TELEPORTATION);
        featureManager.enableFeature(WebXRFeatureName.MOVEMENT, "latest", {
          xrInput: xr.input,
        });
        break;

      case MovementMode.Walk:
        console.log("movement mode: walking");
        featureManager.disableFeature(WebXRFeatureName.TELEPORTATION);
        // just get the node for transforming
        const xrRoot = new TransformNode("xr root", scene);
        xr.baseExperience.camera.parent = xrRoot;
        featureManager.enableFeature(
          WebXRFeatureName.WALKING_LOCOMOTION,
          "stable",
          {
            // target for the locomotion
            locomotionTarget: xrRoot,
          }
        );
        break;
    }
  }
}

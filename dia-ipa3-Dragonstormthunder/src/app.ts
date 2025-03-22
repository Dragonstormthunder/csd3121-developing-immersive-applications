/**
 * @file    app.ts
 * @author  Emma Natalie Soh (2202191\@sit.singaporetech.edu.sg)
 * @par     CSD3121 Developing Immersive Applications
 * @date    20 March 2025
 *
 * @brief   This file defines the App class where the core engine logic
 *          resides. The app defines a simple scene.
 */

// named imports
import {
  AbstractMesh,
  ActionManager,
  ArcRotateCamera,
  Color3,
  Engine,
  GroundMesh,
  HemisphericLight,
  InterpolateValueAction,
  Mesh,
  MeshBuilder,
  Observable,
  Observer,
  PointerDragBehavior,
  PointLight,
  Scene,
  SceneLoader,
  StandardMaterial,
  Vector3,
  WebXRDefaultExperience,
  WebXRFeatureName,
  WebXRFeaturesManager,
  WebXRMotionControllerTeleportation,
} from "@babylonjs/core";

import { AdvancedDynamicTexture, TextBlock } from "@babylonjs/gui";
import { createHelloMessage } from "./hello";

// side effect import
import "@babylonjs/loaders"; // import the loaders

/**
 * @brief   This app defines a simple scene.
 */
export class App {
  /**
   * The BABYLON Engine.
   */
  private m_Engine: Engine;

  /**
   * The rendering canvas.
   */
  private m_Canvas: HTMLCanvasElement;

  /**
   * The action manager for this scene.
   */
  private m_ActionManager: ActionManager | null;

  /**
   * @brief   Constructor to create the App object with an engine.
   *
   * @param   _engine
   *          The Babylon engine to use for the application.
   */
  constructor(_engine: Engine) {
    this.m_Engine = _engine;

    // assume the enegine has a rendering canvas
    this.m_Canvas = this.m_Engine.getRenderingCanvas()!;

    this.m_ActionManager = null;
  }

  /**
   * @brief   Create the scene.
   *
   *  This is the main entry point for the application.
   *
   * @return  A promise that resolves when the application is done running.
   */
  async createScene() {
    // adapted from the tutorial:
    // https://doc.babylonjs.com/journey/theFirstStep
    // and the Lecture06 code lecture

    ////////////////////////////////////////////////////////////////////////////
    // various creation invokations
    ////////////////////////////////////////////////////////////////////////////

    // create the scene
    const scene = new Scene(this.m_Engine);

    // create the action manager
    this.m_ActionManager = new ActionManager(scene);
    // we have a child mesh and we want it to respond to the action manager
    this.m_ActionManager.isRecursive = true;

    // load models
    // we're going to await this. i would prefer not too, but we want to
    // attach behaviors on it and we can't do that until it's been loaded
    const dragon = await this.loadDragon(scene);

    // create the camera
    this.createCamera(scene);

    // create the lights
    this.createLights(scene);

    // add debug shortcut to bring up the inspector
    this.addInspectorKeyBoardShortcut(scene);

    // create the text
    const [, , helloTextBlock] = this.createText(scene);

    ////////////////////////////////////////////
    // create the scene's geometry

    const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 1 });
    sphere.position.y = 1;
    sphere.position.z = 5;

    const groundMaterial = new StandardMaterial("ground material", scene);
    groundMaterial.backFaceCulling = true;
    const ground = MeshBuilder.CreateGround("ground", {
      width: 12,
      height: 12,
    });
    ground.material = groundMaterial;
    ground.position.set(0, -1, 0);

    ////////////////////////////////////////////////////////////////////////////
    // interactions
    ////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////
    // draggable sphere: behavior
    const pointerDragBehavior = new PointerDragBehavior({
      // drag the pointer along the y axis... 2D like behavior
      dragPlaneNormal: Vector3.Up(),
    });
    sphere.addBehavior(pointerDragBehavior);

    ////////////////////////////////////////////
    // sphere go big: action manager
    this.createMeshGoBigOnClickInteraction(sphere);

    ////////////////////////////////////////////
    // creating the distance interaction based on lab09: observable
    const onDistanceChangeObservable = this.createDistanceInteraction(
      dragon,
      sphere,
      scene
    );
    // change the text on the distance
    const textDistanceObserver = new Observer<number>((distance) => {
      helloTextBlock.text = "d: " + distance.toFixed(2);
    }, -1); // -1 is mask used to filter notifications
    //console.log("onDistanceChangeObservable added");
    onDistanceChangeObservable.observers.push(textDistanceObserver);

    ////////////////////////////////////////////////////////////////////////////
    // xr experience
    ////////////////////////////////////////////////////////////////////////////

    // if we want it to wait, we need to put await here
    // and then we need to label this function as async
    const xr = await scene.createDefaultXRExperienceAsync({
      uiOptions: {
        // tells babylon whether it should be AR or VR
        sessionMode: "immersive-vr",
      },
      // for locomotion + teleportation
      optionalFeatures: true,
      teleportationOptions: {
        timeToTeleport: 2000,
        floorMeshes: [ground],
      },
    });

    // useful for debugging purposes
    // window.xr = xr;
    (window as any).xr = xr;

    const baseExperience = xr.baseExperience;

    if (baseExperience) {
      //////////////////////////////////////////////////////////////////////////
      // features
      //////////////////////////////////////////////////////////////////////////

      console.log(WebXRFeaturesManager.GetAvailableFeatures());
      const featureManager = baseExperience.featuresManager;

      ////////////////////////////////////////////
      // locomotion
      this.initTeleportation(xr, featureManager, ground);
    }

    return scene;
  }

  /**
   * This function handles the loading of external dragon model.
   *
   * @param   scene
   *          The scene that will own the dragon model.
   *
   * @returns The dragon model.
   */
  private async loadDragon(scene: Scene): Promise<AbstractMesh> {
    const dragon = await SceneLoader.ImportMeshAsync(
      "dragon", // name
      "https://raw.githubusercontent.com/BabylonJS/Assets/master/meshes/Georgia-Tech-Dragon/",
      "dragon.glb",
      scene
      // let the promise know what to do once the model is loaded
    );

    const root = dragon.meshes[0];
    root.id = "dragon_root";
    root.name = "dragon";

    root.position.z = 10;

    root.scaling.setAll(30);
    return root;
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
      -Math.PI / 2, // rotation around longitudinal axis
      Math.PI / 2, // rotation around latitundal axis
      5, // radius
      Vector3.Zero(), // camera's target
      scene // hosting scene
    );

    // handle the events
    camera.attachControl(this.m_Canvas, true);

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
    pointLight.intensity = 1;
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
    window.addEventListener("keydown", (event) => {
      // if all these keys are down
      if (event.ctrlKey && event.key == "i") {
        if (scene.debugLayer.isVisible()) {
          scene.debugLayer.hide();
        } else {
          scene.debugLayer.show();
        }
      }
    });
  }

  /**
   * Creates the text inside the scene.
   *
   * @param   scene
   *          The scene that owns the text.
   *
   * @return  A tuple. Mesh indicates the plane that the mesh is on.
   *          AdvancedDynamicTexture is the texture applied onto the mesh.
   *          TextBlock is the text applied onto the texture.
   */
  private createText(scene: Scene): [Mesh, AdvancedDynamicTexture, TextBlock] {
    // there is also an option you can turn on so that the plane
    // will always face the camera
    const helloPlane = MeshBuilder.CreatePlane(
      "hello plane",
      { width: 2.5, height: 1 }, // keeping the same aspect ratio
      scene
    );

    helloPlane.position.y = 0;
    helloPlane.position.z = 5;
    const helloTexture = AdvancedDynamicTexture.CreateForMesh(
      helloPlane, // mesh that receives the texture
      200, // width: default 1024
      100, // height: default 1024
      false // whether this plane captures move events: default true
      // switch off for efficiency
    );
    helloTexture.name = "hello texture";
    helloTexture.background = "white"; // see the size of the plne
    const helloText = new TextBlock("hello text");
    helloText.text = createHelloMessage("XR");
    helloText.color = "purple";
    helloText.fontSize = 40;

    // add control just lets the hello texture know that helloText
    // is what to show?
    helloTexture.addControl(helloText);

    return [helloPlane, helloTexture, helloText];
  }

  /**
   * Creates an interaction which grows the specified mesh to 2x size when
   * clicked.
   *
   * @param   mesh
   *          The specified mesh.
   */
  private createMeshGoBigOnClickInteraction(mesh: AbstractMesh) {
    // register the action mesh also as the action manager for the scene
    mesh.actionManager = this.m_ActionManager;

    /*const action =*/ this.m_ActionManager?.registerAction(
      new InterpolateValueAction(
        ActionManager.OnPickDownTrigger,
        mesh,
        "scaling",
        new Vector3(2, 2, 2),
        1000
      )
    );

    //console.log(action);
  }

  /**
   * Creates a interaction that involves measuring the distance between two
   * meshes.
   *
   * @param   mesh1
   *          The first mesh.
   *
   * @param   mesh2
   *          The second mesh.
   *
   * @param   scene
   *          The scene that owns the interaction (observable). The observable
   *          will be checked before the scene's render call.
   *
   * @return  The observable that monitors this interaction. Use it for
   *          subscription.
   */
  private createDistanceInteraction(
    mesh1: AbstractMesh,
    mesh2: AbstractMesh,
    scene: Scene
  ): Observable<number> {
    // adapted from lecture09
    // 2. create an observable for checking distance
    const onDistanceChangeObservable = new Observable<number>();
    let previousState = Vector3.Distance(mesh1.position, mesh2.position);

    // an event that triggers before rendering the scene
    // after physics and animations
    // another way to create callbacks instead of the register
    scene.onBeforeRenderObservable.add(() => {
      const currentState = Vector3.Distance(mesh1.position, mesh2.position);

      if (currentState !== previousState) {
        //console.log("distance updated!");
        previousState = currentState;
        onDistanceChangeObservable.notifyObservers(currentState);
      }
    });

    return onDistanceChangeObservable;
  }

  /**
   * Initializes the teleportation for the VR experience.
   *
   * @param   xr
   *          The WebXRDefaultExperience instance.
   *
   * @param   featureManager
   *          The feature manager that manages the features for the XR instance.
   *
   * @param   ground
   *          The ground which defines the area the player can teleport in.
   */
  private initTeleportation(
    xr: WebXRDefaultExperience,
    featureManager: WebXRFeaturesManager,
    ground: GroundMesh
  ) {
    //console.log("movement mode: teleportation");
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
  }
}

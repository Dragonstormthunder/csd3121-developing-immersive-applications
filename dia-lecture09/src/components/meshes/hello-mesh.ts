import {
  AbstractMesh,
  ActionManager,
  Color3,
  ExecuteCodeAction,
  InterpolateValueAction,
  Mesh,
  MeshBuilder,
  Observable,
  PredicateCondition,
  Scene,
  SetValueAction,
  StandardMaterial,
  Vector3,
} from "babylonjs";
import { TextPlane } from "./text-plane";

// create extension for the interface. just t show how to use
// not really any good reason to create one here
interface HelloMesh {
  m_Scene: Scene;
  m_Mesh: Mesh;
  m_Label: TextPlane;
  m_onIntersectionObservable: Observable<boolean>;
  m_onDistanceChangeObservable: Observable<number>;

  sayHello(message?: string): void;
}

export class HelloSphere extends AbstractMesh implements HelloMesh {
  get _positions(): Vector3[] {
    throw new Error("Method not implemented.");
  }
  copyVerticesData(
    kind: string,
    vertexData: { [kind: string]: Float32Array<ArrayBuffer> }
  ): void {
    throw new Error("Method not implemented.");
  }
  refreshBoundingInfo(
    applySkeletonOrOptions: unknown,
    applyMorph?: unknown
  ): AbstractMesh {
    throw new Error("Method not implemented.");
  }

  // required by interface
  m_Scene: Scene;
  m_Mesh: Mesh;
  m_Label: TextPlane;
  m_onIntersectionObservable: Observable<boolean>;
  m_onDistanceChangeObservable: Observable<number>;

  constructor(
    _name: string,
    _options: {
      // JSON object here
      diameter: number;
    },
    _scene: Scene
  ) {
    // call the abstract mesh's constructor
    super(_name, _scene);

    this.m_Scene = _scene;
    this.m_Mesh = MeshBuilder.CreateSphere(
      "hello sphere mesh",
      _options,
      _scene
    );
    this.m_Mesh.material = new StandardMaterial(
      "hello sphere material",
      this.m_Scene
    );
    this.addChild(this.m_Mesh);

    this.m_Label = new TextPlane(
      _scene,
      "hello sphere label",
      "hello sphere",
      new Vector3(0, _options.diameter / 2 + 0.2, 0),
      "purple",
      "white",
      25,
      1.5,
      1,
      150,
      100
    );

    this.addChild(this.m_Label.m_Mesh);

    // actions
    this.initActions();
  }

  sayHello(message?: string): void {
    console.log("message from hello sphere: " + message);
  }

  private initActions() {
    // create anction manager
    // subclass of abstract mesh so we can get the actionmanager
    const actionManager = (this.actionManager = new ActionManager(
      this.m_Scene
    ));
    // we have a child mesh and we want it to respond to the action manager
    actionManager.isRecursive = true;

    // note default light created by xr are called "default light"
    //const light1 = this.m_Scene.getLightById("hemiLight");
    const light2 = this.m_Scene.getLightById("pointLight");

    // starts red
    // 1st click: turns black
    // 2nd click: turns white
    // 3rd click: turns black
    // 4th click: turns white
    // ...

    // fyi to unsubscribe it looks like
    //actionManager.unregisterAction(/*IAction*/)

    // these triggers are also cross platform
    /*const iaction =*/ actionManager
      .registerAction(
        new InterpolateValueAction(
          ActionManager.OnPickDownTrigger, // the trigger
          light2, // thing we're controlling
          "diffuse", // property we want to control
          Color3.Black(), // target value
          1000 // duration (in ms, I think)
        )
      )
      .then(
        // chaining calls
        new InterpolateValueAction(
          ActionManager.OnPickDownTrigger, // the trigger
          light2, // thing we're controlling
          "diffuse", // property we want to control
          Color3.White(), // target value
          1000 // duration (in ms, I think)
        )
      );

    // we can also use custom triggers
    // sphere scales up to 2,2,2 when sphere is black
    actionManager.registerAction(
      new InterpolateValueAction(
        ActionManager.OnPickDownTrigger,
        this,
        "scaling",
        new Vector3(2.5, 2.5, 2.5),
        1000,
        // new condition. only changes scale when its black
        new PredicateCondition(actionManager, () => {
          return light2.diffuse.equals(Color3.Black());
        })
      )
    );

    // get other mesh
    // when the meshes intersect, change this mesh to look wireframe
    // btw. i think this intersection is actually when the helloSphere
    // collides with the CENTRE of the otherMesh
    // actually that might not be true. i dont know what it's really
    // doing
    const otherMesh = this._scene.getMeshById("sphere");
    actionManager.registerAction(
      new SetValueAction( // sets the value
        {
          trigger: ActionManager.OnIntersectionEnterTrigger,
          parameter: {
            mesh: otherMesh,
            // default of precise is false
            usePreciseIntersection: true
          }
        },
        this.m_Mesh.material, // target
        "wireframe",          // property
        true // what to set it too
      )
    );

    // receive events from keyboard
    // we need an action manager in the scene so we can receive inputs from
    // the keyboard
    this.m_Scene.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnKeyUpTrigger,
          parameter: "r",
        },
        () => {
          this.scaling.setAll(1);
          this.m_Mesh.material.wireframe = false;
          console.log("r was pressed: reset " + this.name);
        }
      )
    )
  }

}

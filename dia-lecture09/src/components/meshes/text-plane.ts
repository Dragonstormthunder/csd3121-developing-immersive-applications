import { MeshBuilder, Scene, Vector3 } from "babylonjs";
import { AdvancedDynamicTexture, TextBlock } from "babylonjs-gui";

export class TextPlane {

  public m_TextBlock;
  public m_Mesh;

  constructor(
    _scene: Scene,
    _name: string,
    _text: string,
    _position: Vector3,
    _backgroundColor: string,
    _textColor: string,
    _fontSize: number,
    _width: number = 1,
    _height: number = 1,
    _textureWidth: number = 100,
    _textureHeight: number = 100
  ) {
    // there is also an option you can turn on so that the plane
    // will always face the camera
    this.m_Mesh = MeshBuilder.CreatePlane(
      _name + " text plane",
      { width: _width, height: _height }, // keeping the same aspect ratio
      _scene
    );

    // the plane position
    this.m_Mesh.position = _position;

    const planeTexture = AdvancedDynamicTexture.CreateForMesh(
      this.m_Mesh, // mesh that receives the texture
      _textureWidth, // width: default 1024
      _textureHeight, // height: default 1024
      false // whether this plane captures move events: default true
      // switch off for efficiency
    );

    planeTexture.background = _backgroundColor;
    this.m_TextBlock = new TextBlock(_name + " plane text");
    this.m_TextBlock.text = _text;
    this.m_TextBlock.color = _textColor;
    this.m_TextBlock.fontSize = _fontSize;

    // add control just lets the hello texture know that helloText
    // is what to show?
    planeTexture.addControl(this.m_TextBlock);
  }
}

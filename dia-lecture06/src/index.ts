import { Engine } from 'babylonjs'
// import our module
import { App } from './app'

// console.log('hello world');

// document object is the object representation of the
// html file
// this getElementByID will get the element via the ID
// this is JS style, but TS will already know because of the
// return type of getElementByID
const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
if (!canvas) {
    throw new Error("Canvas element with ID 'renderCanvas' not found");
}
// typescript way
// const canvas: HTMLCanvasElement = document.getElementById('renderCanvas');

// this will make a very big Hello XR on the browser window
// const ctx = canvas.getContext('2d');
// ctx.font = '50px Arial';
// ctx.fillText('Hello XR', 50, 50);

// we will start using babylon js nice!

// the context can only be 2D or webgl, it has to choose
// so you can only run the text or the babylon

// create the engine
const engine = new Engine(canvas, true);

const app = new App(engine, canvas);
//const scene = app.createScene();
const scenePromise = app.createScene()

// => is the lambda. we will pass this function
// to the engine which will be run during the engine's
// render loop
// if scene was nas not async, then this would be ok.
// but we don't know when scene is fine
// engine.runRenderLoop(() => {
//     scene.render()
// });

scenePromise.then(scene => {
    engine.runRenderLoop(() => {
        scene.render()
    });
});


// window is top level object
window.addEventListener("resize", () => {
    engine.resize()
})
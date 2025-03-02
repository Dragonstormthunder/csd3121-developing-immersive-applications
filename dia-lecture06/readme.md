# Haphazard Lecture Notes

This lab is a continuation from dia-lecture04.

## Writing Code to Create Skybox in `app.ts`

> Note that we don't use webpack anymore, we use vite.

Our texture is a static asset.

Our devServer in `webpack.config.js` looks like this:

```
    devServer: {
        static: false,
        port: 3000
    },
```

This was fine, because all of our stuff was generated programmatically from code.
However the texture is now a static asset so we need to change this to:

```
    devServer: {
        static: true,
        port: 3000
    },
```

Alternatively we can also `//static` as the default value is `public`.
`static `specifies the path to the directory the assets can be found.

## Writing Code to Create the Camera in `app.ts`

Note the sphere is now black because we don't have lighting.

## Writing Code to Create Lights in `app.ts`

## Writing Code to Create VideoDome in `app.ts`

## Writing Code For a Shortcut to Inspector Mode in `app.ts`

## Writing Code For Resizing the Window in `index.ts`

## Writing Code For Loading a Model in `app.ts`

But `.glb` files are unsupported, as the web reports:
```
Unable to load from assets/meshes/aerobatic_plane.glb: importMesh of undefined from undefined version: undefined, exporter version: undefinedimportMesh has failed JSON parse
RuntimeError: Unable to load from assets/meshes/aerobatic_plane.glb: importMesh of undefined from undefined version: undefined, exporter version: undefinedimportMesh has failed JSON parse
    at t [as constructor] (http://localhost:3000/index.js:32314:1650604)
    at new t (http://localhost:3000/index.js:32314:1650956)
    at p (http://localhost:3000/index.js:32314:4125871)
    at Object.importMesh (http://localhost:3000/index.js:32314:4632645)
    at http://localhost:3000/index.js:32314:4125402
    at f (http://localhost:3000/index.js:32314:4122997)
    at http://localhost:3000/index.js:32314:265586
    at XMLHttpRequest.e (http://localhost:3000/index.js:32314:266836)
```

BabylonJS does not know how to load `.glb`.

So we need to add another loader via another package/library/etc.

### `npm install --save babylonjs-loaders`

After importing the new package, the same error will still occur.
You must add `import 'babylonjs-loaders'`.
This is so that the babylonjs will use the imported loaders.

Usually we use imports to add functions/classes that we need, such as

`
import { AdvancedDynamicTexture, TextBlock } from "babylonjs-gui";
`

These are named imports. We import it with some name.

Instead `import 'babylonjs-loaders'; // import the loaders` is known as a
side effect import. The package will do something, e.g. make babylonjs
understand `.glb`.

There is also a namespace import: `import * as BABYLON from 'babylonjs'`.

In practice we only import what we need.

## Writing Code For Making An Animation in `app.ts`

## Writing Code For Making Some Particles in `app.ts`

## Writing Code For Adding Sound in `app.ts`

## Writing Code For Simple GUI in `app.ts`

There's two types of UI in babylonjs.
- Full Screen
  - An overlay.
- Texture Mode
  - Plane in-world?

In Texture Mode, AR/VR/PC have no issues.
In Full Screen Mode, PC has no issues. VR may have issues since it's overlaid, so the controller cannot detect that. AR? Unspecified.
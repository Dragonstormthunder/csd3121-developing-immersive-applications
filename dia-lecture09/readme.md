# Haphazard Lecture Notes

This lab is a continuation from dia-lecture04.

## Command Line: `npm i copy-webpack-plugin`

Adds the copy-webpack-plugin for the production line.

## Command Line: `npm uni copy-webpack-plugin`

Uninstalls the copy-webpack-plugin.

## Command Line: `npm i copy-webpack-plugin -D`

```
  "devDependencies": {
    "copy-webpack-plugin": "^13.0.0",
    ...
  }
```

Installs as a dev dependency.

`-i`: install
`-D`: development dependency

## Modify the wepback.config.js

Add
```
const CopyPlugin = require('copy-webpack-plugin')
```
at the top of the file.

Insert a new plugin:
```
    plugins: [
        ...,
        new CopyPlugin({
            patterns: [
                {from: path.resolve(__dirname, 'public')}
            ]
        })
    ]
```

The plugin will now help us copy over all our assets in `public` when we create
a standalone application.

It is necessary when building our standalone application we need to copy over
our assets as they are static. However of course you can manually copy the
assets yourself but it's much easier to get a plugin to do it for you.

## Installing extension prettier in VSCode

## npm run serve

`npm run serve`: development deployment. if you make changes, will automatically refresh for you by rebuilding

you need to build your app if it fails.
all the usual compiler things apply; such as optimization.

## remove all .d.ts: `rm *.d.ts`

For making libraries, `.d.ts` is useful but not for a
standalone app.

If you set
```
//        "declaration": true,
```
in the `tsconfig.json`, this prevents these files from generating.

## Component-based architecture

We are gonna clean up our code and then make it component-based architecture.

## create components\meshes\index.ts and components\meshes\hello-text.ts

Extract function body of `App::CreateText` and place it in `components\meshes\hello-text.s`.

So the `meshes` folder is where we create our meshes.

`index.ts` is for easy export.

You can add `import { TextPlane } from './components/meshes'` into `app.ts` to get all the mehes.

## ... some scene readjustment. nothing big here

## create components\meshes\hello-mesh.ts

Playing around and extending `AbstractMesh`.

## implementing behaviors & actions

Just refer to the `app.ts`.

## if you have trouble running coroutine

Add `es6` into the `tsconfig.json`:

```
"lib": [
    "dom",
    "es2015.promise",
    "ES6"
],
```

# going through locomotion + teleportation in `app.ts`
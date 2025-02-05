# Haphazard Lecture Notes

## `mkdir hello-xr`

### nodejs, npm, javascript

Node.js
- allows you to use Javascript outside the web environment
- common way to organize your javascript projects
- virtual machine that lets you run javascript on your computer (since it can only be run on the web browser)

NPM
- package manager for Node.js
- helps you install your packages and javascript projects

JavaScript
- created for web browser
- originally you cannot execute javascript without a web browser

## `npm init --yes`

this will create a package.json.
the `--yes` means you answer "yes" to all questions in the command line.

### json file

stands for javascript object notation.

## `npm install --save babylonjs`

`--save` means it will be saved as a dependency for production. The final production of the app will use this library.

installing babylonjs
babylonjs just handles the graphics for you so you do not need to write our code directly to the GPU

running this command causes NPM to create the `node_modules/babylonjs` folder (this one also has its own `package-lock.json`)
This includes all the APIs for the babylonjs.

NPM also creates the `package-lock.json` the root directory (`ipa-lecture04`).

It also added a dependency
```
"dependencies": {
  "babylonjs": "^7.47.2"
}`
```
into our `package.json`.

### package.json VS package-lock.json

`package-lock.json` has more details about the versioning you use for the project. Sometimes you want to lock down the version of what APIs you are using to avoid new features or old features.

Normally you do not edit the `lock` file, since NPM usually handles it.

But for the normal `package.json` file we will edit. It won't usually be dependencies either, but the `scripts`:
```
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1"
},
```
By default it has a test script.

When you run `npm run test` it will run the test specified in the scripts.

Basically just allows you to automate your project.

### Typescript

a superset of javascript.
introduces strongly types into javascript.

## `npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin`

`--save-dev` means I will save the dependency as a development dependency. It will only be used for development/production, and will not be shipped with your app.

webpack-cli is the command line interface

dev-server will help you set up the local web server.

**We now use Vite, not Webpack.**

We can now see we have dev dependencies:
```
"devDependencies": {
  "html-webpack-plugin": "^5.6.3",
  "webpack": "^5.97.1",
  "webpack-cli": "^6.0.1",
  "webpack-dev-server": "^5.2.0"
}
```

Webpack is a bundler for js
It bundles all your code together and optimizes it, automate your process etc.

## `npm install --save-dev typescript ts-loader`

we need to download typescript. web browser cannot understand typescript but can understand javascript.

The updated `package.json` file for dev dependencies:
```
"devDependencies": {
  "html-webpack-plugin": "^5.6.3",
  "ts-loader": "^9.5.2",
  "typescript": "^5.7.3",
  "webpack": "^5.97.1",
  "webpack-cli": "^6.0.1",
  "webpack-dev-server": "^5.2.0"
}
```

`ts-loader` tells webpack how to load the typescript. It will need to know how to handle the typescript files.

the `typescript` dependency has a compiler that will help convert the typescript into javascript. This "compiler" just translates from typescript to javascript - it does not do any binary, that kind of stuff. Just translate from one high level language to another.

the final app will be written in javascript.

*Side Remark: configuration generally takes longer in these high-level languages. coding is much faster by constrast, as this configuration helps automate all the build/testing/etc.*

## `touch webpack.config.js tsconfig.json`

*Alternatively, on Windows, you can use `type nul > webpack.config.js`. (stackoverflow)[https://stackoverflow.com/questions/76571846/what-is-the-touch-command-equivalent-in-windows-terminal*

These are our 2 configuration files.

## `mkdir src/index.html`

`src` will hold all our source code.

The `index.html` will be our template file for our HTML plugin to create for the app.

`index.ts` will be our entry point for our app.

You can always use any name, but this are the common names. You just need to keep your names consistent along the configuration files.

## Setting up `webpack.config.js`

Take configuration from the [documentation](https://doc.babylonjs.com/setup/frameworkPackages/npmSupport).

We will change our entry point to:
```
entry: './src/index.ts',
```
since we have a `src` directory.

We will modify and add `.js` to the extensions:
```
resolve: {
    extensions: [".ts", ".js"]
},
```
(Video was sped-up, and I could not tell why.)

We will also add
```
    devtool: "inline-source-map"
```
to the end of the `webpack-config.js`.
This is because we write our code in typescript, but the browser needs javascript. When the browser gives an error, this will help map the error back to the typescript file. It is for development purposes.
It is not necessary but it is better to have it for development. You can exclude it from deployment.

We will also add the following to the bottom:
```
devServer: {
    static: false,
    port: 3000
}
```
We are just telling the webpack how to run the development server.
We will not be using static assets since we will be bundling everything with the webpack.
We specify the port. So when we access the webserver we will use this port. Standard HTTP request through this port.

We will then set-up our plugins. Firstly we have to import our plugin:
```
const HtmlWebpackPlugin = require('html-webpack-plugin')
```
Then we can add it into the bottom of our `module.exports`:
```
plugins: [
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src/index.html'),
    })
]
```
Our `index.html` is being used here for the template!

## Setting up `tsconfig.json`

Take configuration from the [documentation](https://doc.babylonjs.com/setup/frameworkPackages/npmSupport). It's the same link as before.

It is the compilation options to specify how the TS gets converted to JS. The compiler in this case is also known as the transpiler.

We will change the `outDir` directory from `./` to `./src`. This will just inject the `.js` files into the same location as their `.ts` compatriots.

We will also change files from
```
"files": [
    "./index.ts"
]
```
to
```
"files": [
    "./src/index.ts"
]
```
This specifies to the compiler what files to convert into `.js` files. We will change our entry point since its location is different.

## Setting up `index.html`

Take configuration from the [documentation](https://doc.babylonjs.com/setup/frameworkPackages/npmSupport). It's the same link as before (x2).

In the HTML you can see there's a line
```
<canvas id="renderCanvas"></canvas>
```

This matters so when we want to grab the canvas from the application code, we can specify its ID.

Because we are using HTML plugin, it will help us include the script in the HTML file. So we will delete the line:
```
<script src="dist/index.js"></script>
```

We need to know about canvas elements. This is where all the graphics are displayed. 3D, 2D graphics will all be done within this canvas. We will target the canvas when we do rendering.

We will add a title. It's not unecessary but it's nice to have.
```
<title>Hello XR</title>
```

## index.ts

We can finally write code!
```
console.log('hello xr');
```

but in order for it to run, we need to add one more line inot the `package.json`...! (＃°Д°)
```
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "build": "webpack",
  "serve": "webpack serve",
  "start": "webpack serve --open"
},
```
We added `build`, `serve`, `start` as part of our scripts.

## `npm run serve`

This setups up the HTTP server for you.
It will watch for any change of your source code. If you change anything it will recompile (hot reload).

You can now open the browser. Hit `CTRL+SHIFT+I` and open up the `Console` and we can see our console log message of `Hello XR!`

If we change our message, it will recompile and re-emit message.

Notetaking will continue on the index.ts file.

There is a good source known as (WebGL Fundamentals)[https://webglfundamentals.org/].

This is optional. You can set-up something in the `tsconfig.json` by adding:
```
"types": [
    "babylonjs"
]
```
This will let you get the full support of babylonjs from typescript.

## Create our own module: `app.ts`

It will help initialize our app.

## `npm install --save babylonjs-gui`

Add:
```
"types": [
    "babylonjs",
    "babylonjs-gui"
 ]
```
Apparently I just learned adding these to types allow Intellisense to autosuggest them as imports.

This GUI is just to build gui.

## Debugging on Meta Quest

You have to register as a developer, then you can use your device for development.
Using a USBC cable.

## Using ADB
to detect your devices and for debugging.

## ScrCpy

Very useful. Lets you mirror the stuff into the computer.
(ScrCpy)[https://github.com/Genymobile/scrcpy]

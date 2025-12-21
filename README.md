# particles

Mainly basic : displays a central snowball with bowls flying around

Requirements :
- finally run without server : only one big html file !
- quickly build a final customized file

## Files 

### Structure
```
particles/
  - index.html
  - basic.html
  - vite.config.js 
  nodes_modules/
  scripts/ : scripts to prepare and build the project
  src/
    - basic.js
    classes/
    components/ : functions, mainly for three
    params/ : classes to customize the project
    textures/ : images

```

## Project setup

Install node.js sur windows

```
npm init -y
npm install three@latest
npm install @types/three
npm install vite --save-dev
npm list @types/three
npm start --host
http://localhost:5173/index.html
```
Pb :
```
ls node_modules/three/examples/jsm/controls/OrbitControls.js
rm -rf .\node_modules\
rm -rf package-lock.json
npm install three@latest
```
Note : npm list --no-unicode > requirements.txt

## Embed images 

Note : images used for textures are data uris in a map called textures. <br>
Useful to run from explorer without server

- from scripts/ run : node jpg2b64.mjs <profile>
  -- this will generate a js module components/textures_b64.js containing images from texture  base 64 encoded 
  -- note 
    --- <profile> refers to class in params/BasicParams.mjs
    --- if no <profile> is given, all images are included ! Avoid (generate hug target) !
    

- cleanup components/textures_b64.js (remove unwanted images) if necessary

## Deployment

### Steps :

0. (if images do not exist) Prepare images in texture
1. (if profile does not ) Create profile in BasicParams.js (create profile class and setup getProfile())
2. Generate b64 images in textures/textures_b64.js : 
  - node jpg2b64.mjs (see "embed images")
3. Generate profile and b64 flag in components/paramSet.mjs : 
  - node setParams.mjs <profile> <b64> : <profile> from BasicParams.js and <b64> true|false
4. build static site in dist/ : 
  - npm run build
5. build big dist/target.html : 
  - npm build.mjs
6. open target.html from File explorer

FAQ :

- if only white bowls, check textures_b64.js. Check b64 flag !
- F12 is your friend

### Detail

npm run build
<pre>
Create dist dir
- dist/
  index.html
  basic.html
  ...
  - assets/
    - js/
      --basic.js
</pre>>

To run without http server and avoid CORS problem, embed scripts in html. 
Only for basic : 

- run python scripts/ToStatic.py 
- or
- npm build.mjs


Manually
<pre>
 (echo "<html><body><script>" && cat ../dist/assets/js/basic.js && echo "</script></body></html>") > z.htm
</pre>

## Tips 

Images projection on bowls give random results.

One way to get better projections is to generate "2x" images : images contining 2 times side-by-side base image 

node jpg2x.mjs helps


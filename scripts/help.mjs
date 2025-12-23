console.log(`
0. (if images do not exist) Prepare images in texture
1. (if profile does not ) Create profile in BasicParams.js (create profile class and setup getProfile())
2. Generate b64 images in textures/textures_b64.js : 
  - node jpg2b64.mjs <profile>
3. Generate profile and b64 flag in components/paramSet.mjs : 
  - node setParams.mjs <profile> <b64> : <profile> from BasicParams.js and <b64> true|false
4. build static site in dist/ : 
  - npm run build
5. build big dist/target.html : 
  - npm build.mjs
6. open target.html from File explorer
`)
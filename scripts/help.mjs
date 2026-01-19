console.log(`
0. (if images do not exist) Prepare images in texture
  hint : node jpg2xCli img backgouunds
1. (if profile does not ) Create profile in BasicParams.js (create profile class and setup getProfile())
2. Generate b64 copies in components/textures_b64.js and components/sounds_b64.js : 
  - node 2b64.mjs <profile>
3. Generate profile and b64 flag in components/paramSet.mjs : 
  - node setParams.mjs <profile> <b64> : <profile> from BasicParams.js and <b64> true|false
4. build static site in dist/ : 
  - npm run build
5. build big dist/target.html : 
  - npm build.mjs
6. open target.html from File explorer
`)
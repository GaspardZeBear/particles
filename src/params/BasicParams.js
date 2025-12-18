
import {
    SpotLight,
    Vector3
} from 'three';

class BasicParams {
    static Ximgs = [
        'Camille.jpg',
        'chess.glb',
        'EliseFabio.jpg',
        'enfants.jpg',
        'enfants1200.jpg',
        'Mael.jpg',
        'NousDeux.jpg',
        'NousDeux02.jpg',
        'pepette.jpg',
        'PereNoel.jpg',
        'alia00.jpg'
    ]
    static b64 = false
    static imgs = ['NousDeux.jpg']
    static snowBallImg = 'maison.jpg'

    static bowlsCount = 1
    static bowlsPerOrbit = 3
    static snowGlobeRadius = 75
    static thingMeshRadius = 20
    static flakesCount = 500

    static cameraFov = 60
    static cameraNear = 10
    static cameraFar = 10000
    static cameraX = 0
    static cameraY = 0
    static cameraZ = 400

    static spotLights = []
    

    static {
        console.log("Basic Params Init()")
        BasicParams.spotLights = []
        BasicParams.spotLights[0] = new SpotLight(0xffffff, 10.0, 200, Math.PI / 3, 100, 0)
        BasicParams.spotLights[0].position.set(100, 200, 50)
        BasicParams.spotLights[0].target.position.set(-3.5, 0, 2);

        //BasicParams.spotLights[1] = new SpotLight( 0xff00ff, 5.0, 200,Math.PI,0,0.1 );
        //BasicParams.spotLights[1].position.set(-100,-100,100)
    }
}

export { BasicParams }

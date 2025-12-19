//------------------------------------------------------------- 
class Alia {
    static b64 = false
    static imgs = ['alia01.jpg','alia002x.jpg']
    static snowBallImg = 'alia00.jpg'
    static bowlsCount = 15
    static bowlsPerOrbit = 8
    static snowGlobeRadius = 75
    static thingMeshRadius = 20
    static flakesCount = 500

    static cameraFov = 60
    static cameraNear = 10
    static cameraFar = 10000
    static cameraX = 0
    static cameraY = 0
    static cameraZ = 400
}

//------------------------------------------------------------- 
class IsaFamily {
    static imgs = [
        'Camille.jpg',
        'EliseFabio.jpg',
        'enfants.jpg',
        'enfants1200.jpg',
        'Mael.jpg',
        'NousDeux.jpg',
        'NousDeux02.jpg',
        'pepette.jpg',
        'PereNoel.jpg',
        //'alia00.jpg'
    ]
    static b64 = false
    static snowBallImg = 'maison.jpg'
    static bowlsCount = 15
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
}

//------------------------------------------------------------- 
class Test {
    static b64 = false
    static imgs = ['NousDeux2x.jpg','alia002x.jpg']
    static snowBallImg = 'maison.jpg'

    static bowlsCount = 15
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
}

class BasicParams {
    static profile = 'Test'
    static setProfile(name='Test') {
        BasicParams.profile=name
    }
    static getProfile() {
        console.log("getProfile()")
        switch(BasicParams.profile) {
            case 'Alia' : return(new Alia())
            case 'Test' : return(new Test())
            case 'IsaFamily' : return(new IsaFamily())
            default : return(null)
        }
    }
}

export { BasicParams }

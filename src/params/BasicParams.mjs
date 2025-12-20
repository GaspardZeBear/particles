//------------------------------------------------------------- 
class Alia {
    static b64 = false
    static imgs = ['alia00.jpg','alia002x.jpg','alia002x.jpg','alia022x.jpg']
    static snowBallImg = 'alia00.jpg'
    static bowlsCount = 5
    static bowlsPerOrbit = 5
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
class Gigaro {
    static b64 = false
    static imgs = ['NousDeux2x.jpg','Juin.jpg',]
    static snowBallImg = 'Gigaro2x.jpg'
    static bowlsCount = 1
    static bowlsPerOrbit = 1
    static snowGlobeRadius = 150
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
        'Camille2x.jpg',
        'Fabio2x2x.jpg',
        'Mael.jpg',
        'MaelPereNoel2x.jpg',
        'NousDeux2x.jpg',
        'NousDeux2x2x.jpg',
        'NousDeux022x.jpg',
        'Pepette2x.jpg',
        'PereNoel.jpg',
        //'alia00.jpg'
    ]
    static b64 = true
    static snowBallImg = 'maison.jpg'
    static bowlsCount = 10
    static bowlsPerOrbit = 6
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
    static snowGlobeRadius = 25
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
            case 'Gigaro' : return(new Gigaro())
            case 'Test' : return(new Test())
            case 'IsaFamily' : return(new IsaFamily())
            default : return(null)
        }
    }
}

export {BasicParams}


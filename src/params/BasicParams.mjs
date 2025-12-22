//------------------------------------------------------------- 
class Alia {
    static b64 = false
    static imgs = [
        'alia00_0_0_255_3x.jpg',
        'alia00_200_128_200_3x.jpg',
        'alia00_255_0_0_3x.jpg',
        'alia00_0_255_0_3x.jpg',
        'alia00_0_255_0_3x.jpg',
        'alia00_200_128_200_2x.jpg',
    ]
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
class Full {
    static b64 = false
    static imgs = ['Camille.jpg',
        '',
'Camille2x.jpg',
'Elisabeth2x.jpg',
'Elisabeth012x.jpg',
'Fabio2x.jpg',
'Fabio2x2x.jpg',
'Gigaro2x.jpg',
'GigaroStudio2x.jpg',
'JoGato2x.jpg',
'JoMaSki2x.jpg',
'Juin2x.jpg',
'LoJoHalloween2x.jpg',
'LoJoMaAe2x.jpg',
'LoJoMaAnniv2x.jpg',
'LoJoMaBouee2x.jpg',
'LoJoMaFiance2x.jpg',
'LoJoMaGaufre2x.jpg',
'LoJoMaHalloween2x.jpg',
'LoJoMaSKi012x.jpg',
'LoJoMaSki022x.jpg',
'LoJoMaVoiture2x.jpg',
'LoJoSki2x.jpg',
'LoMaBalneo2x.jpg',
'LoMaBoucherie2x.jpg',
'LoMaHalloween2x.jpg',
'LoMaManege2x.jpg',
'LoMaMartroi2x.jpg',
'LoMaMenage.jpg',
'LoMer2x.jpg',
'LoRose2x.jpg',
'LoSceours2x.jpg',
'MaGoto2x.jpg',
'Mael2x.jpg',
'MaelPereNoel2x.jpg',
'NousDeux022x.jpg',
'NousDeux2x.jpg',
'NousDeux2x2x.jpg',
'Pepette2x.jpg',
'PereNoel.jpg',
'background.jpg',
'chritian2x.jpg',
'enfants.jpg',
'enfants1200.jpg',
'maison2x.jpg',
'pepette2x.jpg',
]
    static snowBallImg = 'x.jpg'
    static bowlsCount = 20
    static bowlsPerOrbit = 10
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
            case 'Full' : return(new Full())
            default : return(null)
        }
    }
}

export {BasicParams}


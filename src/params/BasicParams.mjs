import conf from "./BasicParamsConf.mjs"

class BasicParams {
    static P
    static profile
    static {
        console.log("Applying ./BasicParamsConf.mjs")
        BasicParams.P=conf
    }

    constructor() {
        for (let k in conf) {
            console.log("k=",k)
        }
    }

    static setProfile(profile) {
        //return(BasicParams.profile=profile)
        for (let d of Object.keys(BasicParams.P["_defaults"])) {
            if ( BasicParams.P[profile][d] === undefined ) {
               console.log(`setting param ${d} from _defaults, value ${BasicParams.P["_defaults"][d]}`)
               BasicParams.P[profile][d] = BasicParams.P["_defaults"][d]
            }
        }
        BasicParams.profile=profile
    }

    static getProfile(profile) {

        return(BasicParams.P[BasicParams.profile])
    }

}

export {BasicParams}





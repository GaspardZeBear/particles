import conf from "./BasicParamsConf.mjs"

class BasicParams {
    static P
    static profile
    static {
        console.log("static")
        BasicParams.P=conf
    }

    constructor() {
        for (let k in conf) {
            console.log("k=",k)
        }
    }

    static setProfile(profile) {
        return(BasicParams.profile=profile)
    }

    static getProfile(profile) {
        return(BasicParams.P[BasicParams.profile])
    }

}

export {BasicParams}





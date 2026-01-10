import {
    Audio,
    AudioAnalyser,
    AudioListener,
    AudioLoader
} from 'three';


class Sound {

    constructor(params) {
        this.params = params
        this.audioContext = null;
        this.audioLoader = null;;
        this.listener = null;;
        this.analyser = null;;
        this.isPlaying = null;
        this.sound = null;
        // Variables pour la détection de battement
        this.lastBeatTime = 0;
        this.lastTime = 0;

        this.beatThreshold = 120;
        this.beatHoldTime = 200;
        this.lowEndSlice = 10
        this.addAudioMsgDiv()
        this.startStopAudio()
        this.sumTimes = 0
        this.musicPosition=0
        console.log(this.params)
    }

    //--------------------------------------------------------------------------------------
    // Variable globale pour l'AudioContext
    // Fonction pour initialiser l'audio après un geste utilisateur
    initAudio() {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
            console.log(this.audioContext.sampleRate);
            this.audioLoader = new AudioLoader();
            this.listener = new AudioListener();
            this.sound = new Audio(this.listener);
            this.analyser = new AudioAnalyser(this.sound, 64);
        }
    }

    //--------------------------------------------------------------------------
    startStopAudio() {
        window.addEventListener('click', () => {
            this.initAudio();
            if (!this.isPlaying) {
                this.audioLoader.load(this.params.mp3, (buffer) => {
                    this.sound.setBuffer(buffer);
                    this.sound.setLoop(false);
                    this.sound.setVolume(1);
                    this.sound.play(0);
                    this.sound.loopStart=this.musicPosition;
                    this.startTime = this.audioContext.currentTime
                    this.isPlaying = true;
                });
            } else {
                //this.musicPosition = this.audioContext.currentTime - this.startTime + this.sound.offset
                //- this.sound.startTime + this.sound.offset
                console.log("musicOffset " , this.sound.offset )
                this.sound.stop();
                this.isPlaying = false;
            }
        });
    }

    //-------------------------------------------------------------------------------
    addAudioMsgDiv() {
        // Ajouter un message pour informer l'utilisateur
        const info = document.createElement('div');
        info.style.position = 'absolute';
        info.style.top = '10px';
        info.style.width = '100%';
        info.style.textAlign = 'center';
        info.textContent = 'Cliquez n’importe où pour activer l’audio.';
        document.body.appendChild(info);
    }

    httpLog(tmstp, t, type, msg) {
        fetch("http://localhost:1961/log", {
            method: "POST",
            body: JSON.stringify({
                tmstp: tmstp,
                t: t,
                msg: msg,
                type: type,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            }
        })
            .catch((err) => { })
            .then((response) => { })
            .then((json) => console.log(json));


    }

    beat(t) {
        if (this.isPlaying) {
            const ddate = new Date().toISOString()
            const currentTime = Date.now();
            const freqs = this.analyser.getFrequencyData();
            // console.log(freqs)
            
            let buf=""
            for (let k=0;k<freqs.length;k++) {
                buf += freqs[k] + " "
            }
            this.httpLog(ddate, t, "freqs", buf)
            
            const lowEnd = freqs.slice(0, this.params.lowEndSlice).reduce((a, b) => a + b, 0) / this.params.lowEndSlice;
            this.httpLog(ddate, t, "lowEnd", lowEnd)
            if ((lowEnd > this.params.beatThreshold) && (currentTime - this.lastBeatTime > this.params.beatHoldTime)) {
                this.lastBeatTime = currentTime;
                return (true)
            } else {
                return (false)
            }
        } else {
            return (false)
        }
    }


    Fixbeat(t) {
        if (this.isPlaying) {
            const currentTime = Date.now();
            let elapsed = currentTime - this.lastTime
            this.sumTimes += elapsed
            this.lastTime = currentTime
            let interval = 1000 * 60 / this.params.bpm
            console.log("currentTime=", currentTime, " elapsed=", elapsed, " sumTimes=", this.sumTimes, " freq=", 1000 * 60 / this.params.bpm)
            if (this.sumTimes > interval) {
                this.lastBeatTime = currentTime;
                this.sumTimes = 0;
                return (true)
            } else {
                return (false)
            }
        } else {
            return (false)
        }

    }




}
export default Sound
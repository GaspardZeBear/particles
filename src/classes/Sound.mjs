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
        this.beatThreshold = 120;
        this.beatHoldTime = 200;
        this.lowEndSlice = 10
        this.addAudioMsgDiv()
        this.startStopAudio()
        console.log(this.params)
    }

    //--------------------------------------------------------------------------------------
    // Variable globale pour l'AudioContext

    // get the average frequency of the sound
    //const data = analyser.getAverageFrequency();

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

    // Écouteur d'événement pour un clic utilisateur
    startStopAudio() {
        window.addEventListener('click', () => {
            this.initAudio();

            if (!this.isPlaying) {
                this.audioLoader.load(this.params.mp3, (buffer) => {
                    this.sound.setBuffer(buffer);
                    this.sound.setLoop(false);
                    this.sound.setVolume(1);
                    this.sound.play();
                    this.isPlaying = true;
                });
            } else {
                this.sound.stop();
                this.isPlaying = false;
            }
        });
    }

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




}
export default Sound
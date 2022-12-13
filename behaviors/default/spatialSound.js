class SpatialSoundActor {
    setup() {
        this.listen("tapped", "tapped");
        this.listen("uploaded", "uploaded");
    }

    tapped() {
        this.say("playSoundRequested");
        this._cardData.playStartTime = this.now();
    }
}

class SpatialSoundPawn {
    setup() {
        this.handler = () => this.start();
        document.addEventListener("pointerdown", this.handler);
        this.interval = setInterval(() => this.adjustIfNecessary(), 1000);

        this.listen("playSoundRequested", "playSoundRequested");
        this.subscribe("soundPlayer", "toggleSound", "toggleSound");
        this.addEventListener("pointerTap", "tapped");
    }

    start() {
        if (this.handler) {
            document.removeEventListener("pointerdown", this.handler);
            delete this.handler;
            console.log("starting");
        }

        this.ensureAudio();
    }

    tapped() {
        this.say("tapped");
    }

    ensureAudio() {
        let THREE = Microverse.THREE;
        if (this.audio) {
            return Promise.resolve(this.audio);
        }
        if (this.ensureAudioPromise) {
            return this.ensureAudioPromise;
        }

        let soundLocation = this.actor._cardData.soundLocation;
        this.ensureAudioPromise = this.getBuffer(soundLocation).then((buffer) => {
            let objectURL = URL.createObjectURL(new Blob([buffer], {type: "audio/mp3"}));
            this.file = objectURL;
            this.objectURL = objectURL;
            return this.file;
        }).then(() => {
            this.listener = new THREE.AudioListener();

            let renderer = this.service("ThreeRenderManager");
            let camera = renderer.camera;
            camera.add(this.listener);

            let audio = new THREE.PositionalAudio(this.listener);
            let audioLoader = new THREE.AudioLoader();
            return new Promise((resolve, _reject) => {
                audioLoader.load(this.file, (buffer) => {
                    audio.setBuffer(buffer);
                    audio.setRefDistance(20);
                    this.loop = this.actor._cardData.loop || false;
                    this.volume = this.actor._cardData.volume || 0.25;
                    this.maxVolume = this.actor._cardData.maxVolume || 0.5;
                    this.shape.add(audio);
                    this.audio = audio;
                    this.audio.setLoop(this.loop);
                    this.audio.setVolume(this.volume);
                    this.adjustIfNecessary();
                    this.stop();
                    resolve(this.audio);
                });
            });
        });
        return this.ensureAudioPromise;
    }

    async playSoundRequested() {
        if (this.audio && this.audio.isPlaying) {return;}
        if (!this.audio) {
            await this.ensureAudio();
        }
        let now = this.now();
        this.audio.offset = (now - this.actor._cardData.playStartTime) / 1000;
        this.play();
    }

    adjustIfNecessary() {}

    toggleSound() {
        if (this.playing) {
            this.stop();
        } else {
            this.play();
        }
    }

    ended() {
        if (this.audio) {
            console.log("ended");
            this.playing = false;
        }
    }

    play() {
        if (this.audio) {
            this.playing = true;
            this.audio.play();
        }
    }

    stop() {
        if (this.audio) {
            this.audio.pause();
            this.playing = false;
        }
    }

    teardown() {
        if(this.audio) this.stop();
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

export default {
    modules: [
        {
            name: "SpatialSoundPlayer",
            actorBehaviors: [SpatialSoundActor],
            pawnBehaviors: [SpatialSoundPawn]
        },
    ]
}

/* globals Microverse */

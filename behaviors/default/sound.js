class SoundActor {
    setup() {
        this.listen("tapped", "tapped");
    }

    tapped() {
        this.say("playSoundRequested");
        this._cardData.playStartTime = this.now();
    }
}

class SoundPawn {
    setup() {
        this.handler = () => this.start();
        document.addEventListener("pointerdown", this.handler);
        this.interval = setInterval(() => this.adjustIfNecessary(), 1000);

        this.listen("cardDataSet", "soundChanged");
        this.listen("playSoundRequested", "playSoundRequested");
        this.addEventListener("pointerTap", "tapped");
    }

    start() {
        if (this.handler) {
            document.removeEventListener("pointerdown", this.handler);
            delete this.handler;
            console.log("starting");

        }

        this.file = this.actor._cardData.soundLocation;
        this.loop = this.actor._cardData.loop || false;
        this.volume = this.actor._cardData.volume || 0.25;
        this.maxVolume = this.actor._cardData.maxVolume || 0.5;
        this.audio = new Audio(this.file);
        this.audio.loop = this.loop;
        this.audio.volume = this.volume;
        this.audio.autoplay = true;
        this.audio.onended = () => this.ended();
        this.adjustIfNecessary();
        this.stop();
    }

    tapped() {
        this.say("tapped");
    }

    playSoundRequested() {
        if (this.audio && this.playing) {return;}
        let now = this.now();
        this.audio.currentTime = (now - this.actor._cardData.playStartTime) / 1000;
        this.play();
    }

    soundChanged() {
        console.log("soundChanged");
        this.stop();
        this.start();
    }

    adjustIfNecessary() {}

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
            name: "SoundPlayer",
            actorBehaviors: [SoundActor],
            pawnBehaviors: [SoundPawn]
        }
    ]
}

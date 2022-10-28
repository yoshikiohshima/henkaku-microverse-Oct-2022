class SoundActor {
    setup() {
        this.listen("tapped", "tapped");
        this.listen("uploaded", "uploaded");
    }

    tapped() {
        this.say("playSoundRequested");
        this._cardData.playStartTime = this.now();
    }

    uploaded(dataId) {
        this._cardData.uploadedDataLocation = dataId;
    }
}

class SoundPawn {
    setup() {
        this.handler = () => this.start();
        document.addEventListener("pointerdown", this.handler);
        this.interval = setInterval(() => this.adjustIfNecessary(), 1000);

        this.listen("cardDataSet", "soundChanged");
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

        let soundLocation = this.actor._cardData.soundLocation;

        return this.getBuffer(soundLocation).then((buffer) => {
            let objectURL = URL.createObjectURL(new Blob([buffer], {type: "audio/mp3"}));
            this.file = objectURL;
            this.objectURL = objectURL;
            // need to be revoked when destroyed
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
        });
    }

    ensureFile() {
        let soundLocation = this.actor._cardData.soundLocation;

        return this.getBuffer(soundLocation).then((buffer) => {
            let objectURL = URL.createObjectURL(new Blob([buffer], {type: "audio/mp3"}));
            this.file = objectURL;
        });
    }

    tapped() {
        this.say("tapped");
    }

    async playSoundRequested() {
        if (this.audio && this.playing) {return;}
        if (!this.file) {
            await this.ensureFile();
        }
        let now = this.now();
        this.audio.currentTime = (now - this.actor._cardData.playStartTime) / 1000;
        this.play();
    }

    soundChanged() {
        console.log("soundChanged");

        if (this.actor._cardData.uploadFileLocation && !this.actor._cardData.uploadedDataLocation) {
            this.makeDataId();
        }
        this.stop();
        this.start();
    }

    makeDataId() {
        let source = this.actor._cardData.uploadFileLocation;

        this.getBuffer(source).then((buffer) => {
            return Microverse.Data.store(this.sessionId, buffer.buffer);
        }).then((handle) => {
            return Microverse.Data.toId(handle)
        }).then((dataId) => {
            this.say("uploaded", dataId);
        });
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

class AudioMenuPawn {
    setup() {
        this.teardown();
        this.menuItems = [];

        this.installMenu("Toggle Sound", "", () => this.publish("soundPlayer", "toggleSound"));
    }

    installMenu(menuText, menuImage, callback) {
        let menu = document.body.querySelector("#worldMenu");
        if (menu) {
            let menuItemDiv = document.createElement("div");
            menuItemDiv.innerHTML =
                `<div id="worldMenu-sound" class="menu-label menu-item">
                <span class="menu-label-text">${menuText}</span>
                <div class="menu-icon"></div>
                </div>`.trim();
            let menuItem = menuItemDiv.firstChild;
            if (menuImage) {
                let menuIcon = menuItem.querySelector(".menu-icon");
                menuIcon.style.setProperty("background-image", `url(${menuImage})`);
                menuIcon.style.setProperty("background-size", "contain");
            }
            menuItem.addEventListener("click", callback);
            menu.appendChild(menuItem);

            this.menuItems.push(menuItem); // needs to be an array
        }
    }

    teardown() {
        if (this.menuItems) {
            this.menuItems.forEach( m=>m.remove());
            delete this.menuItems;
        }
    }
}

export default {
    modules: [
        {
            name: "SoundPlayer",
            actorBehaviors: [SoundActor],
            pawnBehaviors: [SoundPawn]
        },
        {
            name: "AudioMenu",
            pawnBehaviors: [AudioMenuPawn]
        }
    ]
}

/* globals Microverse */

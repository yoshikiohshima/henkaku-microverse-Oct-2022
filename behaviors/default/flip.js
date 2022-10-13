class FlipActor {
    setup() {
        this._cardData.state = "h"; // "h" head, "t" tail, h2t, t2h
        this.listen("cardDataSet", "updateCard");
        this.addEventListener("pointerTap", "flip");
        this.updateCard();
    }

    flip() {
        let state = this._cardData.state;
        if (state === "h" || state === "t") {
            if (state === "h") {
                this._cardData.state = "h2t";
            } else if (state === "t") {
                this._cardData.state = "t2h";
            }
            this.startRotation = this.rotation;
            this.endRotation = Microverse.q_multiply(Microverse.q_euler(0, Math.PI, 0), this.startRotation);
            if (!this.oldStartRotation) {
                this.oldStartRotation = this.startRotation;
            }
            this.flipStartTime = this.now();
            this.animation();
        }
    }

    updateCard() {
        this.createCards();
    }

    animation() {
        if (!this.flipStartTime) {return;}
        let now = this.now();
        let offset = now - this.flipStartTime;
        let state = this._cardData.state;

        let ratio = Math.min(1, Math.max(0, offset / 1000)); // milliseconds
        let angle = Microverse.q_slerp(this.startRotation, this.endRotation, ratio);

        this.rotateTo(angle);

        if (state === "h2t" && ratio === 1) {
            this._cardData.state = "t";
            this.set({rotatation: this.endRotation});
        } else if (state === "t2h" && ratio === 1) {
            this._cardData.state = "h";
            // to avoid accumulating errors, we record that the startRotation and
            // if the endRotation is almost coming back to it, we snap to it.
            // otherwise, we make sure that oldStartRotation is cleared and next new start rotation is recorded.
            // It does not matter whether you start from head or tail.
            if (Microverse.q_equals(this.oldStartRotation, this.endRotation, 0.00001)) {
                this.set({rotation: this.oldStartRotation});
            } else {
                delete this.oldStartRotation;
                this.set({rotatation: this.endRotation});
            }
        } else if (state !== "h" && state !== "t") {
            this.future(50).animation();
        }
    }

    createCards() {
        this.removeCards();
        if (this._cardData.tailTextureLocation) {
            this.tailCard = this.createCard({
                name: 'tail',
                parent: this,
                type: "2d",
                textureType: "image",
                textureLocation: this._cardData.tailTextureLocation,
                noSave: true,
                depth: 0.02,
                cornerRadius: 0.05,
                // layers: [],
                translation: [0, 0, -0.1],
                rotation: [0, Math.PI, 0],
                width: this._cardData.width,
                height: this._cardData.height,
            });
        }
    }

    removeCards() {
        if (this.tailCard) {
            this.tailCard.destroy();
        }
    }

    teardown() {
        this.ignore("cardDataSet", "updateCard");
        delete this.flipStartTime;
        this.removeEventListener("pointerTap", "flip");
    }
}

export default {
    modules: [
        {
            name: "Flip",
            actorBehaviors: [FlipActor],
        },
    ]
};

/* globals Microverse */

/**
A stroke object looks to have the following schema, if we define an actual class for it.
However, we use plain JS objects in the actual implementation.

class Stroke {
    constructor() {
        this.done = true;
        this.segments = [];
    }

    addSegment(segment) {
        this.segments.push(segment);
    }

    undo() {
        this.done = false;
    }

    redo() {
        this.done = true;
    }
}

strokeLists is a Map keyed by the viewId so that undo request from a user can be handled.
globals is an ordered list that stores all strokes since the beginning of the session.

*/

class DrawingCanvasActor {
    setup() {
        this.subscribe(this.sessionId, "view-exit", "viewExit");
        this.listen("startLine", "startLine");
        this.listen("addLine", "addLine");
        this.listen("undo", "undo");
        this.listen("redo", "redo");
        this.listen("clear", "clear");
        if (!this._cardData.globalDrawing) {
            this._cardData.globalDrawing = [];
            this._cardData.strokeLists = new Map();
        }
        console.log("DrawingCanvasActor.setup");
    }

    setData(data) {
        let {global, strokeLists} = data;
        this._cardData.globalDrawing = global;
        this._cardData.strokeLists = strokeLists;
    }

    viewExit(viewId) {
        this._cardData.strokeLists.delete(viewId);
    }

    addLine(data) {
        let {viewId, x0, y0, x1, y1, color, nib, under, isNew} = data;

        let global = this._cardData.globalDrawing;
        let strokeLists = this._cardData.strokeLists;
        let strokes = strokeLists.get(viewId);
        if (!strokes) {
            strokes = [];
            strokeLists.set(viewId, strokes);
        }

        let stroke;
        if (isNew) {
            stroke = {done: true, segments: []};
            global.push(stroke);
            strokes.push(stroke);
        } else {
            stroke = strokes[strokes.length - 1];
        }

        let segment = {x0, y0, x1, y1, color, nib, under, viewId};
        stroke.segments.push(segment);
        this.say("drawLine", segment);
    }

    undo(viewId) {
        let strokeLists = this._cardData.strokeLists;
        let strokes = strokeLists.get(viewId);

        let findLast = () => {
            if (!strokes) {return -1;}
            for (let i = strokes.length - 1; i >= 0; i--) {
                if (strokes[i].done) {return i;}
            }
            return -1;
        };

        let index = findLast();
        if (index >= 0) {
            strokes[index].done = false;
            this.say("drawAll");
        }
    }

    redo(viewId) {
        let strokeLists = this._get("strokeLists");
        let strokes = strokeLists.get(viewId);

        let find = () => {
            if (!strokes) {return -1;}
            if (strokes.length === 0) {return -1;}
            if (strokes.length === 1) {return strokes[0].done ? -1 : 0;}
            for (let i = strokes.length - 1; i >= 1; i--) {
                if (strokes[i].done) {return -1;}
                if (!strokes[i].done && strokes[i - 1].done) {return i;}
            }
            return 0;
        };

        let index = find();
        if (index >= 0) {
            strokes[index].done = true;
            this.say("drawAll");
        }
    }

    clear(_viewId) {
        this._get("global").length = 0;
        this._get("strokeLists").clear();
        this.say("drawAll");
    }
}

class DrawingCanvasPawn {
    setup() {
        this.listen("drawLine", "drawLineAndMove");
        this.listen("drawAll", "drawAll");
        this.listen("resizeAndDraw", "resizeAndDraw");
        this.listen("colorSelected", "colorSelected");
        this.listen("nibSelected", "nibSelected");

        this.color = this.randomColor();
        this.nib = 8;
        this.addEventListener("pointerDown", "pointerDown");

        this.drawAll();
        console.log("DrawingCanvasPawn.setup");
    }

    resize(width, height) {
        console.log(width, height);
    }

    resizeAndDraw() {
        /*
        let width = this.model._get("width");
        let height = this.model._get("height");
        if (width && height) {
            this.resize(width, height);
        }
        */
        this.drawAll();
    }

    colorSelected(color) {
        this.color = color;
    }

    nibSelected(nib) {
        this.nib = nib;
    }

    clear() {
        let canvas = this.canvas;
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.texture.needsUpdate = true;
    }

    drawAll() {
        let global = this.actor._cardData.globalDrawing;
        if (!global) {return;}
        this.clear();
        this.drawStrokes(global);
    }

    drawStrokes(strokes) {
        strokes.forEach((stroke) => {
            if (!stroke.done) {return;}
            stroke.segments.forEach((segment) => {
                this.drawLine(segment);
            });
        });
        this.texture.needsUpdate = true;
    }

    drawLineAndMove(segment) {
        this.drawLine(segment);
        this.texture.needsUpdate = true;
    }

    drawLine(segment) {
        let {x0, y0, x1, y1, color, under, nib} = segment;

        let p0 = this.invertPoint(x0, y0);
        let p1 = this.invertPoint(x1, y1);

        let ctx = this.canvas.getContext("2d");

        let rule = "source-over";
        let c = color || "black";
        if (color === "#00000000") {
            rule = "destination-out";
            c = "green";
        }
        if (under) {
            rule = "destinationover";
        }
        ctx.globalCompositeOperation = rule;
        ctx.lineWidth = nib || 8;
        ctx.lineCap = "round";
        ctx.strokeStyle = c;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
    }

    pointerDown(evt) {
        if (evt.buttons !== 1) {return;}
        if (this.disabled) {return;}

        evt = this.cookEvent(evt);

        this.addEventListener("pointerMove", "pointerMove");
        this.addEventListener("pointerUp", "pointerUp");

        let offsetX = evt.x;
        let offsetY = evt.y;
        let p = this.transformPoint(offsetX, offsetY);
        this.lastPoint = p;
        this.isNew = true;
    }

    pointerMove(evt) {
        if (evt.buttons !== 1) {return;}
        if (this.disabled) {return;}

        evt = this.cookEvent(evt);

        if (this.lastPoint) {
            let x0 = this.lastPoint.x;
            let y0 = this.lastPoint.y;

            let p = this.transformPoint(evt.x, evt.y);

            let color = this.color;
            let nibScale = this.parentNode ? this.parentNode.scale : 1;
            if (!nibScale) {
                nibScale = 1;
            }
            let nib = this.nib / nibScale;
            this.lastPoint = p;
            let isNew = this.isNew;
            this.isNew = false;
            this.say("addLine", {viewId: this.viewId, x0, y0, x1: p.x, y1: p.y, color, nib, isNew});
        }
    }

    pointerUp(evt) {
        if (!this.lastPoint) {return;}
        if (this.disabled) {return;}
        console.log("pointerUp");

        let cooked = this.cookEvent(evt);
        let p = this.transformPoint(cooked.x, cooked.y);
        let last = this.lastPoint;
        if (last && last.x === p.x && last.y === p.y) {
            this.pointerMove({buttons: evt.buttons,
                              offsetX: cooked.x + 0.01,
                              offsetY: cooked.y});
            this.publish(this.sessionId, "triggerPersist");
        }
        this.lastPoint = null;

        this.removeEventListener("pointerUp", "pointerUp");
        this.removeEventListener("pointerMove", "pointerMove");
    }

    cookEvent(evt) {
        if (!evt.xyz) {return;}
        let vec = new Microverse.THREE.Vector3(...evt.xyz);
        let inv = this.renderObject.matrixWorld.clone().invert();
        let vec2 = vec.applyMatrix4(inv);

        let x = (vec2.x + 0.5) * this.actor._cardData.textureWidth;
        let y = (-vec2.y + 0.5) * this.actor._cardData.textureHeight;

        console.log(x, y);

        return {x, y};

        /*
        let width = this.plane.geometry.parameters.width;
        let height = this.plane.geometry.parameters.height;

        let x = ((width / 2) + vec2.x) / this.textScale();
        let y = ((height / 2) - vec2.y + this.getScrollTop(height)) / this.textScale();
        return {x, y};
        */
    }

    transformPoint(x, y) {
        return {x, y};
    }

    invertPoint(x, y) {
        return {x, y};
    }

    teardown() {
        this.removeEventListener("pointerUp", "pointerUp");
        this.removeEventListener("pointerMove", "pointerMove");
        this.removeEventListener("pointerDown", "pointerDown");
    }

    randomColor() {
        let h = Math.floor(Math.random() * 360);
        return `hsl(${h} 75% 75%)`;
    }
}

export default {
    modules: [
        {
            name: "DrawingCanvas",
            actorBehaviors: [DrawingCanvasActor],
            pawnBehaviors: [DrawingCanvasPawn],
        }
    ]
};

/* globals Microverse */

export class Point {
    constructor(time = 0, event = null, touch = null,
                target = null, identifier = null,
                radiusX = 1, radiusY = 1, rotationAngle = 0,
                x = 0, y = 0,
                pageX = 0, pageY = 0,
                clientX = 0, clientY = 0,
                screenX = 0, screenY = 0,
                targetX = 0, targetY = 0,
                targetPageX = 0, targetPageY = 0,
                targetClientX = 0, targetClientY = 0,
                targetScreenX = 0, targetScreenY = 0) {
        this.time = time;
        this.event = event;
        this.touch = touch;
        this.target = target;
        this.identifier = identifier;
        this.x = x;
        this.y = y;
        this.pageX = pageX;
        this.pageY = pageY;
        this.clientX = clientX;
        this.clientY = clientY;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.screenX = screenX;
        this.screenY = screenY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.targetPageX = targetPageX;
        this.targetPageY = targetPageY;
        this.targetClientX = targetClientX;
        this.targetClientY = targetClientY;
        this.targetScreenX = targetScreenX;
        this.targetScreenY = targetScreenY;
        this.rotationAngle = rotationAngle;
    }
    clone() {
        return Object.create(this);
    }
}

Point.prototype.type = '';
Point.prototype.time = 0;
Point.prototype.index = 0;
Point.prototype.event = null;
Point.prototype.touch = null;
Point.prototype.target = null;
Point.prototype.identifier = null;
Point.prototype.x = 0;
Point.prototype.y = 0;
Point.prototype.pageX = 0;
Point.prototype.pageY = 0;
Point.prototype.radiusX = 1;
Point.prototype.radiusY = 1;
Point.prototype.screenX = 0;
Point.prototype.screenY = 0;
Point.prototype.targetX = 0;
Point.prototype.targetY = 0;
Point.prototype.targetPageX = 0;
Point.prototype.targetPageY = 0;
Point.prototype.targetClientX = 0;
Point.prototype.targetClientY = 0;
Point.prototype.targetScreenX = 0;
Point.prototype.targetScreenY = 0;
Point.prototype.rotationAngle = 0;

Point.prototype.movementX = 0;
Point.prototype.movementY = 0;
Point.prototype.movementT = 0;
Point.prototype.magnitude = 0;
Point.prototype.direction = 0;
Point.prototype.movementXTotal = 0;
Point.prototype.movementYTotal = 0;
Point.prototype.movementTTotal = 0;
Point.prototype.timeOrigin = 0;
Point.prototype.pageXOrigin = 0;
Point.prototype.pageYOrigin = 0;
Point.prototype.xOrigin = 0;
Point.prototype.yOrigin = 0;
Point.prototype.screenXOrigin = 0;
Point.prototype.screenYOrigin = 0;
Point.prototype.targetPageXOrigin = 0;
Point.prototype.targetPageYOrigin = 0;
Point.prototype.targetXOrigin = 0;
Point.prototype.targetYOrigin = 0;
Point.prototype.targetClientXOrigin = 0;
Point.prototype.targetClientYOrigin = 0;

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.epsilon = epsilon;
function epsilon(w, h, dx, dy) {
    return w * h < dx * dx + dy * dy;
}
//# sourceMappingURL=epsilon.js.map
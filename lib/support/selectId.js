"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.selectId = selectId;
function selectId(selectedId) {
    return function selectId(touchEvent) {
        return touchEvent.identifier === selectedId;
    };
}
//# sourceMappingURL=selectId.js.map
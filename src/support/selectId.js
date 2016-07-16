export function selectId(selectedId) {
    return function selectId(touchEvent) {
        return (touchEvent.identifier || 0) === selectedId;
    }
}

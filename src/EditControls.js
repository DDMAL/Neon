import EditListeners from "./EditListeners.js"

export default function EditControls (dragHandler, neonView) {
    var editListeners = new EditListeners(dragHandler);

    resetListeners();

    function resetListeners(){
        editListeners.initListeners();
        neonView.resetListeners();
    }

    EditControls.prototype.resetListeners = resetListeners; 
}
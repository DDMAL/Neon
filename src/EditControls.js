import EditListeners from "./EditListeners.js"

export default function EditControls (dragHandler) {
    var editListeners = new EditListeners(dragHandler);

    resetListeners();

    function resetListeners(){
        editListeners.initListeners();
    }

    EditControls.prototype.resetListeners = resetListeners; 
}
function CursorHandler () {
    function updateCursor(id) {
        var url = 'url(/img/' + id + '.png), auto';
        $("#bgimg").css('cursor', url);
        $("#mei_output").css('cursor', url);
    }

    function resetCursor() {
        $("#bgimg").css('cursor', 'default');
        $("#mei_output").css('cursor', 'default');
    }

    CursorHandler.prototype.constructor = CursorHandler;
    CursorHandler.prototype.updateCursor = updateCursor;
    CursorHandler.prototype.resetCursor = resetCursor;
}
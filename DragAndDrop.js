function dnd(elemDrag, elemDrop) {
    var DELAY_INTERVAL_MS = 100;
    var dragStartEvent;
    if (!elemDrag || !elemDrop) {
        return false;
    }

    function fireMouseEvent(type, elem, dataTransfer) {
        var evt = document.createEvent('MouseEvents');
        evt.initMouseEvent(type, true, true, window, 1, 1, 1, 0, 0, false, false, false, false, 0, elem);
        if (/^dr/i.test(type)) {
            evt.dataTransfer = dataTransfer || createNewDataTransfer();
        }

        elem.dispatchEvent(evt);
        return evt;
    }

    function createNewDataTransfer() {
        var data = {};
        return {
            clearData: function (key) {
                if (key === undefined) {
                    data = {};
                } else {
                    delete data[key];
                }
            },
            getData: function (key) {
                return data[key];
            },
            setData: function (key, value) {
                data[key] = value;
            },
            setDragImage: function () {
            },
            dropEffect: 'none',
            files: [],
            items: [],
            types: []
        }
    }

    // start dragging process
    fireMouseEvent('mousedown', elemDrag);
    dragStartEvent = fireMouseEvent('dragstart', elemDrag);

    function dragover() {
        // mouseover / mouseout etc events not necessary
        // dragenter / dragleave events not necessary either
        fireMouseEvent('dragover', elemDrop, dragStartEvent.dataTransfer);
    }

    function drop() {
        fireMouseEvent('drop', elemDrop, dragStartEvent.dataTransfer);
        fireMouseEvent('mouseup', elemDrop);
        fireMouseEvent('dragend', elemDrag);
    }

    setTimeout(dragover, DELAY_INTERVAL_MS);
    setTimeout(drop, DELAY_INTERVAL_MS * 2);
    return true;
}
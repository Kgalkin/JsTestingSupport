var selectText = function (body, iframeCssSelector, text, prefix, suffix) {
    prefix = prefix || "";
    suffix = suffix || "";

    function triggerMouseEvent(node, eventType) {
        node.dispatchEvent(new Event(eventType));
    }

    var findTargetNode = function (node, offset) {
        var totalLength = 0;
        for (var i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].nodeType !== 8) {
                if (node.childNodes[i].childNodes.length !== 0) {
                    var subNodeSearh = findTargetNode(node.childNodes[i], offset - totalLength);
                    if (subNodeSearh.target == null) {
                        totalLength += subNodeSearh.offset;
                    } else {
                        return subNodeSearh;
                    }
                }
                if ((totalLength + node.childNodes[i].length || 0) >= offset) {
                    return {
                        target: node.childNodes[i],
                        offset: offset - totalLength
                    };
                }
                totalLength += node.childNodes[i].length || 0
            }
        }
        return {
            target: null,
            offset: totalLength
        };
    };
    var contentWindow = window.parent.document.querySelector(iframeCssSelector).contentWindow;
    triggerMouseEvent(contentWindow.document, 'mousedown');
    var selection = contentWindow.getSelection();
    var range = contentWindow.document.createRange();
    var startOf = body.textContent.replace(/[\u2002\u2003\u2004\u2005\u2009\u00A0]/g, " ").search((prefix + text + suffix).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) + prefix.length;
    var startTarget = findTargetNode(body, startOf);
    var endTarget = findTargetNode(body, startOf + text.length);
    range.setStart(startTarget.target, startTarget.offset);
    range.setEnd(endTarget.target, endTarget.offset);
    selection.removeAllRanges();
    selection.addRange(range);
    triggerMouseEvent(contentWindow.document, 'mouseup');
};
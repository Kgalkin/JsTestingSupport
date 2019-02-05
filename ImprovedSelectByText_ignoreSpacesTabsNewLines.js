var selectText = function (iframeCssSelector, text, prefix, suffix) {
    prefix = prefix || "";
    suffix = suffix || "";
    var spacesTabsNewLines = new RegExp("[\u2002\u2003\u2004\u2005\u2009\u00A0\u0020\n\t]", "g");

    function findCorrectLength(strWithSpaces, lengthWithoutSpaces) {
        i = 0;
        for (j = 0; j < lengthWithoutSpaces; i++) {
            if (!strWithSpaces.charAt(i).match(spacesTabsNewLines)) {
                j++;
            }
        }
        return i;
    }

    function countNodeLength(node) {
        return node.nodeType === 3 ? node.length - (node.textContent.match(spacesTabsNewLines) || []).length : 0;
    }

    function triggerMouseEvent(node, eventType) {
        node.dispatchEvent(new Event(eventType));
    }

    var findTargetNode = function (node, offset) {
        var totalLength = 0;
        for (var i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].nodeType !== 8) {
                if (node.childNodes[i].childNodes.length !== 0) {
                    var subNodeSearch = findTargetNode(node.childNodes[i], offset - totalLength);
                    if (subNodeSearch.target == null) {
                        totalLength += subNodeSearch.offset;
                    } else {
                        return subNodeSearch;
                    }
                }
                if (totalLength + countNodeLength(node.childNodes[i]) >= offset) {
                    return {
                        target: node.childNodes[i],
                        offset: findCorrectLength(node.childNodes[i].textContent, offset - totalLength)
                    };
                }
                totalLength += countNodeLength(node.childNodes[i]);
            }
        }
        return {
            target: null,
            offset: totalLength
        };
    };
    var contentWindow = iframeCssSelector ? window.parent.document.querySelector(iframeCssSelector).contentWindow : window;
    var body = contentWindow.document.body;
    triggerMouseEvent(contentWindow.document, 'mousedown');
    var selection = contentWindow.getSelection();
    selection.removeAllRanges();
    var range = contentWindow.document.createRange();
    var startOf = body.textContent.replace(spacesTabsNewLines, "").search((prefix + text + suffix).replace(spacesTabsNewLines, "")) + prefix.replace(spacesTabsNewLines, "").length;
    var startTarget = findTargetNode(body, startOf + 1);
    var endTarget = findTargetNode(body, startOf + text.replace(spacesTabsNewLines, "").length);
    range.setStart(startTarget.target, startTarget.offset - 1);
    range.setEnd(endTarget.target, endTarget.offset);
    selection.addRange(range);
    triggerMouseEvent(contentWindow.document, 'mouseup');
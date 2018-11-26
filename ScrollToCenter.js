var scrollToCenterOfScrollableParent = function scroll(elementToScroll) {
    var isScrollable = function (element, document) {
        overflowY = window.getComputedStyle(element)['overflow-y'];
        return ((overflowY === 'scroll' || overflowY === 'auto' || (document === true && overflowY === 'visible')) && element.scrollHeight > element.clientHeight);
    };
    var findIframeOfBody = function (body) {
        var found;
        window.parent.document.querySelectorAll('iframe').forEach(function (x) {
            if ((x.contentDocument || x.contentWindow.document).body === body) {
                found = x;
            }
        });
        return found;
    };
    var element = elementToScroll;
    var offset = element.offsetTop;
    var offsetParrent = element.offsetParent;
    var overflowY = window.getComputedStyle(element)['overflow-y'];
    while (!isScrollable(element, false)) {
        offsetParrent = element.offsetParent;
        if (offsetParrent == null) {
            element = element.ownerDocument.scrollingElement;
            if (isScrollable(element, true)) {
                break;
            } else {
                element = findIframeOfBody(element.ownerDocument.body);
                if (!element) return;
                offset += element.offsetTop;
            }
        } else {
            element = element.parentElement;
            if (element === offsetParrent && !isScrollable(element)) {
                offset += element.offsetTop;
            }
        }
    }
    if (element !== offsetParrent) {
        offset = offset - element.offsetTop;
    }
    element.scrollTop = offset - element.clientHeight / 2 + elementToScroll.clientHeight / 2;
};
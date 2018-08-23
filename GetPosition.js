function getAbsolutePosition() {
    var findIframeOfBody = function (element) {
        var found;
        window.parent.document.querySelectorAll('iframe').forEach(function (x) {
            if ((x.contentDocument || x.contentWindow.document).body === body) {
                found = x;
            }
        });
        return found;
    };
    var el = element;
    var offsety = 0;
    var offsetx = 0;
    do {
        offsetx += el.offsetLeft;
        offsety += el.offsetTop;
        if (!el.offsetParent) {
            if (!el.offsetLeft) {
                offsetx += el.getBoundingClientRect().x;
            }
            if (!el.offsetTop) {
                offsety += el.getBoundingClientRect().y;
            }
        }
    } while (el = el.offsetParent || findIframeOfBody(el.ownerDocument.body));
    return {x: offsetx, y: offsety};
}
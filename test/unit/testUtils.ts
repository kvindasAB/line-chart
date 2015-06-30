var utils;

utils = angular.module("testUtils", []);

// Late friday, no better idea for a name
utils.factory("pepito", ($compile, $rootScope, fakeMouse) => ({
        directive: function(html, preDigestHook) {
            var e, elm, innerScope, outerScope;
            elm = angular.element(html);

            outerScope = $rootScope;
            $compile(elm)(outerScope);

            innerScope = elm.isolateScope();

            e = this.wrap(elm[0]);
            if (typeof preDigestHook === "function") {
                preDigestHook(e);
            }
            outerScope.$digest();

            return {
                outerScope: outerScope,
                innerScope: innerScope,
                element: e
            };
        },
        wrap: function(_domElement) {
            var that, _aElement;
            _aElement = angular.element(_domElement);
            that = this;
            return {
                domElement: _domElement,
                aElement: _aElement,
                click: () => fakeMouse.clickOn(_domElement),
                clickAndBubbleUp: () => fakeMouse.clickOn(_domElement, true),
                child: (tagName) => {
                    var elements;
                    elements = _aElement.find(tagName);

                    if (elements.length === 0) {
                        throw new Error("No element found with tag " + tagName);
                    } else if (elements.length > 1) {
                        throw new Error("More than one element found with tag name " + tagName);
                    }

                    return that.wrap(elements[0]);
                },
                children: (tagName) => {
                    if (tagName) {
                        return _aElement.find(tagName).map((e) => that.wrap(e));
                    } else {
                        return _aElement.children().map((e) => that.wrap(e));
                    }
                },
                childrenByClass: (c) => {
                    var elements;
                    elements = _domElement.getElementsByClassName(c);
                    return elements.map((e) => that.wrap(e));
                },
                childByClass: (c) => {
                    var e;
                    e = _domElement.getElementsByClassName(c);
                    if (e.length === 0) {
                        throw new Error("Element with class name " + c + " not found");
                    } else if (e.length > 1) {
                        throw new Error("More than one element found with class name " + c);
                    }

                    return that.wrap(e[0]);
                },
                isHidden: () => _aElement.hasClass("ng-hide"),
                isVisible: () => _aElement.hasClass("ng-hide") === false,
                hasClass: (c) => _aElement.hasClass(c),
                innerHTML: () => _domElement.innerHTML,
                value: () => _domElement.value,
                getStyle: (attr) => {
                    if (!attr) {
                        return _domElement.getAttribute("style");
                    }
                    return _domElement.style[attr];
                },
                getAttribute: (key) => _domElement.getAttribute(key)
            };
        }
    }));

utils.factory("fakeWindow", ($window) => {
    var e;
    e = document.createEvent("UIEvent");

    return {
        // We could add cool stuff here, e.g resize
        // to a dimension 800x400
        resize: () => {
            e.initEvent("resize", true, false);
            return $window.dispatchEvent(e);
        }
    };
});

utils.factory("fakeMouse", () => {
    var defaults;
    defaults = {
        alt: false,
        bubbles: true,
        button: 0,
        cancelable: true,
        clientX: 0,
        clientY: 0,
        ctrl: false,
        detail: 1,
        key: 0,
        meta: false,
        relatedTarget: null,
        screenX: 0,
        screenY: 0,
        shift: false,
        view: window
    };

    function eventPath(element) {
        var path, tmp;
        path = [element];
        tmp = element;
        while (tmp.parentNode) {
            tmp = tmp.parentNode;
            path.push(tmp);
        }

        // Prevents non-attached elements from firing "global" events
        if (tmp === document) {
            path.push(window);
        }

        return path;
    }

    function bubbleUp(element, type) {
        element = element.domElement || element;
        return eventPath(element).map((elm) => dispatch(elm, type));
    }

    function dispatch(element, type) {
        var event;
        element = element.domElement || element;
        event = document.createEvent("MouseEvent");
        event.initMouseEvent(type, true, true, defaults.view, defaults.detail, defaults.screenX, defaults.screenY, defaults.clientX, defaults.clientY, defaults.ctrl, defaults.alt, defaults.shift, defaults.meta, defaults.button, defaults.relatedTarget);

        element.dispatchEvent(event);
        return event;
    }

    return {
        clickOn: (element, bubbles) => {
            if (bubbles) {
                return bubbleUp(element, "click");
            } else {
                return dispatch(element, "click");
            }
        },
        hoverIn: (element) => bubbleUp(element, "mouseover"),
        hoverOut: (element) => bubbleUp(element, "mouseout"),
        mouseOver: (element) => dispatch(element, "mouseover"),
        mouseMove: (element) => dispatch(element, "mousemove")
    };
});

utils.factory("focus", () => ({
        on: (element) => {
            var event;
            event = document.createEvent("FocusEvent");
            event.initEvent("focus");
            return element.dispatchEvent(event);
        },
        off: (element) => {
            var event;
            event = document.createEvent("FocusEvent");
            event.initEvent("blur");
            return element.dispatchEvent(event);
        }
    }));

utils.factory("fakeKeyboard", () => {
    var keyboard;
    function key(keyCode, target) {
        var eventObj;
        target || (target = document);

        eventObj = document.createEventObject ? document.createEventObject() : document.createEvent("Events");

        if (eventObj.initEvent != null) {
            eventObj.initEvent("keydown", true, true);
        }

        eventObj.keyCode = keyCode;

        if (target.dispatchEvent != null) {
            target.dispatchEvent(eventObj);
        } else {
            target.fireEvent("onkeydown", eventObj);
        }

        // return keyboard to allow chaining
        return keyboard;
    }

    keyboard = {
        key: key,
        backspace: (target) => key(8, target),
        enter: (target) => key(13, target),
        escape: (target) => key(27, target),
        space: (target) => key(32, target),
        left: (target) => key(37, target),
        up: (target) => key(38, target),
        right: (target) => key(39, target),
        down: (target) => key(40, target)
    };
    return keyboard;
});

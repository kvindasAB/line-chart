describe("size", () => {
    var element, innerScope, outerScope;
    element = void 0;
    innerScope = void 0;
    outerScope = void 0;

    beforeEach(module("n3-line-chart"));
    beforeEach(module("testUtils"));

    beforeEach(inject((pepito) => {
        var _ref;
        _ref = pepito.directive("<div>\n  <linechart data='data' options='options'></linechart>\n</div>"), element = _ref.element, outerScope = _ref.outerScope;
        innerScope = element.childByClass("chart").aElement.isolateScope();
        sinon.stub(innerScope, "update", () => {});
        return sinon.spy(innerScope, "redraw");
    }));

    it("should call redraw when window is resized ", inject((pepito, fakeWindow, $timeout) => {
        var spy, _ref;
        _ref = pepito.directive("<div>\n  <linechart data='data' options='options'></linechart>\n</div>", (element) => innerScope = element.children()[0].aElement.isolateScope()), element = _ref.element, outerScope = _ref.outerScope;

        spy = sinon.spy(innerScope, "redraw");

        expect(spy.callCount).to.equal(0);

        // Trigger a resize event
        fakeWindow.resize();
        outerScope.$digest();
        $timeout.flush();

        return expect(spy.callCount).to.equal(1);
    }));

    return describe("computation method", () => {
        it("should have default size", inject((pepito, n3utils) => {
            var svgElem, _ref;
            _ref = pepito.directive("<div>\n  <linechart data='data' options='options'></linechart>\n</div>", (element) => {
                innerScope = element.children()[0].aElement.isolateScope();
                sinon.spy(innerScope, "update");
                return sinon.spy(innerScope, "redraw");
            }), element = _ref.element, outerScope = _ref.outerScope;

            svgElem = element.childByClass("chart").children()[0].domElement;
            expect(svgElem.width.baseVal.value).to.equal(900);
            return expect(svgElem.height.baseVal.value).to.equal(500);
        }));

        it("should consider forced dimensions", inject((pepito, n3utils) => {
            var svgElem, _ref;
            _ref = pepito.directive("<div id=\"toto\">\n  <linechart width=\"234\" height=\"556\" data='data' options='options'></linechart>\n</div>", (element) => {
                innerScope = element.children()[0].aElement.isolateScope();
                sinon.spy(innerScope, "update");
                sinon.spy(innerScope, "redraw");

                return sinon.stub(n3utils, "getPixelCssProp", (element, property) => {
                    if (element.id !== "toto") {
                        throw new Error("Invalid id given to getPixelCssProp function");
                    }
                    if (["padding-top", "padding-bottom", "padding-left", "padding-right"].indexOf(property) === -1) {
                        throw new Error("Invalid property given to getPixelCssProp function");
                    }
                    return {
                        "padding-top": 50,
                        "padding-bottom": 10,
                        "padding-left": 20,
                        "padding-right": 40
                    }[property];
                });
            }), element = _ref.element, outerScope = _ref.outerScope;

            outerScope.$digest();

            svgElem = element.childByClass("chart").children()[0].domElement;
            expect(svgElem.width.baseVal.value).to.equal(174);
            return expect(svgElem.height.baseVal.value).to.equal(496);
        }));

        return it("should detect parent's top padding", inject((pepito, n3utils) => {
            var svgElem, _ref;
            _ref = pepito.directive("<div id=\"toto\">\n  <linechart data='data' options='options'></linechart>\n</div>", (element) => {
                innerScope = element.children()[0].aElement.isolateScope();
                sinon.spy(innerScope, "update");
                sinon.spy(innerScope, "redraw");

                return sinon.stub(n3utils, "getPixelCssProp", (element, property) => {
                    if (element.id !== "toto") {
                        throw new Error("Invalid id given to getPixelCssProp function");
                    }
                    if (["padding-top", "padding-bottom", "padding-left", "padding-right"].indexOf(property) === -1) {
                        throw new Error("Invalid property given to getPixelCssProp function");
                    }
                    return {
                        "padding-top": 50,
                        "padding-bottom": 10,
                        "padding-left": 20,
                        "padding-right": 40
                    }[property];
                });
            }), element = _ref.element, outerScope = _ref.outerScope;

            outerScope.$digest();

            svgElem = element.childByClass("chart").children()[0].domElement;
            expect(svgElem.width.baseVal.value).to.equal(840);
            return expect(svgElem.height.baseVal.value).to.equal(440);
        }));
    });
});

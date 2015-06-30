describe("event handling", () => {
    beforeEach(module("n3-line-chart"));
    beforeEach(module("testUtils"));

    describe("utils", () => {
        var n3utils;
        n3utils = void 0;

        beforeEach(inject((_n3utils_) => n3utils = _n3utils_));

        return it("should create a dispatcher with event attrs", () => {
            var dispatch;
            dispatch = n3utils.getEventDispatcher();

            expect(dispatch).to.have.property("focus");
            expect(dispatch).to.have.property("hover");
            expect(dispatch).to.have.property("click");
            return expect(dispatch).to.have.property("toggle");
        });
    });

    return describe("rendering", () => {
        var element, fakeMouse, flushD3, innerScope, outerScope;
        element = void 0;
        innerScope = void 0;
        outerScope = void 0;

        fakeMouse = void 0;

        flushD3 = void 0;

        beforeEach(inject((n3utils, _fakeMouse_) => {
            function flushD3() {
                var now;
                now = Date.now;
                Date.now = () => Infinity;
                d3.timer.flush();
                return Date.now = now;
            }

            fakeMouse = _fakeMouse_;

            sinon.stub(n3utils, "getDefaultMargins", () => ({
                    top: 20,
                    right: 50,
                    bottom: 30,
                    left: 50
                }));

            return sinon.stub(n3utils, "getTextBBox", () => ({
                    width: 30
                }));
        }));

        beforeEach(inject((pepito) => {
            var _ref;
            return _ref = pepito.directive("<div>\n  <linechart\n    data='data'\n    options='options'\n    on-click='clicked'\n    on-hover='hovered'\n    on-focus='focused'\n    on-toggle='toggled'\n  ></linechart>\n</div>"), element = _ref.element, innerScope = _ref.innerScope, outerScope = _ref.outerScope, _ref;
        }));

        beforeEach(() => {
            outerScope.$apply(() => {
                outerScope.data = [
                    {
                        x: 0,
                        value: 4
                    }, {
                        x: 1,
                        value: 8
                    }, {
                        x: 2,
                        value: 15
                    }, {
                        x: 3,
                        value: 16
                    }, {
                        x: 4,
                        value: 23
                    }, {
                        x: 5,
                        value: 42
                    }
                ];
                return outerScope.options = {
                    series: [
                        {
                            y: "value",
                            color: "#4682b4"  //4682b4'
                        }, {
                            y: "x",
                            axis: "y2",
                            type: "column",
                            color: "#4682b4"  //4682b4'
                        }
                    ],
                    tooltip: {
                        mode: "axes",
                        interpolate: false
                    }
                };
            });

            return sinon.stub(d3, "mouse", () => [0, 0]);
        });

        afterEach(() => d3.mouse.restore());

        it("should dispatch a click event when clicked on a dot", () => {
            var clicked, dotGroup;
            clicked = void 0;

            outerScope.$apply(() => {
                outerScope.options = {
                    series: [
                        {
                            y: "value",
                            color: "#4682b4"  //4682b4'}
                        }, {
                            y: "value",
                            axis: "y2",
                            type: "column",
                            color: "#4682b4"  //4682b4'}
                        }
                    ],
                    tooltip: {
                        mode: "axes"
                    }
                };
                return outerScope.clicked = (d, i) => clicked = [d, i];
            });

            dotGroup = element.childByClass("dotGroup");

            dotGroup.children()[0].click();
            expect(clicked[0].x).to.equal(0);
            expect(clicked[0].y).to.equal(4);
            expect(clicked[1]).to.equal(0);

            dotGroup.children()[1].click();
            expect(clicked[0].x).to.equal(1);
            expect(clicked[0].y).to.equal(8);
            return expect(clicked[1]).to.equal(1);
        });

        it("should dispatch a click event when clicked on a column", () => {
            var clicked, columnGroup;
            clicked = void 0;

            outerScope.$apply(() => {
                outerScope.options = {
                    series: [
                        {
                            y: "value",
                            color: "#4682b4"  //4682b4'}
                        }, {
                            y: "value",
                            axis: "y2",
                            type: "column",
                            color: "#4682b4"  //4682b4'}
                        }
                    ],
                    tooltip: {
                        mode: "axes"
                    }
                };
                return outerScope.clicked = (d, i) => clicked = [d, i];
            });

            columnGroup = element.childByClass("columnGroup");

            columnGroup.children()[0].click();
            expect(clicked[0].x).to.equal(0);
            expect(clicked[0].y).to.equal(4);
            expect(clicked[1]).to.equal(0);

            columnGroup.children()[1].click();
            expect(clicked[0].x).to.equal(1);
            expect(clicked[0].y).to.equal(8);
            return expect(clicked[1]).to.equal(1);
        });

        it("should dispatch a hover event when hovering over a dot", () => {
            var dotGroup, hovered;
            hovered = void 0;

            outerScope.$apply(() => {
                outerScope.options = {
                    series: [
                        {
                            y: "value",
                            color: "#4682b4"  //4682b4'}
                        }, {
                            y: "value",
                            axis: "y2",
                            type: "column",
                            color: "#4682b4"  //4682b4'}
                        }
                    ],
                    tooltip: {
                        mode: "axes"
                    }
                };
                return outerScope.hovered = (d, i) => hovered = [d, i];
            });

            dotGroup = element.childByClass("dotGroup");

            fakeMouse.hoverIn(dotGroup.children()[0].domElement);
            expect(hovered[0].x).to.equal(0);
            expect(hovered[0].y).to.equal(4);
            expect(hovered[1]).to.equal(0);

            fakeMouse.hoverIn(dotGroup.children()[1].domElement);
            expect(hovered[0].x).to.equal(1);
            expect(hovered[0].y).to.equal(8);
            return expect(hovered[1]).to.equal(1);
        });

        it("should dispatch a hover event when hovering over a column", () => {
            var columnGroup, hovered;
            hovered = void 0;

            outerScope.$apply(() => {
                outerScope.options = {
                    series: [
                        {
                            y: "value",
                            color: "#4682b4"  //4682b4'}
                        }, {
                            y: "value",
                            axis: "y2",
                            type: "column",
                            color: "#4682b4"  //4682b4'}
                        }
                    ],
                    tooltip: {
                        mode: "axes"
                    }
                };
                return outerScope.hovered = (d, i) => hovered = [d, i];
            });

            columnGroup = element.childByClass("columnGroup");

            fakeMouse.hoverIn(columnGroup.children()[0].domElement);
            expect(hovered[0].x).to.equal(0);
            expect(hovered[0].y).to.equal(4);
            expect(hovered[1]).to.equal(0);

            fakeMouse.hoverIn(columnGroup.children()[1].domElement);
            expect(hovered[0].x).to.equal(1);
            expect(hovered[0].y).to.equal(8);
            return expect(hovered[1]).to.equal(1);
        });

        it("should dispatch a focus event when scrubber is displayed", () => {
            var focused, glass;
            focused = [];

            outerScope.$apply(() => {
                outerScope.options = {
                    series: [
                        {
                            y: "value",
                            color: "#4682b4"  //4682b4'}
                        }, {
                            y: "value",
                            axis: "y2",
                            type: "column",
                            color: "#4682b4"  //4682b4'}
                        }
                    ],
                    tooltip: {
                        mode: "scrubber"
                    }
                };
                return outerScope.focused = (d, i) => focused.push([d, i]);
            });

            glass = element.childByClass("glass");

            fakeMouse.hoverIn(glass);
            fakeMouse.mouseMove(glass);
            flushD3();

            expect(focused[0][0].x).to.equal(focused[1][0].x);
            return expect(focused[0][1]).to.equal(focused[0][1]);
        });

        return it("should dispatch a toggle event when clicked on a legend", () => {
            var clicked, firstLegendItem, secondLegendItem;
            clicked = void 0;

            outerScope.$apply(() => {
                outerScope.options = {
                    series: [
                        {
                            y: "value",
                            color: "#4682b4"  //4682b4'}
                        }, {
                            y: "value",
                            axis: "y2",
                            type: "column",
                            color: "#4682b4",  //4682b4', visible: false}
                            visible: false
                        }
                    ],
                    tooltip: {
                        mode: "axes"
                    }
                };
                return outerScope.toggled = (d, i, visibility) => clicked = [d, i, visibility];
            });

            firstLegendItem = element.childrenByClass("legendItem")[0];
            secondLegendItem = element.childrenByClass("legendItem")[1];

            firstLegendItem.click();
            expect(clicked[1]).to.equal(0);
            expect(clicked[2]).to.equal(false);

            firstLegendItem.click();
            expect(clicked[1]).to.equal(0);
            expect(clicked[2]).to.equal(true);

            secondLegendItem.click();
            expect(clicked[1]).to.equal(1);
            return expect(clicked[2]).to.equal(true);
        });
    });
});

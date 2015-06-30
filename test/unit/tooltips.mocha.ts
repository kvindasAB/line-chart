describe("tooltip", () => {
    var checkVisibilityOf, element, fakeMouse, flushD3, innerScope, outerScope;
    element = void 0;
    innerScope = void 0;
    outerScope = void 0;

    fakeMouse = void 0;

    flushD3 = void 0;
    checkVisibilityOf = void 0;

    beforeEach(module("n3-line-chart"));
    beforeEach(module("testUtils"));

    beforeEach(inject((n3utils, _fakeMouse_) => {
        function flushD3() {
            var now;
            now = Date.now;
            Date.now = () => Infinity;
            d3.timer.flush();
            return Date.now = now;
        }

        sinon.stub(n3utils, "getTextBBox", () => ({
                width: 30
            }));

        function checkVisibilityOf(args) {
            flushD3();
            args.forEach((axis) => expect(element.childByClass(axis + "Tooltip").getAttribute("opacity")).to.equal("1"));

            return ["x", "y", "y2"].forEach((axis) => {
                if (args.indexOf(axis) === -1) {
                    return expect(element.childByClass(axis + "Tooltip").getAttribute("opacity")).to.equal("0");
                }
            });
        }

        fakeMouse = _fakeMouse_;

        return sinon.stub(n3utils, "getDefaultMargins", () => ({
                top: 20,
                right: 50,
                bottom: 30,
                left: 50
            }));
    }));

    beforeEach(inject((pepito) => {
        var _ref;
        return _ref = pepito.directive("<div>\n  <linechart data='data' options='options'></linechart>\n</div>"), element = _ref.element, innerScope = _ref.innerScope, outerScope = _ref.outerScope, _ref;
    }));

    beforeEach(() => outerScope.$apply(() => {
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
                axes: {},
                series: [
                    {
                        y: "value",
                        color: "#4682b4"  //4682b4'
                    }, {
                        y: "value",
                        axis: "y2",
                        type: "column",
                        color: "#4682b4"  //4682b4'
                    }
                ],
                tooltip: {
                    mode: "axes",
                    interpolate: true
                }
            };
        }));

    it("should show/hide the tooltip when hovering/leaving a left axis dot", () => {
        var leftAxisDotGroup;
        leftAxisDotGroup = element.childByClass("dotGroup series_0");

        checkVisibilityOf([]);

        fakeMouse.hoverIn(leftAxisDotGroup.domElement);
        checkVisibilityOf(["x", "y"]);

        fakeMouse.hoverOut(leftAxisDotGroup.domElement);
        return checkVisibilityOf([]);
    });

    it("should show/hide the tooltip when moving over/leaving a line", () => {
        var content, lineGroup, linePath;
        content = element.childByClass("content");
        linePath = content.childByClass("line");
        lineGroup = content.childByClass("lineGroup");

        checkVisibilityOf([]);
        fakeMouse.mouseMove(lineGroup.domElement);
        checkVisibilityOf(["x", "y"]);

        fakeMouse.hoverOut(linePath.domElement);
        return checkVisibilityOf([]);
    });

    it("should format the tooltip when a formatter function is defined", () => {
        var firstDot, leftAxisDotGroup;
        leftAxisDotGroup = element.childByClass("dotGroup series_0");
        firstDot = leftAxisDotGroup.children()[0];

        // Hover over the first dot
        fakeMouse.mouseOver(firstDot);
        flushD3();

        // Check tooltips without formatter
        expect(element.childByClass("xTooltip").children()[1].innerHTML()).to.equal("0");
        expect(element.childByClass("yTooltip").children()[1].innerHTML()).to.equal("4");

        outerScope.$apply(() => {
            // Now apply the formatter function
            var formatter;
            formatter = d3.format(".4f");
            outerScope.options.axes.x.tooltipFormatter = formatter;
            return outerScope.options.axes.y.tooltipFormatter = formatter;
        });

        // Hover over the first dot
        fakeMouse.mouseOver(firstDot);
        flushD3();

        // Check tooltips with formatter
        expect(element.childByClass("xTooltip").children()[1].innerHTML()).to.equal("0.0000");
        return expect(element.childByClass("yTooltip").children()[1].innerHTML()).to.equal("4.0000");
    });

    it("should color the tooltips with a string value", () => {
        var firstDot, leftAxisDotGroup;
        leftAxisDotGroup = element.childByClass("dotGroup series_0");
        firstDot = leftAxisDotGroup.children()[0];

        // Hover over the first col
        fakeMouse.hoverIn(firstDot);
        fakeMouse.mouseOver(firstDot);
        flushD3();

        // Check tooltip color without formatter
        expect(element.childByClass("xTooltip").children()[0].getStyle("fill")).to.match(/(rgb\(70, 130, 180\))|(#4682b4)/);  //4682b4)/)
        return expect(element.childByClass("yTooltip").children()[0].getStyle("fill")).to.match(/(rgb\(70, 130, 180\))|(#4682b4)/);  //4682b4)/)
    });

    it("should color the tooltips with a conditional function", () => {
        var colGroup, firstCol, secondCol;
        outerScope.$apply(() => {
            outerScope.data = [
                {
                    x: 0,
                    value: 5
                }, {
                    x: 1,
                    value: 10
                }
            ];
            return outerScope.options = {
                tooltip: {
                    mode: "axes"
                },
                series: [
                    {
                        y: "value",
                        color: (d, i) => {
                            if ((d != null ? d.y : void 0) > 5) {
                                return "green";
                            } else {
                                return "red";
                            }
                        },
                        type: "column"
                    }
                ]
            };
        });

        colGroup = element.childByClass("columnGroup series_0");
        firstCol = colGroup.children()[0];
        secondCol = colGroup.children()[1];

        // Hover over the first col
        fakeMouse.hoverIn(firstCol);
        fakeMouse.mouseOver(firstCol);
        flushD3();

        // Check tooltip color, should be red
        expect(element.childByClass("xTooltip").children()[0].getStyle("fill")).to.match(/(rgb\(255, 0, 0\))|(red)/);
        expect(element.childByClass("yTooltip").children()[0].getStyle("fill")).to.match(/(rgb\(255, 0, 0\))|(red)/);

        // Hover over the second col
        fakeMouse.hoverIn(secondCol);
        fakeMouse.mouseOver(secondCol);
        flushD3();

        // Check tooltip color, should be green now
        expect(element.childByClass("xTooltip").children()[0].getStyle("fill")).to.match(/(rgb\(0, 128, 0\))|(green)/);
        return expect(element.childByClass("yTooltip").children()[0].getStyle("fill")).to.match(/(rgb\(0, 128, 0\))|(green)/);
    });

    describe("scrubber mode", () => {
        beforeEach(() => outerScope.$apply(() => outerScope.options = {
                    series: [
                        {
                            y: "value",
                            color: "#4682b4"  //4682b4'
                        }, {
                            y: "value",
                            axis: "y2",
                            color: "#4682b4",  //4682b4'
                            type: "column"
                        }
                    ],
                    tooltip: {
                        mode: "scrubber",
                        interpolate: false
                    }
                }));

        it("should create a glass", () => expect(element.childByClass("glass")).not.to.equal(void 0));

        return it("should change the legend on mouse over", inject((fakeMouse) => {
            var glass;
            glass = element.childByClass("glass");

            return fakeMouse.hoverIn(glass.domElement);
        }));
    });

    it("should compute the closest abscissa", inject((n3utils) => {
        var v;
        v = n3utils.getClosestPoint([
            {
                x: 0
            }, {
                x: 1
            }, {
                x: 2
            }, {
                x: 4
            }, {
                x: 5
            }
        ], 3.1);

        return expect(v).to.eql({
            x: 4
        });
    }));

    return it("should show/hide the tooltip when hovering/leaving a right axis column", () => {
        var rightAxisColumnGroup;
        rightAxisColumnGroup = element.childByClass("columnGroup series_1");

        checkVisibilityOf([]);

        fakeMouse.hoverIn(rightAxisColumnGroup.children()[0]);
        checkVisibilityOf(["x", "y2"]);

        fakeMouse.hoverOut(rightAxisColumnGroup.children()[0]);
        return checkVisibilityOf([]);
    });
});

describe("scrubber tooltip", () => {
    beforeEach(module("n3-line-chart"));
    beforeEach(module("testUtils"));

    describe("utils", () => {
        var n3utils;
        n3utils = void 0;

        beforeEach(inject((_n3utils_) => n3utils = _n3utils_));

        it("should offset two tooltips that overlap", () => {
            var positions;
            positions = [
                {
                    x: 120,
                    y: 410,
                    side: "left"
                }, {
                    x: 120,
                    y: 410,
                    side: "left"
                }
            ];

            n3utils.preventOverlapping(positions);

            return expect(positions).to.eql([
                {
                    x: 120,
                    y: 410,
                    side: "left",
                    labelOffset: 10
                }, {
                    x: 120,
                    y: 410,
                    side: "left",
                    labelOffset: -10
                }
            ]);
        });

        return it("should offset three tooltips that overlap", () => {
            var positions;
            positions = [
                {
                    x: 120,
                    y: 410,
                    side: "right"
                }, {
                    x: 120,
                    y: 410,
                    side: "right"
                }, {
                    x: 120,
                    y: 410,
                    side: "right"
                }
            ];

            n3utils.preventOverlapping(positions);

            return expect(positions).to.eql([
                {
                    x: 120,
                    y: 410,
                    side: "right",
                    labelOffset: 20
                }, {
                    x: 120,
                    y: 410,
                    side: "right",
                    labelOffset: 0
                }, {
                    x: 120,
                    y: 410,
                    side: "right",
                    labelOffset: -20
                }
            ]);
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
            return _ref = pepito.directive("<div>\n  <linechart data='data' options='options'></linechart>\n</div>"), element = _ref.element, innerScope = _ref.innerScope, outerScope = _ref.outerScope, _ref;
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
                        mode: "scrubber",
                        interpolate: false
                    }
                };
            });

            return sinon.stub(d3, "mouse", () => [0, 0]);
        });

        afterEach(() => d3.mouse.restore());

        it("should create one tooltip per series", () => {
            var tooltips;
            tooltips = element.childrenByClass("scrubberItem");
            return expect(tooltips.length).to.equal(2);
        });

        it("should show tooltips", () => {
            var glass, tooltips;
            glass = element.childByClass("glass");

            fakeMouse.hoverIn(glass);
            fakeMouse.mouseMove(glass);
            flushD3();
            expect(d3.mouse.callCount).to.equal(1);

            tooltips = element.childrenByClass("scrubberText");

            expect(tooltips[0].innerHTML()).to.equal("0 : 4");
            expect(tooltips[1].innerHTML()).to.equal("0 : 4");

            expect(tooltips[2].innerHTML()).to.equal("0 : 0");
            return expect(tooltips[3].innerHTML()).to.equal("0 : 0");
        });

        it("should not show tooltips for invisble series", () => {
            var glass, tooltips;
            outerScope.$apply(() => outerScope.options = {
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
                        mode: "scrubber"
                    }
                });

            glass = element.childByClass("glass");

            fakeMouse.hoverIn(glass);
            fakeMouse.mouseMove(glass);
            flushD3();

            tooltips = element.childrenByClass("scrubberItem");

            expect(tooltips[0].getAttribute("opacity")).to.equal("1");
            return expect(tooltips[1].getAttribute("opacity")).to.equal("0");
        });

        return it("should show tooltips with custom tooltip function", () => {
            var cb, glass, tooltips;
            cb = sinon.spy((x, y, series) => "pouet");

            outerScope.$apply(() => outerScope.options = {
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
                        mode: "scrubber",
                        interpolate: false,
                        formatter: cb
                    }
                });

            glass = element.childByClass("glass");

            fakeMouse.hoverIn(glass);
            fakeMouse.mouseMove(glass);
            flushD3();
            expect(d3.mouse.callCount).to.equal(1);

            tooltips = element.childrenByClass("scrubberText");

            expect(tooltips[0].innerHTML()).to.equal("pouet");
            expect(tooltips[1].innerHTML()).to.equal("pouet");
            expect(tooltips[2].innerHTML()).to.equal("pouet");
            expect(tooltips[3].innerHTML()).to.equal("pouet");

            expect(cb.args[0]).to.eql([0, 4, outerScope.options.series[0]]);
            return expect(cb.args[1]).to.eql([0, 4, outerScope.options.series[1]]);
        });
    });
});

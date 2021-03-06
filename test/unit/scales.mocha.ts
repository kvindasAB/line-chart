describe("scales", () => {
    var element, innerScope, n3utils, outerScope;
    n3utils = void 0;
    element = void 0;
    innerScope = void 0;
    outerScope = void 0;

    beforeEach(module("n3-line-chart"));
    beforeEach(module("testUtils"));

    beforeEach(inject((_n3utils_) => {
        n3utils = _n3utils_;
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

    describe("unit functions", () => {
        describe("getAverageStep", () => it("should return 0 if only one datum", () => expect(n3utils.getAverageStep([
                    {
                        x: 1
                    }
                ], "x")).to.equal(0)));

        describe("xExtent", () => it("should work even with one datum", () => {
                expect(n3utils.xExtent([
                    {
                        x: 1
                    }
                ], "x")).to.eql([0, 2]);
                return expect(n3utils.xExtent([
                    {
                        x: -1
                    }
                ], "x")).to.eql([-2, 0]);
            }));

        return describe("yExtent", () => {
            it("should work even with one datum", () => {
                expect(n3utils.yExtent([
                    {
                        y: "val"
                    }
                ], [
                    {
                        val: 0.6
                    }
                ], [])).to.eql([0, 1.2]);
                return expect(n3utils.yExtent([
                    {
                        y: "val"
                    }
                ], [
                    {
                        val: -0.6
                    }
                ], [])).to.eql([-1.2, 0]);
            });

            return it("should work with stacks", () => {
                var data, series;
                series = [
                    {
                        y: "val_0",
                        id: "id0"
                    }, {
                        y: "val_1",
                        id: "id1"
                    }
                ];

                data = [
                    {
                        val_0: 1,
                        val_1: 2
                    }, {
                        val_0: 1,
                        val_1: 20
                    }
                ];

                return expect(n3utils.yExtent(series, data, [
                    {
                        series: ["id0", "id1"]
                    }
                ])).to.eql([1, 21]);
            });
        });
    });

    describe("tick count", () => {
        beforeEach(() => outerScope.$apply(() => {
                outerScope.data = [
                    {
                        x: 0,
                        value: 4
                    }, {
                        x: 1,
                        value: 8
                    }
                ];
                return outerScope.options = {
                    axes: {
                        x: {
                            ticks: 2
                        },
                        y: {
                            ticks: 3
                        }
                    },
                    series: [
                        {
                            y: "value",
                            color: "#4682b4",  //4682b4', label: 'toto'}
                            label: "toto"
                        }, {
                            y: "value",
                            axis: "y2",
                            color: "#4682b4",  //4682b4', type: 'column'}
                            type: "column"
                        }
                    ]
                };
            }));

        it("should work for vertical axes", () => {
            var computedYTicks, yticks;
            yticks = element.childByClass("y axis").children("text");
            computedYTicks = yticks.map((t) => t.domElement.textContent);

            return expect(computedYTicks).to.eql(["4", "6", "8"]);
        });

        return it("should work for horizontal axis", () => {
            var computedXTicks, xticks;
            xticks = element.childByClass("x axis").children("text");
            computedXTicks = xticks.map((t) => t.domElement.textContent);
            return expect(computedXTicks).to.eql(["0", "2"]);
        });
    });

    describe("tick values", () => {
        beforeEach(() => outerScope.$apply(() => {
                outerScope.data = [
                    {
                        x: 0,
                        value: 4
                    }, {
                        x: 1,
                        value: 8
                    }
                ];
                return outerScope.options = {
                    axes: {
                        x: {
                            ticks: [-1, 0, 1]
                        },
                        y: {
                            ticks: [1, 2, 3]
                        }
                    },
                    series: [
                        {
                            y: "value",
                            color: "#4682b4",  //4682b4', label: 'toto'}
                            label: "toto"
                        }, {
                            y: "value",
                            axis: "y2",
                            color: "#4682b4",  //4682b4', type: 'column'}
                            type: "column"
                        }
                    ]
                };
            }));

        it("should work for horizontal axis", () => {
            var computedXTicks, xticks;
            xticks = element.childByClass("x axis").children("text");
            computedXTicks = xticks.map((t) => t.domElement.textContent);

            return expect(computedXTicks).to.eql(["-1.0", "0.0", "1.0"]);
        });

        it("should work for vertical axes", () => {
            var computedYTicks, yticks;
            yticks = element.childByClass("y axis").children("text");
            computedYTicks = yticks.map((t) => t.domElement.textContent);

            return expect(computedYTicks).to.eql(["1.0", "2.0", "3.0"]);
        });

        it("should add rotation if ticksRotate is defined", () => {
            var xticks, y2ticks, yticks;
            xticks = element.childByClass("x axis").children("text");
            yticks = element.childByClass("y axis").children("text");
            y2ticks = element.childByClass("y2 axis").children("text");

            expect(xticks[xticks.length - 1].getAttribute("transform")).to.equal(null);
            expect(yticks[yticks.length - 1].getAttribute("transform")).to.equal(null);
            expect(y2ticks[y2ticks.length - 1].getAttribute("transform")).to.equal(null);

            outerScope.$apply(() => {
                outerScope.options.axes.x.ticksRotate = 45;
                outerScope.options.axes.y.ticksRotate = -45;
                return outerScope.options.axes.y2.ticksRotate = 15.5;
            });

            xticks = element.childByClass("x axis").children("text");
            yticks = element.childByClass("y axis").children("text");
            y2ticks = element.childByClass("y2 axis").children("text");

            expect(xticks[xticks.length - 1].getAttribute("transform")).to.match(/rotate\(45( [\-0-9]+,[\-0-9]+){0,1}\)$/);
            expect(yticks[yticks.length - 1].getAttribute("transform")).to.match(/rotate\(-45( [\-0-9]+,[\-0-9]+){0,1}\)$/);
            return expect(y2ticks[y2ticks.length - 1].getAttribute("transform")).to.match(/rotate\(15.5( [\-0-9]+,[\-0-9]+){0,1}\)$/);
        });

        it("should rotate ticks label around the ticks center if ticksRotate is defined", () => {
            var xticks, y2ticks, yticks;
            outerScope.$apply(() => {
                outerScope.options.axes.x.ticksRotate = 45;
                outerScope.options.axes.y.ticksRotate = -45;
                return outerScope.options.axes.y2.ticksRotate = 15.5;
            });

            xticks = element.childByClass("x axis").children("text");
            yticks = element.childByClass("y axis").children("text");
            y2ticks = element.childByClass("y2 axis").children("text");

            expect(xticks[xticks.length - 1].getAttribute("transform")).to.match(/rotate\([\-0-9.]+ 0,6\)$/);
            expect(yticks[yticks.length - 1].getAttribute("transform")).to.match(/rotate\([\-0-9.]+ -6,0\)$/);
            return expect(y2ticks[y2ticks.length - 1].getAttribute("transform")).to.match(/rotate\([\-0-9.]+ 6,0\)$/);
        });

        it("should align ticks if ticksRotate is defined", () => {
            var xticks, y2ticks, yticks;
            xticks = element.childByClass("x axis").children("text");
            yticks = element.childByClass("y axis").children("text");
            y2ticks = element.childByClass("y2 axis").children("text");

            expect(xticks[xticks.length - 1].getAttribute("dy")).to.equal(".71em");
            expect(yticks[yticks.length - 1].getAttribute("dy")).to.equal(".32em");
            expect(y2ticks[y2ticks.length - 1].getAttribute("dy")).to.equal(".32em");

            outerScope.$apply(() => {
                outerScope.options.axes.x.ticksRotate = 45;
                outerScope.options.axes.y.ticksRotate = -45;
                return outerScope.options.axes.y2.ticksRotate = 15.5;
            });

            xticks = element.childByClass("x axis").children("text");
            yticks = element.childByClass("y axis").children("text");
            y2ticks = element.childByClass("y2 axis").children("text");

            expect(xticks[xticks.length - 1].getAttribute("dy")).to.equal(null);
            expect(yticks[yticks.length - 1].getAttribute("dy")).to.equal(".32em");
            expect(y2ticks[y2ticks.length - 1].getAttribute("dy")).to.equal(".32em");
            expect(xticks[xticks.length - 1].getAttribute("transform")).to.match(/^translate\(0,5\)( ){0,1}rotate(.*)/);
            expect(yticks[yticks.length - 1].getAttribute("transform")).to.match(/^rotate(.*)$/);
            return expect(y2ticks[y2ticks.length - 1].getAttribute("transform")).to.match(/^rotate(.*)$/);
        });

        it("should set text-anchor for x-axis properly if ticksRotate is defined", () => {
            var xticks;
            outerScope.$apply(() => outerScope.options.axes.x.ticksRotate = void 0);

            xticks = element.childByClass("x axis").children("text");
            expect(xticks[xticks.length - 1].getStyle("text-anchor")).to.equal("middle");

            outerScope.$apply(() => outerScope.options.axes.x.ticksRotate = 0);

            xticks = element.childByClass("x axis").children("text");
            expect(xticks[xticks.length - 1].getStyle("text-anchor")).to.equal("start");

            outerScope.$apply(() => outerScope.options.axes.x.ticksRotate = 45);

            xticks = element.childByClass("x axis").children("text");
            expect(xticks[xticks.length - 1].getStyle("text-anchor")).to.equal("start");

            outerScope.$apply(() => outerScope.options.axes.x.ticksRotate = -45);

            xticks = element.childByClass("x axis").children("text");
            return expect(xticks[xticks.length - 1].getStyle("text-anchor")).to.equal("end");
        });

        it("should set text-anchor for y-axis properly if ticksRotate is defined", () => {
            var yticks;
            outerScope.$apply(() => outerScope.options.axes.y.ticksRotate = void 0);

            yticks = element.childByClass("y axis").children("text");
            expect(yticks[yticks.length - 1].getStyle("text-anchor")).to.equal("end");

            outerScope.$apply(() => outerScope.options.axes.y.ticksRotate = 0);

            yticks = element.childByClass("y axis").children("text");
            expect(yticks[yticks.length - 1].getStyle("text-anchor")).to.equal("end");

            outerScope.$apply(() => outerScope.options.axes.y.ticksRotate = 45);

            yticks = element.childByClass("y axis").children("text");
            expect(yticks[yticks.length - 1].getStyle("text-anchor")).to.equal("end");

            outerScope.$apply(() => outerScope.options.axes.y.ticksRotate = -45);

            yticks = element.childByClass("y axis").children("text");
            return expect(yticks[yticks.length - 1].getStyle("text-anchor")).to.equal("end");
        });

        return it("should set text-anchor for y2-axis properly if ticksRotate is defined", () => {
            var y2ticks;
            outerScope.$apply(() => outerScope.options.axes.y2.ticksRotate = void 0);

            y2ticks = element.childByClass("y2 axis").children("text");
            expect(y2ticks[y2ticks.length - 1].getStyle("text-anchor")).to.equal("start");

            outerScope.$apply(() => outerScope.options.axes.y2.ticksRotate = 0);

            y2ticks = element.childByClass("y2 axis").children("text");
            expect(y2ticks[y2ticks.length - 1].getStyle("text-anchor")).to.equal("start");

            outerScope.$apply(() => outerScope.options.axes.y2.ticksRotate = 45);

            y2ticks = element.childByClass("y2 axis").children("text");
            expect(y2ticks[y2ticks.length - 1].getStyle("text-anchor")).to.equal("start");

            outerScope.$apply(() => outerScope.options.axes.y2.ticksRotate = -45);

            y2ticks = element.childByClass("y2 axis").children("text");
            return expect(y2ticks[y2ticks.length - 1].getStyle("text-anchor")).to.equal("start");
        });
    });

    describe("min and max", () => {
        beforeEach(() => outerScope.$apply(() => {
                outerScope.data = [
                    {
                        x: 0,
                        value: 4
                    }, {
                        x: 1,
                        value: 8
                    }
                ];
                return outerScope.options = {
                    axes: {
                        x: {
                            min: -5,
                            max: 6
                        },
                        y: {
                            min: 5,
                            max: 6
                        }
                    },
                    series: [
                        {
                            y: "value",
                            color: "#4682b4",  //4682b4', label: 'toto'}
                            label: "toto"
                        }, {
                            y: "value",
                            axis: "y2",
                            color: "#4682b4",  //4682b4', type: 'column'}
                            type: "column"
                        }
                    ]
                };
            }));

        it("should work for horizontal axis", () => {
            var computedXTicks, xticks;
            xticks = element.childByClass("x axis").children("text");
            computedXTicks = xticks.map((t) => t.domElement.textContent);

            // for some reason this is not sorted...
            return expect(computedXTicks).to.eql(["-5", "-4", "-3", "-2", "-1", "0", "1", "2", "3", "4", "5", "6"]);
        });

        return it("should work for vertical axes", () => {
            var computedYTicks, yticks;
            yticks = element.childByClass("y axis").children("text");
            computedYTicks = yticks.map((t) => t.domElement.textContent);
            return expect(computedYTicks).to.eql(["5.0", "5.1", "5.2", "5.3", "5.4", "5.5", "5.6", "5.7", "5.8", "5.9", "6.0"]);
        });
    });

    return describe("logarithmic y axes", () => {
        beforeEach(() => outerScope.$apply(() => {
                outerScope.data = [
                    {
                        x: 0,
                        value: 4
                    }, {
                        x: 1,
                        value: 8
                    }
                ];
                return outerScope.options = {
                    axes: {
                        y: {
                            type: "log"
                        }
                    },
                    series: [
                        {
                            y: "value",
                            color: "#4682b4",  //4682b4', label: 'toto'}
                            label: "toto"
                        }, {
                            y: "value",
                            axis: "y2",
                            color: "#4682b4",  //4682b4', type: 'column'}
                            type: "column"
                        }
                    ]
                };
            }));

        it("should prevent log(0) from happening", () => {
            var computedY2Ticks, computedYTicks, expectedTicks, y2ticks, yticks;
            outerScope.$apply(() => {
                outerScope.data = [
                    {
                        x: 0,
                        value: 0
                    }, {
                        x: 1,
                        value: 80000
                    }, {
                        x: 2,
                        value: 100000
                    }, {
                        x: 3,
                        value: 30000
                    }
                ];
                return outerScope.options = {
                    axes: {
                        y: {
                            type: "log"
                        },
                        y2: {
                            type: "log"
                        }
                    },
                    series: [
                        {
                            y: "value",
                            color: "#4682b4",  //4682b4', label: 'toto'}
                            label: "toto"
                        }, {
                            y: "value",
                            axis: "y2",
                            color: "#4682b4",  //4682b4', type: 'column'}
                            type: "column"
                        }
                    ]
                };
            });

            expectedTicks = "1e-3         1e-2         1e-1         1e+0         1e+1         1e+2         1e+3         1e+4         1e+5";

            yticks = element.childByClass("y axis").children("text");
            computedYTicks = yticks.map((t) => t.domElement.textContent);

            y2ticks = element.childByClass("y2 axis").children("text");
            computedY2Ticks = y2ticks.map((t) => t.domElement.textContent);

            expect(computedYTicks.join(" ")).to.eql(expectedTicks);
            return expect(computedY2Ticks.join(" ")).to.eql(expectedTicks);
        });

        it("should configure y axis with logarithmic values", () => {
            var computedYTicks, expectedTicks, yticks;
            expectedTicks = ["1e+0", "2e+0", "3e+0", "4e+0", "5e+0", "6e+0", "7e+0", "8e+0", "9e+0", "1e+1"];
            yticks = element.childByClass("y axis").children("text");
            computedYTicks = yticks.map((t) => t.domElement.textContent);
            return expect(computedYTicks).to.eql(expectedTicks);
        });

        it("should configure y2 axis with logarithmic values", () => {
            var computedY2Ticks, expectedTicks, y2ticks;
            outerScope.$apply(() => outerScope.options = {
                    axes: {
                        y2: {
                            type: "log"
                        }
                    },
                    series: [
                        {
                            y: "value",
                            color: "#4682b4",  //4682b4', label: 'toto'}
                            label: "toto"
                        }, {
                            y: "value",
                            axis: "y2",
                            color: "#4682b4",  //4682b4', type: 'column'}
                            type: "column"
                        }
                    ]
                });

            expectedTicks = ["1e+0", "2e+0", "3e+0", "4e+0", "5e+0", "6e+0", "7e+0", "8e+0", "9e+0", "1e+1"];

            y2ticks = element.childByClass("y2 axis").children("text");
            computedY2Ticks = y2ticks.map((t) => t.domElement.textContent);
            return expect(computedY2Ticks).to.eql(expectedTicks);
        });

        it("should let y2 axis in linear mode if told so", () => {
            var computedY2Ticks, expectedTicks, y2ticks;
            expectedTicks = ["4.0", "4.5", "5.0", "5.5", "6.0", "6.5", "7.0", "7.5", "8.0"];

            y2ticks = element.childByClass("y2 axis").children("text");
            computedY2Ticks = y2ticks.map((t) => t.domElement.textContent);
            return expect(computedY2Ticks).to.eql(expectedTicks);
        });

        return it("should compute the correct interval for time range function with ticksInterval", () => {
            var computedXTicks, expectedTicks, xticks;
            outerScope.$apply(() => {
                outerScope.data = [
                    {
                        x: new Date(2015, 0, 4),
                        value: 1
                    }, {
                        x: new Date(2015, 0, 5),
                        value: 1
                    }, {
                        x: new Date(2015, 0, 6),
                        value: 1
                    }, {
                        x: new Date(2015, 0, 7),
                        value: 1
                    }, {
                        x: new Date(2015, 0, 8),
                        value: 1
                    }, {
                        x: new Date(2015, 0, 9),
                        value: 1
                    }, {
                        x: new Date(2015, 0, 10),
                        value: 1
                    }
                ];
                return outerScope.options = {
                    axes: {
                        x: {
                            type: "date",
                            ticks: d3.time.day,
                            ticksInterval: 3,
                            ticksFormat: "%d.%m.%Y"
                        }
                    },
                    series: [
                        {
                            y: "value"
                        }
                    ]
                };
            });

            expectedTicks = ["04.01.2015", "07.01.2015", "10.01.2015"];
            xticks = element.childByClass("x axis").children("text");
            computedXTicks = xticks.map((t) => t.domElement.textContent);
            return expect(computedXTicks).to.eql(expectedTicks);
        });
    });
});

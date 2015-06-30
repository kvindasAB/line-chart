describe("options", () => {
    var n3utils;
    n3utils = void 0;

    beforeEach(module("n3-line-chart"));

    beforeEach(inject((_n3utils_) => n3utils = _n3utils_));

    it("should set the default column gap to 5", () => {
        var o;
        o = n3utils.sanitizeOptions();
        expect(o.columnsHGap).to.equal(5);

        o = n3utils.sanitizeOptions({});
        return expect(o.columnsHGap).to.equal(5);
    });

    describe("stacks", () => {
        it("should create an empty array of none found", () => {
            var o;
            o = n3utils.sanitizeOptions();
            expect(o.stacks).to.eql([]);

            o = n3utils.sanitizeOptions({});
            return expect(o.stacks).to.eql([]);
        });

        it("should complain if non-existent series are stacked", inject(($log) => {
            sinon.stub($log, "warn", () => {});

            n3utils.sanitizeOptions({
                stacks: [
                    {
                        series: ["series_0"]
                    }
                ]
            });

            return expect($log.warn.callCount).to.equal(1);
        }));

        return it("should complain if series are not on the same axis", inject(($log) => {
            sinon.stub($log, "warn", () => {});

            n3utils.sanitizeOptions({
                stacks: [
                    {
                        series: ["series_0"],
                        axis: "y"
                    }
                ],
                series: [
                    {
                        id: "series_0",
                        axis: "y2"
                    }
                ]
            });

            return expect($log.warn.callCount).to.equal(1);
        }));
    });

    describe("drawLegend", () => {
        it("should set default drawLegend value if undefined or invalid", () => {
            var o;
            o = n3utils.sanitizeOptions();
            return expect(o.drawLegend).to.equal(true);
        });

        return it("should preserve the given drawLegend value if defined and valid", () => {
            var o;
            o = n3utils.sanitizeOptions({
                drawLegend: false
            });
            return expect(o.drawLegend).to.equal(false);
        });
    });

    describe("drawDots", () => {
        it("should set default drawDots value if undefined or invalid", () => {
            var o;
            o = n3utils.sanitizeOptions();
            return expect(o.drawDots).to.equal(true);
        });

        return it("should preserve the given drawDots value if defined and valid", () => {
            var o;
            o = n3utils.sanitizeOptions({
                drawDots: false
            });
            return expect(o.drawDots).to.equal(false);
        });
    });

    describe("hideOverflow", () => {
        it("should set default hideOverflow value if undefined or invalid", () => {
            var o;
            o = n3utils.sanitizeOptions();
            return expect(o.hideOverflow).to.equal(false);
        });

        return it("should preserve the given hideOverflow value if defined and valid", () => {
            var o;
            o = n3utils.sanitizeOptions({
                hideOverflow: true
            });
            return expect(o.hideOverflow).to.equal(true);
        });
    });

    describe("tooltip", () => it("should set default tooltip.mode if undefined or invalid", () => {
            var o;
            o = n3utils.sanitizeOptions();
            expect(o.tooltip).to.eql({
                mode: "scrubber"
            });

            o = n3utils.sanitizeOptions({});
            expect(o.tooltip).to.eql({
                mode: "scrubber"
            });

            o = n3utils.sanitizeOptions({
                tooltip: {
                    interpolate: true
                }
            });
            return expect(o.tooltip).to.eql({
                mode: "scrubber"
            });
        }));

    describe("linemode", () => {
        it("should add the default tension", () => {
            var o;
            o = n3utils.sanitizeOptions();
            return expect(o.tension).to.equal(0.7);
        });

        return it("should preserve the given tension", () => {
            var o;
            o = n3utils.sanitizeOptions({
                tension: 0.95
            });
            return expect(o.tension).to.equal(0.95);
        });
    });

    describe("margin", () => {
        it("should use the default margin", () => {
            var o;
            o = n3utils.sanitizeOptions();
            expect(o.margin.top).to.equal(20);
            expect(o.margin.right).to.equal(50);
            expect(o.margin.bottom).to.equal(60);
            return expect(o.margin.left).to.equal(50);
        });

        it("should use the default thumbnail margin", () => {
            var o;
            o = n3utils.sanitizeOptions(null, "thumbnail");
            expect(o.margin.top).to.equal(1);
            expect(o.margin.right).to.equal(1);
            expect(o.margin.bottom).to.equal(2);
            return expect(o.margin.left).to.equal(0);
        });

        return it("should parse margins as float", () => {
            var o;
            o = n3utils.sanitizeOptions({
                margin: {
                    top: "20.05",
                    left: 40.68
                }
            });
            expect(o.margin.top).to.equal(20.05);
            return expect(o.margin.left).to.equal(40.68);
        });
    });

    describe("axes", () => {
        it("should return default options when given null or undefined", () => expect(n3utils.sanitizeOptions().axes).to.eql({
                x: {
                    type: "linear",
                    key: "x"
                },
                y: {
                    type: "linear"
                }
            }));

        it("should set default axes and empty series", () => {
            var o;
            o = n3utils.sanitizeOptions({});
            expect(o.axes).to.eql({
                x: {
                    type: "linear",
                    key: "x"
                },
                y: {
                    type: "linear"
                }
            });

            return expect(o.series).to.eql([]);
        });

        it("should set default x axis type to linear", () => {
            var o;
            o = n3utils.sanitizeOptions({
                axes: {
                    x: {},
                    y: {}
                }
            });
            expect(o.axes.x.type).to.equal("linear");
            return expect(o.axes.y.type).to.equal("linear");
        });

        it("should set default y axis", () => {
            var o;
            o = n3utils.sanitizeOptions({
                axes: {
                    x: {}
                }
            });
            return expect(o.axes.y).to.eql({
                type: "linear"
            });
        });

        it("should set default x axis", () => expect(n3utils.sanitizeOptions({
                tooltip: {
                    mode: "axes",
                    interpolate: false
                },
                lineMode: "linear",
                axes: {}
            }).axes).to.eql({
                x: {
                    type: "linear",
                    key: "x"
                },
                y: {
                    type: "linear"
                }
            }));

        it("should allow x axis configuration", () => expect(n3utils.sanitizeOptions({
                tooltip: {
                    mode: "axes",
                    interpolate: false
                },
                lineMode: "linear",
                axes: {
                    x: {
                        key: "foo"
                    }
                }
            }).axes).to.eql({
                x: {
                    type: "linear",
                    key: "foo"
                },
                y: {
                    type: "linear"
                }
            }));

        it("should allow x axes extrema configuration", () => {
            var computed, expected;
            expected = {
                x: {
                    type: "linear",
                    key: "x",
                    min: 5,
                    max: 15
                },
                y: {
                    type: "linear"
                }
            };

            computed = n3utils.sanitizeOptions({
                tooltip: {
                    mode: "axes",
                    interpolate: false
                },
                lineMode: "linear",
                axes: {
                    x: {
                        min: "5",
                        max: 15
                    }
                }
            }).axes;

            return expect(computed).to.eql(expected);
        });

        it("should pass the ticks property, whatever it is", () => {
            var computed, expected;
            expected = {
                x: {
                    type: "linear",
                    key: "x",
                    ticks: 2
                },
                y: {
                    type: "linear",
                    ticks: [5]
                },
                y2: {
                    type: "date",
                    ticks: d3.time.minute
                }
            };

            computed = n3utils.sanitizeOptions({
                axes: {
                    x: {
                        ticks: 2
                    },
                    y: {
                        ticks: [5]
                    },
                    y2: {
                        type: "date",
                        ticks: d3.time.minute
                    }
                }
            }).axes;

            return expect(computed).to.eql(expected);
        });

        it("should pass the ticksInterval property as a number", () => {
            var computed, expected;
            expected = {
                x: {
                    type: "date",
                    key: "x",
                    ticks: d3.time.minute,
                    ticksInterval: 5
                },
                y: {
                    type: "date",
                    ticks: d3.time.minute,
                    ticksInterval: 10
                }
            };

            computed = n3utils.sanitizeOptions({
                axes: {
                    x: {
                        type: "date",
                        ticks: d3.time.minute,
                        ticksInterval: 5
                    },
                    y: {
                        type: "date",
                        ticks: d3.time.minute,
                        ticksInterval: "10"
                    }
                }
            }).axes;

            return expect(computed).to.eql(expected);
        });

        it("should allow y axes extrema configuration", () => {
            var computed, expected;
            expected = {
                x: {
                    type: "linear",
                    key: "x"
                },
                y: {
                    type: "linear",
                    min: 5,
                    max: 15
                }
            };

            computed = n3utils.sanitizeOptions({
                tooltip: {
                    mode: "axes",
                    interpolate: false
                },
                lineMode: "linear",
                axes: {
                    y: {
                        min: "5",
                        max: 15
                    }
                }
            }).axes;

            return expect(computed).to.eql(expected);
        });

        it("should log a warning if non number value given as extrema", inject(($log) => {
            var computed, expected;
            sinon.stub($log, "warn", () => {});

            expected = {
                x: {
                    type: "linear",
                    key: "x"
                },
                y: {
                    type: "linear",
                    max: 15
                }
            };

            computed = n3utils.sanitizeOptions({
                tooltip: {
                    mode: "axes",
                    interpolate: false
                },
                lineMode: "linear",
                axes: {
                    y: {
                        min: "pouet",
                        max: 15
                    }
                }
            }).axes;

            expect(computed).to.eql(expected);
            return expect($log.warn.callCount).to.equal(1);
        }));

        it("should parse extrema options as floats", inject(($log) => {
            var computed;
            sinon.stub($log, "warn", () => {});

            computed = n3utils.sanitizeOptions({
                axes: {
                    y: {
                        min: "13.421",
                        max: 15.23
                    }
                }
            }).axes;

            expect(computed.y.min).to.equal(13.421);
            return expect(computed.y.max).to.equal(15.23);
        }));

        it("should create a formatter function when ticks format is defined", () => {
            var computed;
            computed = n3utils.sanitizeOptions({
                axes: {
                    x: {
                        ticksFormat: ".2f"
                    }
                }
            }).axes;

            return expect(computed.x.ticksFormatter(2)).to.equal("2.00");
        });

        it("should create a time formatter function when ticks format is defined on date axis", () => {
            var computed;
            computed = n3utils.sanitizeOptions({
                axes: {
                    x: {
                        type: "date",
                        ticksFormat: "%Y-%m-%d"
                    }
                }
            }).axes;

            return expect(computed.x.ticksFormatter(new Date(2015, 0, 1))).to.equal("2015-01-01");
        });

        it("should use the ticks formatter function when no tooltip format is defined", () => {
            var computed;
            computed = n3utils.sanitizeOptions({
                axes: {
                    x: {
                        ticksFormat: ".2f"
                    }
                }
            }).axes;

            return expect(computed.x.tooltipFormatter(2)).to.equal("2.00");
        });

        it("should create a formatter function when tooltip format is defined", () => {
            var computed;
            computed = n3utils.sanitizeOptions({
                axes: {
                    x: {
                        tooltipFormat: ".2f"
                    }
                }
            }).axes;

            return expect(computed.x.tooltipFormatter(2)).to.equal("2.00");
        });

        it("should create a time formatter function when tooltip format is defined on date axis", () => {
            var computed;
            computed = n3utils.sanitizeOptions({
                axes: {
                    x: {
                        type: "date",
                        tooltipFormat: "%Y-%m-%d"
                    }
                }
            }).axes;

            return expect(computed.x.tooltipFormatter(new Date(2015, 0, 1))).to.equal("2015-01-01");
        });

        return it("should parse the ticksRotate as floats", () => {
            var computed;
            computed = n3utils.sanitizeOptions({
                axes: {
                    x: {
                        type: "date",
                        ticksRotate: 20.05
                    },
                    y: {
                        type: "linear",
                        ticksRotate: "40.25"
                    },
                    y2: {
                        type: "linear",
                        ticksRotate: -45
                    }
                }
            }).axes;

            expect(computed.x.ticksRotate).to.equal(20.05);
            expect(computed.y.ticksRotate).to.equal(40.25);
            return expect(computed.y2.ticksRotate).to.equal(-45.00);
        });
    });

    return describe("series", () => {
        it("should throw an error if twice the same id is found", () => expect(() => n3utils.sanitizeSeriesOptions([
                    {
                        id: "pouet"
                    }, {
                        id: "pouet"
                    }
                ])).to["throw"]());

        it("should give an id to series if none has been found", () => {
            var expected, o;
            o = n3utils.sanitizeSeriesOptions([
                {
                    type: "line",
                    drawDots: false
                }, {
                    type: "line",
                    drawDots: true,
                    id: "series_0"
                }, {
                    type: "column",
                    drawDots: true,
                    id: "tut"
                }, {
                    type: "area",
                    drawDots: false
                }
            ]);

            expected = [
                {
                    type: "line",
                    drawDots: false,
                    id: "series_1",
                    axis: "y",
                    color: "#1f77b4",
                    thickness: "1px"
                }, {
                    type: "line",
                    id: "series_0",
                    drawDots: true,
                    axis: "y",
                    color: "#ff7f0e",
                    thickness: "1px",
                    dotSize: 2
                }, {
                    type: "column",
                    id: "tut",
                    axis: "y",
                    color: "#2ca02c"
                }, {
                    type: "area",
                    id: "series_2",
                    drawDots: false,
                    axis: "y",
                    color: "#d62728",
                    thickness: "1px"
                }
            ];

            return expect(o).to.eql(expected);
        });

        it("should preserve/remove the drawDots setting", () => {
            var o;
            o = n3utils.sanitizeSeriesOptions([
                {
                    type: "line",
                    drawDots: false
                }, {
                    type: "line",
                    drawDots: true
                }, {
                    type: "column",
                    drawDots: true
                }, {
                    type: "area",
                    drawDots: false
                }
            ]);

            expect(o[0].drawDots).to.equal(false);
            expect(o[1].drawDots).to.equal(true);
            expect(o[2].drawDots).to.equal(void 0);
            return expect(o[3].drawDots).to.equal(false);
        });

        it("should preserve/remove the dotSize setting", () => {
            var o;
            o = n3utils.sanitizeSeriesOptions([
                {
                    type: "line",
                    drawDots: false,
                    dotSize: 10
                }, {
                    type: "line",
                    drawDots: true,
                    dotSize: 5
                }, {
                    type: "column",
                    drawDots: true,
                    dotSize: 2
                }, {
                    type: "area"
                }
            ]);

            expect(o[0].dotSize).to.equal(void 0);
            expect(o[1].dotSize).to.equal(5);
            expect(o[2].dotSize).to.equal(void 0);
            return expect(o[3].dotSize).to.equal(2);
        });

        it("should sanitize lineMode", () => {
            var f;
            f = n3utils.sanitizeSeriesOptions;

            return expect(f([
                {
                    type: "line",
                    lineMode: "dashed"
                }, {
                    type: "line",
                    lineMode: 42
                }, {
                    type: "area",
                    lineMode: "dashed"
                }, {
                    type: "column",
                    lineMode: "dashed"
                }, {
                    type: "column"
                }
            ])).to.eql([
                {
                    type: "line",
                    id: "series_0",
                    lineMode: "dashed",
                    axis: "y",
                    color: "#1f77b4",
                    thickness: "1px",
                    dotSize: 2
                }, {
                    type: "line",
                    id: "series_1",
                    axis: "y",
                    color: "#ff7f0e",
                    thickness: "1px",
                    dotSize: 2
                }, {
                    type: "area",
                    id: "series_2",
                    lineMode: "dashed",
                    axis: "y",
                    color: "#2ca02c",
                    thickness: "1px",
                    dotSize: 2
                }, {
                    type: "column",
                    id: "series_3",
                    axis: "y",
                    color: "#d62728"
                }, {
                    type: "column",
                    id: "series_4",
                    axis: "y",
                    color: "#9467bd"
                }
            ]);
        });

        it("should set y as the default axis", () => {
            var f;
            f = n3utils.sanitizeSeriesOptions;
            return expect(f([
                {}, {
                    type: "area",
                    thickness: "2px"
                }, {
                    type: "area",
                    color: "red",
                    thickness: "dans ton ***"
                }, {
                    type: "column",
                    axis: "y2"
                }
            ])).to.eql([
                {
                    id: "series_0",
                    type: "line",
                    color: "#1f77b4",  //1f77b4', thickness: '1px', axis: 'y', dotSize: 2}
                    thickness: "1px",
                    axis: "y",
                    dotSize: 2
                }, {
                    id: "series_1",
                    type: "area",
                    color: "#ff7f0e",  //ff7f0e', thickness: '2px', axis: 'y', dotSize: 2}
                    thickness: "2px",
                    axis: "y",
                    dotSize: 2
                }, {
                    id: "series_2",
                    type: "area",
                    color: "red",
                    thickness: "1px",
                    axis: "y",
                    dotSize: 2
                }, {
                    id: "series_3",
                    type: "column",
                    color: "#2ca02c",  //2ca02c', axis: 'y2'}
                    axis: "y2"
                }
            ]);
        });

        it("should set line or area's line thickness", () => {
            var f;
            f = n3utils.sanitizeSeriesOptions;

            return expect(f([
                {}, {
                    type: "area",
                    thickness: "2px"
                }, {
                    type: "area",
                    color: "red",
                    thickness: "dans ton ***"
                }, {
                    type: "column"
                }
            ])).to.eql([
                {
                    id: "series_0",
                    type: "line",
                    color: "#1f77b4",  //1f77b4', thickness: '1px', axis: 'y', dotSize: 2}
                    thickness: "1px",
                    axis: "y",
                    dotSize: 2
                }, {
                    id: "series_1",
                    type: "area",
                    color: "#ff7f0e",  //ff7f0e', thickness: '2px', axis: 'y', dotSize: 2}
                    thickness: "2px",
                    axis: "y",
                    dotSize: 2
                }, {
                    id: "series_2",
                    type: "area",
                    color: "red",
                    thickness: "1px",
                    axis: "y",
                    dotSize: 2
                }, {
                    id: "series_3",
                    type: "column",
                    color: "#2ca02c",  //2ca02c', axis: 'y'}
                    axis: "y"
                }
            ]);
        });

        return it("should set series colors if none found", () => expect(n3utils.sanitizeOptions({
                series: [
                    {
                        y: "value",
                        color: "steelblue",
                        type: "area",
                        label: "Pouet"
                    }, {
                        y: "otherValue",
                        axis: "y2"
                    }
                ]
            }).series).to.eql([
                {
                    y: "value",
                    id: "series_0",
                    axis: "y",
                    color: "steelblue",
                    type: "area",
                    label: "Pouet",
                    thickness: "1px",
                    dotSize: 2
                }, {
                    y: "otherValue",
                    id: "series_1",
                    axis: "y2",
                    color: "#1f77b4",  //1f77b4'
                    type: "line",
                    thickness: "1px",
                    dotSize: 2
                }
            ]));
    });
});

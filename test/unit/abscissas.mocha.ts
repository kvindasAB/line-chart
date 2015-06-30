describe("abscissas", () => {
    var element, innerScope, outerScope;
    element = void 0;
    innerScope = void 0;
    outerScope = void 0;

    beforeEach(module("n3-line-chart"));
    beforeEach(module("testUtils"));

    beforeEach(inject((n3utils) => {
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
        return _ref = pepito.directive("<div>\n  <linechart data=\"data\" options=\"options\"></linechart>\n</div>"), element = _ref.element, innerScope = _ref.innerScope, outerScope = _ref.outerScope, _ref;
    }));

    describe("custom ticklabel formatter", () => {
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
                    axes: {
                        x: {
                            ticksFormatter: (v) => "#" + v * .1  //' + v * .1
                        }
                    },
                    series: [
                        {
                            y: "value",
                            color: "#4682b4"  //4682b4'
                        }
                    ]
                };
            }));

        it("should configure x axis", () => {
            var ticks;
            ticks = element.childByClass("x axis").children("text");

            expect(ticks.length).to.equal(11);
            expect(ticks[0].domElement.textContent).to.equal("#0");  //0')
            return expect(ticks[10].domElement.textContent).to.equal("#0.5");  //0.5')
        });

        return it("should draw a line", () => {
            var linePath;
            linePath = element.childByClass("line");

            expect(linePath.hasClass("line")).to.equal(true);
            return expect(linePath.domElement.getAttribute("d")).to.equal("M0,410L160,370L320,300L480,290L640,220L800,30");
        });
    });

    describe("default key", () => {
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
                    series: [
                        {
                            y: "value",
                            color: "#4682b4"  //4682b4'
                        }
                    ]
                };
            }));

        it("should configure x axis", () => {
            var ticks;
            ticks = element.childByClass("x axis").children("text");

            expect(ticks.length).to.equal(11);
            expect(ticks[0].domElement.textContent).to.equal("0.0");
            return expect(ticks[10].domElement.textContent).to.equal("5.0");
        });

        return it("should draw a line", () => {
            var linePath;
            linePath = element.childByClass("line");

            expect(linePath.hasClass("line")).to.equal(true);
            return expect(linePath.domElement.getAttribute("d")).to.equal("M0,410L160,370L320,300L480,290L640,220L800,30");
        });
    });

    describe("min, max", () => {
        beforeEach(() => outerScope.$apply(() => {
                outerScope.data = [
                    {
                        foo: 0,
                        value: 4
                    }, {
                        foo: 1,
                        value: 8
                    }, {
                        foo: 2,
                        value: 15
                    }, {
                        foo: 3,
                        value: 16
                    }, {
                        foo: 4,
                        value: 23
                    }, {
                        foo: 5,
                        value: 42
                    }
                ];
                return outerScope.options = {
                    axes: {
                        x: {
                            key: "foo",
                            min: 10,
                            max: 50
                        }
                    },
                    series: [
                        {
                            y: "value",
                            color: "#4682b4"  //4682b4'
                        }
                    ]
                };
            }));

        it("should properly configure x axis", () => {
            var ticks;
            ticks = element.childByClass("x axis").children("text");

            expect(ticks.length).to.equal(9);
            expect(ticks[0].domElement.textContent).to.equal("10");
            return expect(ticks[8].domElement.textContent).to.equal("50");
        });

        return it("should draw a line", () => {
            var linePath;
            linePath = element.childByClass("line");

            expect(linePath.hasClass("line")).to.equal(true);
            return expect(linePath.domElement.getAttribute("d")).to.equal("M-200,410L-180,370L-160,300L-140,290L-120,220L-100,30");
        });
    });

    return describe("custom key", () => {
        beforeEach(() => outerScope.$apply(() => {
                outerScope.data = [
                    {
                        foo: 0,
                        value: 4
                    }, {
                        foo: 1,
                        value: 8
                    }, {
                        foo: 2,
                        value: 15
                    }, {
                        foo: 3,
                        value: 16
                    }, {
                        foo: 4,
                        value: 23
                    }, {
                        foo: 5,
                        value: 42
                    }
                ];
                return outerScope.options = {
                    axes: {
                        x: {
                            key: "foo"
                        }
                    },
                    series: [
                        {
                            y: "value",
                            color: "#4682b4"  //4682b4'
                        }
                    ]
                };
            }));

        it("should properly configure x axis from custom key", () => {
            var ticks;
            ticks = element.childByClass("x axis").children("text");

            expect(ticks.length).to.equal(11);
            expect(ticks[0].domElement.textContent).to.equal("0.0");
            return expect(ticks[10].domElement.textContent).to.equal("5.0");
        });

        return it("should draw a line", () => {
            var linePath;
            linePath = element.childByClass("line");

            expect(linePath.hasClass("line")).to.equal(true);
            return expect(linePath.domElement.getAttribute("d")).to.equal("M0,410L160,370L320,300L480,290L640,220L800,30");
        });
    });
});

describe("ordinates", () => {
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
        return _ref = pepito.directive("<div>\n  <linechart data='data' options='options'></linechart>\n</div>"), element = _ref.element, innerScope = _ref.innerScope, outerScope = _ref.outerScope, _ref;
    }));

    return describe("custom ticklabel formatter", () => {
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

                function f(value) {
                    return "#" + value * .1;  //' + value * .1
                }
                function f2(value) {
                    return "$" + value;
                }

                return outerScope.options = {
                    axes: {
                        y: {
                            ticksFormatter: f
                        },
                        y2: {
                            ticksFormatter: f2
                        }
                    },
                    series: [
                        {
                            y: "value",
                            color: "#4682b4"  //4682b4'}
                        }, {
                            y: "x",
                            color: "#4682b4",  //4682b4', axis: 'y2'}
                            axis: "y2"
                        }
                    ]
                };
            }));

        it("should configure y axis", () => {
            var ticks;
            ticks = element.childByClass("y axis").children("text");
            expect(ticks.length).to.equal(10);
            expect(ticks[0].domElement.textContent).to.equal("#0");  //0')
            return expect(ticks[9].domElement.textContent).to.equal("#4.5");  //4.5')
        });

        return it("should configure y2 axis", () => {
            var ticks;
            ticks = element.childByClass("y2 axis").children("text");
            expect(ticks.length).to.equal(11);
            expect(ticks[0].domElement.textContent).to.equal("$0");
            return expect(ticks[10].domElement.textContent).to.equal("$5");
        });
    });
});

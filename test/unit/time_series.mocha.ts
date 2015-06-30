describe("time series", () => {
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

    beforeEach(() => {
        var then_;
        then_ = 1369145776795;
        return outerScope.$apply(() => {
            outerScope.data = [
                {
                    x: new Date(then_ + 0 * 3600),
                    value: 4,
                    foo: -2
                }, {
                    x: new Date(then_ + 1 * 3600),
                    value: 8,
                    foo: 22
                }, {
                    x: new Date(then_ + 2 * 3600),
                    value: 15,
                    foo: -1
                }, {
                    x: new Date(then_ + 3 * 3600),
                    value: 16,
                    foo: 0
                }, {
                    x: new Date(then_ + 4 * 3600),
                    value: 23,
                    foo: -3
                }, {
                    x: new Date(then_ + 5 * 3600),
                    value: 42,
                    foo: -4
                }
            ];
            return outerScope.options = {
                axes: {
                    x: {
                        type: "date"
                    }
                },
                series: [
                    {
                        axis: "y",
                        y: "value",
                        color: "#4682b4",
                        type: "column"
                    }, {
                        axis: "y2",
                        y: "foo",
                        color: "steelblue",
                        type: "area"
                    }
                ]
            };
        });
    });

    return it("should properly configure x axis", () => {
        var ticks;
        ticks = element.childByClass("x axis").children("text");
        expect(ticks.length).to.equal(5);
        expect(ticks[0].domElement.textContent).to.equal(":15");
        return expect(ticks[4].domElement.textContent).to.equal(":35");
    });
});

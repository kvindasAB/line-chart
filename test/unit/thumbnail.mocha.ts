describe("thumbnail mode", () => {
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
        return _ref = pepito.directive("<div>\n  <linechart data='data' options='options' mode='thumbnail'></linechart>\n</div>"), element = _ref.element, innerScope = _ref.innerScope, outerScope = _ref.outerScope, _ref;
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
                series: [
                    {
                        y: "value",
                        color: "#4682b4"  //4682b4'
                    }
                ]
            };
        }));

    it("should create one svg element", () => {
        // this is the template's div
        var chart;
        expect(element.domElement.nodeName).to.equal("DIV");
        chart = element.childByClass("chart");
        expect(chart).not.to.equal(void 0);

        return expect(chart.child("svg")).not.to.equal(void 0);
    });

    it("should create only content", () => {
        var svgGroup;
        outerScope.$apply(() => outerScope.options = {
                series: [
                    {
                        axis: "y",
                        y: "value",
                        color: "#4682b4"  //4682b4'
                    }, {
                        axis: "y2",
                        y: "value",
                        color: "#4682b4"  //4682b4'
                    }
                ]
            });

        svgGroup = element.child("svg").children()[0];
        expect(svgGroup.children().length).to.equal(2);
        expect(svgGroup.childByClass("patterns")).not.to.equal(void 0);
        return expect(svgGroup.childByClass("content")).not.to.equal(void 0);
    });

    describe("line series", () => {
        it("should create a group", () => {
            var lineGroup;
            lineGroup = element.childByClass("lineGroup series_0");
            return expect(lineGroup.getAttribute("style").trim()).to.equal("stroke: rgb(70, 130, 180);");
        });

        return it("should only draw a line", () => {
            var linePath;
            linePath = element.childByClass("line");
            return expect(linePath.getAttribute("d")).equal("M0,453L180,409L360,331L539,320L719,243L899,33");
        });
    });

    return describe("area series", () => {
        beforeEach(() => outerScope.$apply(() => outerScope.options = {
                    series: [
                        {
                            axis: "y",
                            y: "value",
                            type: "area",
                            color: "blue"
                        }
                    ]
                }));

        it("should create a group and draw an area", () => {
            var areaGroup, areaPath;
            areaGroup = element.childByClass("areaGroup series_0");
            expect(areaGroup.getAttribute("style")).to.equal(null);
            areaPath = areaGroup.childByClass("area");
            expect(areaPath.getAttribute("style").trim()).to.match(/fill: (rgb\(0, 0, 255\))|(blue); opacity: 0.3;/);
            return expect(areaPath.getAttribute("d")).to.equal("M0,453L180,409L360,331L539,320L719,243L899,33L899,497L719,497L539,497L360,497L180,497L0,497Z");
        });

        return it("should draw a line", () => {
            var linePath;
            linePath = element.childByClass("line");
            return expect(linePath.getAttribute("d")).to.equal("M0,453L180,409L360,331L539,320L719,243L899,33");
        });
    });
});

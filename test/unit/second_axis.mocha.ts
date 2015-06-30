describe("with a second axis", () => {
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

    beforeEach(() => outerScope.$apply(() => {
            outerScope.data = [
                {
                    x: 0,
                    value: 4,
                    foo: -2
                }, {
                    x: 1,
                    value: 8,
                    foo: 22
                }, {
                    x: 2,
                    value: 15,
                    foo: -1
                }, {
                    x: 3,
                    value: 16,
                    foo: 0
                }, {
                    x: 4,
                    value: 23,
                    foo: -3
                }, {
                    x: 5,
                    value: 42,
                    foo: -4
                }
            ];
            return outerScope.options = {
                series: [
                    {
                        axis: "y",
                        y: "value",
                        color: "#4682b4",  //4682b4'
                        type: "area"
                    }, {
                        axis: "y2",
                        y: "foo",
                        color: "steelblue",
                        type: "area"
                    }
                ]
            };
        }));

    it("should configure y axis only with y series", () => {
        var ticks;
        ticks = element.childByClass("y axis").children("text");
        expect(ticks.length).to.equal(10);
        expect(ticks[0].domElement.textContent).to.equal("0");
        return expect(ticks[9].domElement.textContent).to.equal("45");
    });

    it("should properly configure y2 axis", () => {
        var computedTicks, ticks;
        ticks = element.childByClass("y2 axis").children("text");
        expect(ticks.length).to.equal(14);
        computedTicks = ticks.map((t) => t.domElement.textContent);
        return expect(computedTicks).to.eql(["-4", "-2", "0", "2", "4", "6", "8", "10", "12", "14", "16", "18", "20", "22"]);
    });

    it("should draw two lines", () => {
        var content, lines;
        content = element.childByClass("content");
        lines = element.childByClass("content").childrenByClass("line");
        expect(lines.length).to.equal(2);

        expect(lines[0].getAttribute("d")).to.equal("M0,410L160,370L320,300L480,290L640,220L800,30");
        return expect(lines[1].getAttribute("d")).to.equal("M0,415L160,0L320,398L480,381L640,433L800,450");
    });

    it("should draw y area", () => {
        var areaGroup, areaPath;
        areaGroup = element.childByClass("areaGroup series_0");
        expect(areaGroup.getAttribute("style")).to.equal(null);

        areaPath = areaGroup.childByClass("area");
        expect(areaPath.getAttribute("style").trim()).to.match(/fill: (rgb\(70, 130, 180\))|(#4682b4); opacity: 0.3;/);  //4682b4); opacity: 0.3;/)
        return expect(areaPath.getAttribute("d")).to.equal("M0,410L160,370L320,300L480,290L640,220L800,30L800,450L640,450L480,450L320,450L160,450L0,450Z");
    });

    it("should draw y2 area", () => {
        var areaGroup, areaPath;
        areaGroup = element.childByClass("areaGroup series_1");
        expect(areaGroup.getAttribute("style")).to.equal(null);

        areaPath = areaGroup.childByClass("area");
        expect(areaPath.getAttribute("style").trim()).to.match(/fill: (rgb\(70, 130, 180\))|(steelblue); opacity: 0.3;/);
        return expect(areaPath.getAttribute("d")).to.equal("M0,415L160,0L320,398L480,381L640,433L800,450L800,381L640,381L480,381L320,381L160,381L0,381Z");
    });

    it("should draw y axis dots", () => {
        var computedX, computedY, dots, i, leftDotsGroup, _results;
        leftDotsGroup = element.childByClass("dotGroup series_0");
        expect(leftDotsGroup.domElement.nodeName).to.equal("g");

        dots = leftDotsGroup.children();
        expect(dots.length).to.equal(6);
        function fn(att) {
            return (a, b) => a + " " + b.getAttribute(att);
        }

        computedX = Array.prototype.reduce.call(dots, fn("cx"), "X");
        computedY = Array.prototype.reduce.call(dots, fn("cy"), "Y");
        expect(computedX).to.equal("X 0 160 320 480 640 800");
        expect(computedY).to.equal("Y 410 370 300 290 220 30");
        i = 0;

        _results = [];
        while (i < dots.length) {
            expect(dots[i].domElement.nodeName).to.equal("circle");
            _results.push(i++);
        }
        return _results;
    });

    return it("should draw y2 axis dots", () => {
        var computedX, computedY, dots, i, rightDotsGroup, _results;
        rightDotsGroup = element.childByClass("dotGroup series_1");
        expect(rightDotsGroup.domElement.nodeName).to.equal("g");

        dots = rightDotsGroup.children();
        expect(dots.length).to.equal(6);
        function fn(att) {
            return (a, b) => a + " " + b.getAttribute(att);
        }

        computedX = Array.prototype.reduce.call(dots, fn("cx"), "X");
        computedY = Array.prototype.reduce.call(dots, fn("cy"), "Y");
        expect(computedX).to.equal("X 0 160 320 480 640 800");
        expect(computedY).to.equal("Y 415 0 398 381 433 450");
        i = 0;

        _results = [];
        while (i < dots.length) {
            expect(dots[i].domElement.nodeName).to.equal("circle");
            _results.push(i++);
        }
        return _results;
    });
});

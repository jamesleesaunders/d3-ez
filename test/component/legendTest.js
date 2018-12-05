let test = require("tape");
let d3Ez = require("../../build/d3-ez");
let d3 = require("d3");

test("componentLegendTest", function(t) {
	let domain = [3, 9];
	let sizes = [5, 25];

	let sizeScale = d3.scaleLinear()
		.domain(domain)
		.range(sizes);

	let legendComponent = d3Ez.component.legend()
		.sizeScale(sizeScale);

	t.equal(legendComponent.width(), 100);

	t.end();
});

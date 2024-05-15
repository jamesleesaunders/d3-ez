import * as d3 from "d3";
import test from "tape";
import d3Ez from "../../index.js";

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

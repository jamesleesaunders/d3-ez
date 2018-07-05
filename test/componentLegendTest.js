let d3Ez = require("../");
let tape = require("tape");
let d3 = require("d3");

tape("componentLegendTest", function(t) {
	let domain = [1, 2, 3];
	let sizes = [10, 20, 30];

	let sizeScale = d3.scaleOrdinal()
		.domain(domain)
		.range(sizes);

	let legendComponent = d3Ez.component.legend()
		.sizeScale(sizeScale);

	t.equal(legendComponent.width(), 100);

	t.end();
});

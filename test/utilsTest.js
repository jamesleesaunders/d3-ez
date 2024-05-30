import test from "tape";
import { generateLayout } from "../src/utils.js";

test("layoutTest", function(t) {
	let result = generateLayout(5, 300, 200);
	let expect = {
		cellWidth: 100,
		cellHeight: 100,
		cellRadius: 35,
		coordinates: [
			{ x: 50, y: 50 },
			{ x: 150, y: 50 },
			{ x: 250, y: 50 },
			{ x: 100, y: 150 },
			{ x: 200, y: 150 }
		]
	};

	t.deepEquals(result, expect);

	t.end();
});

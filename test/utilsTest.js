import test from "tape";
import d3Ez from "../src/index.js";

function generateLayout(cellCount, width, height) {
	const cols = Math.ceil(Math.sqrt(cellCount));
	const rows = Math.ceil(cellCount / cols);
	const cellWidth = width / cols;
	const cellHeight = height / rows;
	const cellPadding = 15;
	const cellRadius = (Math.min(cellWidth, cellHeight) / 2) - cellPadding;

	const coordinates = [];
	for (let i = 0; i < cellCount; i++) {
		const row = Math.floor(i / cols);
		const col = i % cols;
		const offsetX = (cellWidth / 2) + (width - Math.min(cellCount - row * cols, cols) * cellWidth) / 2;
		const offsetY = (cellHeight / 2);
		const x = (col * cellWidth) + offsetX;
		const y = (row * cellHeight) + offsetY;
		coordinates.push({ x: x, y: y });
	}

	return { cellWidth, cellHeight, cellRadius, coordinates };
}

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

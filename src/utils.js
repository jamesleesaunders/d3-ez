import * as d3 from "d3";

/**
 * Generate Layout for Multiple Series Circular Charts
 *
 * @param cellCount
 * @param width
 * @param height
 * @returns {{cellWidth: number, cellHeight: number, cellRadius: number, coordinates: Array}}
 */
export function generateLayout(cellCount, width, height) {
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

/**
 * Wrap text into multiple lines if exceeds given width
 *
 * @param selection
 * @param width
 */
export function wrap(selection, width) {
	selection.each(function() {
		const text = d3.select(this);
		const content = text.text();
		const x = text.attr("x");
		const y = text.attr("y");

		const words = content.split(/\s+/).reverse();
		let line = [];
		let lineNumber = 1;
		const lineHeight = 1.1; // ems
		const dy = parseFloat(text.attr("dy")) || 0;

		let tspan = text.text(null)
			.append("tspan")
			.attr("x", x)
			.attr("y", y)
			.attr("dy", `${dy}em`);

		let word;
		while (word = words.pop()) {
			line.push(word);
			tspan.text(line.join(" "));
			if (tspan.node().getComputedTextLength() > width && line.length > 1) {
				line.pop();
				tspan.text(line.join(" "));
				line = [word];
				tspan = text.append("tspan")
					.attr("x", x)
					.attr("y", y)
					.attr("dy", `${lineNumber * lineHeight + dy}em`)
					.text(word);
				lineNumber++;
			}
		}
	});
}

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

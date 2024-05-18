import test from "tape";
import d3Ez from "../src/index.js";
import { dataset1, dataset2, dataset3 } from "./exampleData.js";

test("Test Summary 1", function(t) {
	let actual = d3Ez.dataTransform(dataset3).summary();
	let expected = {
		dataType: 1,
		rowKey: 'UK',
		rowTotal: 24,
		rowKeys: undefined,
		rowTotals: undefined,
		rowTotalsMin: undefined,
		rowTotalsMax: undefined,
		rowValuesKeys: ['key', 'value', 'x', 'y', 'z'],
		columnKeys: ['Apples', 'Oranges', 'Pears', 'Bananas'],
		columnTotals: undefined,
		columnTotalsMin: undefined,
		columnTotalsMax: undefined,
		valueMin: 3,
		valueMax: 9,
		valueExtent: [3, 9],
		valueExtentStacked: [0, 0],
		coordinatesMin: { x: 1, y: 1, z: 1 },
		coordinatesMax: { x: 4, y: 4, z: 4 },
		coordinatesExtent: { x: [1, 4], y: [1, 4], z: [1, 4] },
		maxDecimalPlace: 0,
		thresholds: [5, 6, 8, 9]
	};
	t.deepEqual(actual, expected);

	t.end();
});

test("Test Summary 2", function(t) {
	let actual = d3Ez.dataTransform(dataset1).summary();
	let expected = {
		dataType: 2,
		rowKey: undefined,
		rowTotal: undefined,
		rowKeys: ['Apples', 'Oranges', 'Pears', 'Bananas'],
		rowTotals: { Apples: 6, Oranges: 16, Pears: 8, Bananas: 28 },
		rowTotalsMin: 6,
		rowTotalsMax: 28,
		rowValuesKeys: ['key', 'value', 'x', 'y', 'z'],
		columnKeys: ['UK', 'France', 'Germany'],
		columnTotals: { UK: 24, France: 24, Germany: 10 },
		columnTotalsMin: 10,
		columnTotalsMax: 24,
		valueMin: -5,
		valueMax: 12,
		valueExtent: [-5, 12],
		valueExtentStacked: [-5, 28],
		coordinatesMin: { x: 1, y: 1, z: 1 },
		coordinatesMax: { x: 4, y: 4, z: 4 },
		coordinatesExtent: { x: [1, 4], y: [1, 4], z: [1, 4] },
		maxDecimalPlace: 0,
		thresholds: [-1, 4, 8, 12]
	};
	t.deepEqual(actual, expected);

	t.end();
});

test("Test Rotate", function(t) {
	t.deepEqual(d3Ez.dataTransform(dataset1).rotate(), dataset2);
	t.deepEqual(d3Ez.dataTransform(dataset2).rotate(), dataset1);

	t.end();
});

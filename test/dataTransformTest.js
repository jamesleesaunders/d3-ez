/*
import jsdom from "jsdom";
import test from "tape";
import d3Ez from "../";

const dataset1 = [{
	key: "Apples",
	values: [
		{ key: "UK", value: -9, x: 1, y: 1, z: 1 },
		{ key: "France", value: 2, x: 2, y: 2, z: 2 },
		{ key: "Spain", value: 18, x: 3, y: 3, z: 3 },
		{ key: "Germany", value: 5, x: 4, y: 4, z: 4 },
		{ key: "Italy", value: 7, x: 5, y: 5, z: 5 },
		{ key: "Portugal", value: 2, x: 6, y: 6, z: 6 }
	]
}, {
	key: "Oranges",
	values: [
		{ key: "UK", value: 3, x: 2, y: 2, z: 2 },
		{ key: "France", value: 10, x: 1, y: 1, z: 1 },
		{ key: "Spain", value: -2, x: 1, y: 1, z: 1 },
		{ key: "Germany", value: 3, x: 1, y: 1, z: 1 },
		{ key: "Italy", value: 4, x: 1, y: 1, z: 1 },
		{ key: "Portugal", value: 5, x: 1, y: 1, z: 1 }
	]
}, {
	key: "Pears",
	values: [
		{ key: "UK", value: 5, x: 3, y: 3, z: 3 },
		{ key: "France", value: 0, x: 1, y: 1, z: 1 },
		{ key: "Spain", value: 8, x: 1, y: 1, z: 1 },
		{ key: "Germany", value: 3, x: 1, y: 1, z: 1 },
		{ key: "Italy", value: 6, x: 1, y: 1, z: 1 },
		{ key: "Portugal", value: 10, x: 1, y: 1, z: 1 }
	]
}, {
	key: "Bananas",
	values: [
		{ key: "UK", value: 7, x: 4, y: 4, z: 4 },
		{ key: "France", value: 12, x: 1, y: 1, z: 1 },
		{ key: "Spain", value: 2, x: 1, y: 1, z: 1 },
		{ key: "Germany", value: 9, x: 1, y: 1, z: 1 },
		{ key: "Italy", value: 7, x: 1, y: 1, z: 1 },
		{ key: "Portugal", value: 4, x: 1, y: 1, z: 1 }
	]
}];

const dataset2 = [{
	key: "UK",
	values: [
		{ key: "Apples", value: -9, x: 1, y: 1, z: 1 },
		{ key: "Oranges", value: 3, x: 2, y: 2, z: 2 },
		{ key: "Pears", value: 5, x: 3, y: 3, z: 3 },
		{ key: "Bananas", value: 7, x: 4, y: 4, z: 4 }
	]
}, {
	key: "France",
	values: [
		{ key: "Apples", value: 2, x: 2, y: 2, z: 2 },
		{ key: "Oranges", value: 10, x: 1, y: 1, z: 1 },
		{ key: "Pears", value: 0, x: 1, y: 1, z: 1 },
		{ key: "Bananas", value: 12, x: 1, y: 1, z: 1 }
	]
}, {
	key: "Spain",
	values: [
		{ key: "Apples", value: 18, x: 3, y: 3, z: 3 },
		{ key: "Oranges", value: -2, x: 1, y: 1, z: 1 },
		{ key: "Pears", value: 8, x: 1, y: 1, z: 1 },
		{ key: "Bananas", value: 2, x: 1, y: 1, z: 1 }
	]
}, {
	key: "Germany",
	values: [
		{ key: "Apples", value: 5, x: 4, y: 4, z: 4 },
		{ key: "Oranges", value: 3, x: 1, y: 1, z: 1 },
		{ key: "Pears", value: 3, x: 1, y: 1, z: 1 },
		{ key: "Bananas", value: 9, x: 1, y: 1, z: 1 }
	]
}, {
	key: "Italy",
	values: [
		{ key: "Apples", value: 7, x: 5, y: 5, z: 5 },
		{ key: "Oranges", value: 4, x: 1, y: 1, z: 1 },
		{ key: "Pears", value: 6, x: 1, y: 1, z: 1 },
		{ key: "Bananas", value: 7, x: 1, y: 1, z: 1 }
	]
}, {
	key: "Portugal",
	values: [
		{ key: "Apples", value: 2, x: 6, y: 6, z: 6 },
		{ key: "Oranges", value: 5, x: 1, y: 1, z: 1 },
		{ key: "Pears", value: 10, x: 1, y: 1, z: 1 },
		{ key: "Bananas", value: 4, x: 1, y: 1, z: 1 }
	]
}];

const dataset3 = dataset2[0];

test("Test Summary 1", function(t) {
	let actual = d3Ez.dataTransform(dataset3).summary();
	let expected = {
		dataType: 1,
		rowKey: "UK",
		rowTotal: 6,
		rowKeys: undefined,
		rowTotals: undefined,
		rowTotalsMin: undefined,
		rowTotalsMax: undefined,
		rowValuesKeys: ["key", "value", "x", "y", "z"],
		columnKeys: ["Apples", "Oranges", "Pears", "Bananas"],
		columnTotals: undefined,
		columnTotalsMin: undefined,
		columnTotalsMax: undefined,
		valueMin: -9,
		valueMax: 7,
		valueExtent: [-9, 7],
		valueExtentStacked: [0, 0],
		coordinatesMin: { x: 1, y: 1, z: 1 },
		coordinatesMax: { x: 4, y: 4, z: 4 },
		coordinatesExtent: { x: [1, 4], y: [1, 4], z: [1, 4] },
		maxDecimalPlace: 0,
		thresholds: [-5, -1, 3, 7]
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
		rowKeys: ["Apples", "Oranges", "Pears", "Bananas"],
		rowTotals: { Apples: 25, Oranges: 23, Pears: 32, Bananas: 41 },
		rowTotalsMin: 23,
		rowTotalsMax: 41,
		rowValuesKeys: ["key", "value", "x", "y", "z"],
		columnKeys: ["UK", "France", "Spain", "Germany", "Italy", "Portugal"],
		columnTotals: { UK: 6, France: 24, Spain: 26, Germany: 20, Italy: 24, Portugal: 21 },
		columnTotalsMin: 6,
		columnTotalsMax: 26,
		valueMin: -9,
		valueMax: 18,
		valueExtent: [-9, 18],
		valueExtentStacked: [-9, 41],
		coordinatesMin: { x: 1, y: 1, z: 1 },
		coordinatesMax: { x: 6, y: 6, z: 6 },
		coordinatesExtent: { x: [1, 6], y: [1, 6], z: [1, 6] },
		maxDecimalPlace: 0,
		thresholds: [-2, 5, 11, 18]
	};
	t.deepEqual(actual, expected);

	t.end();
});

test("Test Rotate", function(t) {
	t.deepEqual(d3Ez.dataTransform(dataset1).rotate(), dataset2);
	t.deepEqual(d3Ez.dataTransform(dataset2).rotate(), dataset1);

	t.end();
});
*/

function randomNum() {
	return Math.floor(Math.random() * 10);
}

function randomDataset1() {
	return {
		key: "Fruit",
		values: [
			{ key: "Apples", value: randomNum() },
			{ key: "Oranges", value: randomNum() },
			{ key: "Pears", value: randomNum() },
			{ key: "Bananas", value: randomNum() },
			{ key: "Kiwis", value: randomNum() }
		]
	};
}

function randomDataset2() {
	return [
		{
			key: "Apples",
			values: [
				{ key: "UK", value: randomNum() },
				{ key: "France", value: randomNum() },
				{ key: "Spain", value: randomNum() },
				{ key: "Germany", value: randomNum() },
				{ key: "Italy", value: randomNum() },
				{ key: "Portugal", value: randomNum() }
			]
		}, {
			key: "Oranges",
			values: [
				{ key: "UK", value: randomNum() },
				{ key: "France", value: randomNum() },
				{ key: "Spain", value: randomNum() },
				{ key: "Germany", value: randomNum() },
				{ key: "Italy", value: randomNum() },
				{ key: "Portugal", value: randomNum() }
			]
		}, {
			key: "Pears",
			values: [
				{ key: "UK", value: randomNum() },
				{ key: "France", value: randomNum() },
				{ key: "Spain", value: randomNum() },
				{ key: "Germany", value: randomNum() },
				{ key: "Italy", value: randomNum() },
				{ key: "Portugal", value: randomNum() }
			]
		}, {
			key: "Kiwis",
			values: [
				{ key: "UK", value: randomNum() },
				{ key: "France", value: randomNum() },
				{ key: "Spain", value: randomNum() },
				{ key: "Germany", value: randomNum() },
				{ key: "Italy", value: randomNum() },
				{ key: "Portugal", value: randomNum() }
			]
		}
	];
}

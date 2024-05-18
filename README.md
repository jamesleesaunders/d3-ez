# d3-ez

## D3 Easy Reusable Charts Library

[![npm version](https://badge.fury.io/js/d3-ez.svg)](https://badge.fury.io/js/d3-ez)
[![Known Vulnerabilities](https://snyk.io/test/github/jamesleesaunders/d3-ez/badge.svg?targetFile=package.json)](https://snyk.io/test/github/jamesleesaunders/d3-ez?targetFile=package.json)

**d3-ez** is a library of reusable charts which use [D3.js](http://www.d3js.org/). Inspired by Mike Bostock's
tutorial [Towards Reusable Charts](http://bost.ocks.org/mike/chart/), the aim of the library is to harness the power of
D3, whilst simplifying the process of creating charts and graph making with D3. **d3-ez** makes it easier for people who
are still learning JavaScript or D3 to quickly produce data visualisations with minimal code.

* [Examples](#examples)
* [Getting Started](#getting-started)
* [API Reference](https://jamesleesaunders.github.io/d3-ez/)
* [Charts Types](#chart-types)
* [Data Structures](#data-structures)
* [Download from GitHub](https://github.com/jamesleesaunders/d3-ez)
* [Download from NPM](https://www.npmjs.com/package/d3-ez)

### Examples

Here are a few Observable examples demonstrating some of the d3-ez charts. One of the aims of d3-ez to make it
easier to create visualizations with graphs which are clickable interact with each other, this is done though the use of
D3's dispatch, please see the 'Showcase' link below for example:

* [Bar Chart (Vertical)](https://observablehq.com/@jamesleesaunders/d3-ez)
* [Heat Map (Tabular)](https://observablehq.com/@jamesleesaunders/bishop-currys-royal-wedding-speech-analysis-with-d3-ez)
* [Line Chart](https://observablehq.com/@jamesleesaunders/npm-downloads-counts-with-d3-ez)
* [Rose Chart](https://observablehq.com/@jamesleesaunders/nightingales-rose-chart-with-d3-ez)
* [Legend Component](https://observablehq.com/@jamesleesaunders/what-a-legend-with-d3-ez)
* [Bubble Chart](https://observablehq.com/@jamesleesaunders/hans-rosling-poverty-bubble-chart-with-d3-ez)

### Getting Started

Include d3.js and d3-ez.js and css files in the `<head>` section of your page:

```html

<head>
	 <script src="https://d3js.org/d3.v7.min.js"></script>
	 <script src="https://raw.githack.com/jamesleesaunders/d3-ez/master/dist/d3-ez.min.js"></script>
	 <link rel="stylesheet" type="text/css" href="https://raw.githack.com/jamesleesaunders/d3-ez/master/dist/d3-ez.css"/>
</head>
```

Add a chartholder `<div>` and `<script>` tags to your page `<body>`:

```html

<body>
	 <div id="chartholder"></div>
	 <script></script>
</body>
```

Place the following code between the `<script></script>` tags:

Select chartholder:

```javascript
var chartHolder = d3.select("#chartholder");
```

Generate some [data](#data-structure):

```javascript
var myData = [
	{
		"key": "Fruit",
		"values": [
			{ key: "Apples", value: 9 },
			{ key: "Oranges", value: 3 },
			{ key: "Pears", value: 5 },
			{ key: "Bananas", value: 7 }
		]
	}
];
```

Create chart component:

```javascript
var myChart = d3.ez.chart.barChartVertical()
	.width(750)
	.height(400)
	.colors(["#00C41d", "#FFA500", "#800080", "#FFE714"]);
```

Attach chart and data to the chartholder:

```javascript
chartHolder
	.datum(myData)
	.call(myChart);
```

That's all there is to it! View the page in your browser, and you should see a basic bar chart.

#### Install from NPM

If your project is using ES6 modules you can also import d3-ez, for
example [from NPM](https://www.npmjs.com/package/d3-ez):

```bash
npm install --save d3-ez
```

Then in your project:

```javascript
let d3Ez = require("d3-ez");
```

#### Chart Types

The following charts are currently supported:

- barChartCircular()
- barChartHorizontal()
- barChartVertical()
- bubbleChart()
- candlestickChart()
- donutChart()
- heatMap()
- heatMapRadial()
- lineChart()
- polarAreaChart()
- punchCard()
- radarChart()
- roseChart()

For more information see the [API Reference](https://jamesleesaunders.github.io/d3-ez/).

### Data Structures

At its most basic description, the format of the d3-ez data is a series of key / value pairs. Depending on whether the
chart is a single series or multi series chart the data structure differs slightly.

The data structure is an object with the following structure:

* `key` {string} - The series name
* `values` {array} - An array of objects containing:
		* `key` {string} - The value name
		* `value` {number} - The value
		* `x` {number} - X axis value\*
		* `y` {number} - Y axis value\*

_\*optional, `x` & `y` values are used for cartesian coordinate type graphs such as the bubble chart._

```javascript
var myData = [
	{
		key: "UK",
		values: [
			{ key: "Apples", value: 2 },
			/* ... */
			{ key: "Bananas", value: 3 }
		]
	},
	/* ... */
	{
		key: "France",
		values: [
			{ key: "Apples", value: 5 },
			/* ... */
			{ key: "Bananas", value: 9 }
		]
	}
];
```

### What type of chart should I use?

What type of chart is best for different types of data?

- Bar charts are good for quantitative data.
- Pie charts for good to represent parts of a whole.
- Histograms are good for showing distribution.
- Line charts are good for showing time series data.
- Circular heatmap is good for cyclic data (rolling hours, days, years).
- Radar charts are used to compare two or more items or group features or characteristics.

For more information on which charts are good for different types of data see
the [Data Viz Project](http://datavizproject.com/) or [Data Viz Catalogue](https://datavizcatalogue.com/index.html)

### Alternatives

For reference, here are a few other alternative D3 chart libraries which also follow the D3 reusable components pattern:

- [Britecharts](https://britecharts.github.io/britecharts/)
- [NVD3](http://nvd3.org)
- [C3](http://c3js.org)
- [D3 Plus](http://d3plus.org)
- [ReD3](https://github.com/bugzin/reD3)
- [Miso d3.chart](https://github.com/misoproject/d3.chart)
- [d3fc](https://d3fc.io)

### Credits

* Peter Cook <http://animateddata.co.uk/> For giving permission to use his Radial Bar and Radial Heat Map charts.
* Virgin Media <http://www.virginmedia.co.uk/> For support in development of the Tabular Heat Map.
* Data Viz Project <http://datavizproject.com/> For helping me while deciding on naming of chart types.
* Dip Parmar <https://github.com/DipParmar> For contributing to zooming, radar and horizontal bar charts.
* You may also be interested in the sister project [d3-x3d](https://github.com/jamesleesaunders/d3-x3d) D3 X3D
	Data Visualisation Library.

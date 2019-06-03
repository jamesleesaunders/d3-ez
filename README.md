# d3-ez
## D3 Easy Reusable Charts Library

[![npm version](https://badge.fury.io/js/d3-ez.svg)](https://badge.fury.io/js/d3-ez)
[![Build Status](https://travis-ci.org/jamesleesaunders/d3-ez.svg?branch=master)](https://travis-ci.org/jamesleesaunders/d3-ez)
[![Known Vulnerabilities](https://snyk.io/test/github/jamesleesaunders/d3-ez/badge.svg?targetFile=package.json)](https://snyk.io/test/github/jamesleesaunders/d3-ez?targetFile=package.json)

**d3-ez** is a library of reusable charts which use [D3.js](http://www.d3js.org/). Inspired by Mike Bostock's tutorial [Towards Reusable Charts](http://bost.ocks.org/mike/chart/), the aim of the library is to harness the power of D3, whilst simplifying the process of creating charts and graph making with D3. **d3-ez** makes it easier for people who are still learning JavaScript or D3 to quickly produce data visualisations with minimal code.

* [Examples](#examples)
* [Getting Started](#getting-started)
* [API Reference](https://jamesleesaunders.github.io/d3-ez/)
* [Charts and Components](#components-and-charts)
* [Data Structures](#data-structures)
* [Download from GitHub](https://github.com/jamesleesaunders/d3-ez)
* [Download from NPM](https://www.npmjs.com/package/d3-ez)


### Examples

Here are a few Blocks (Gists) examples demonstrating some of the d3-ez charts. One of the aims of d3-ez to make it easier to create visualizations with graphs which are clickable interact with each other, this is done though the use of D3's dispatch, please see the 'Showcase' link below for example:

* [Bar Chart (Circular)](http://bl.ocks.org/jamesleesaunders/7505129553c74ba04191d40e4fe6e2d7)
* [Bar Chart (Clustered)](http://bl.ocks.org/jamesleesaunders/0d4cf768065e8e7e9bfb)
* [Bar Chart (Stacked)](http://bl.ocks.org/jamesleesaunders/ac5b6134ad7144e8327d)
* [Bar Chart (Vertical)](http://bl.ocks.org/jamesleesaunders/8ba1fb5657d6bc7286be)
* [Bubble Chart](http://bl.ocks.org/jamesleesaunders/e724157a7a387dcc08dd4ba80e48b72f)
* [Candlestick Chart](http://bl.ocks.org/jamesleesaunders/37a5340da620e0f63ea3f2b0da5240a7)
* [Donut Chart](http://bl.ocks.org/jamesleesaunders/8a1b06f3a93f748bb902)
* [Heat Map (Radial)](http://bl.ocks.org/jamesleesaunders/0cbfa9ab9bdce220113f)
* [Heat Map (Tabular)](https://bl.ocks.org/jamesleesaunders/b1c57dc590c78aba5eaae9135e01be0a)
* [Line Chart](http://bl.ocks.org/jamesleesaunders/0f25b04b9b9080b67714)
* [Polar Area Chart](http://bl.ocks.org/jamesleesaunders/36ccc5e130948c098209)
* [Punch Card](http://bl.ocks.org/jamesleesaunders/0215cd9bc81e32fb0c9f)
* [Rose Chart](http://bl.ocks.org/jamesleesaunders/)
* [HTML Table](http://bl.ocks.org/jamesleesaunders/cc4439445d228fc06358)
* [HTML List](http://bl.ocks.org/jamesleesaunders/9f73d0878f3ab9d8c958)
* [Multi Chart Showcase](http://bl.ocks.org/jamesleesaunders/1b42123c808ecea748be)

### Getting Started

Include D3.js and d3-ez js and css files in the `<head>` section of your page:

```html
<head>
   <script src="https://d3js.org/d3.v5.min.js"></script> 
   <script src="https://raw.githack.com/jamesleesaunders/d3-ez/master/build/d3-ez.min.js"></script>
   <link rel="stylesheet" type="text/css" href="https://raw.githack.com/jamesleesaunders/d3-ez/master/build/d3-ez.css" />
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
var myData = {
	"key": "Fruit",
	"values": [
		{ key: "Apples", value: 9 },
		{ key: "Oranges", value: 3 },
		{ key: "Pears", value: 5 },
		{ key: "Bananas", value: 7 }
	]
};
```

Declare the [chart and components](#components-and-charts) component: `chart`, `legend` and `title`:

```javascript
var chart = d3.ez.chart.barChartVertical()
	.colors(['#00c41d', '#ffa500', '#800080', '#ffe714']);

var legend = d3.ez.component.legend()
	.title("Fruit Type");

var title = d3.ez.component.title()
	.mainText("Super Fruit Survey")
	.subText("Which fruit do you like?");
```

Construct chart base from the above components:

```javascript
var myChart = d3.ez.base()
	.width(750)
	.height(400)
	.chart(chart)
	.legend(legend)
	.title(title);
```

Attach chart and data to the chartholder:

```javascript
chartHolder
	.datum(myData)
	.call(myChart);
```

That's all there is to it! View the page in your browser and you should see a basic bar chart.

#### Install from NPM

If your project is using ES6 modules you can also import d3-ez, for example [from NPM](https://www.npmjs.com/package/d3-ez):

```bash
npm install --save d3-ez
```

Then in your project:

```javascript
let d3Ez = require("d3-ez");
```

### Components and Charts

As described above, d3-ez charts are made up of three components: `chart`, `legend` and `title`. 
For more information see the [API Reference](https://jamesleesaunders.github.io/d3-ez/).

#### Chart

The following charts are currently supported:

-   barChartClustered()
-   barChartStacked()
-   barChartHorizontal()
-   barChartVertical()
-   barChartCircular()
-   bubbleChart()
-   donutChart()
-   heatMapTable()
-   heatMapRadial()
-   candleChart()
-   lineChart()
-   polarAreaChart()
-   punchCard()
-   radarChart()
-   roseChart()

All the above charts can also be used stand-alone without having to attach them to a chart base. This can be useful should you just want the main chart but not a legend or title, or you may wish to insert the chart into your own custom D3 project.

```javascript
var myChart = d3.ez.chart.discreteBar()
	.width(750)
	.height(400)
	.colors(['#00c41d', '#FFA500', '#800080', '#ffe714']);

d3.select("#chartholder")
	.datum(data)
	.call(myChart);
```

#### Legend

The title component has the following options:

* title()     The legend title.

```javascript
var legend = d3.ez.component.legend()
	.title("Fruit Type");
```

#### Title

The title component has the following options:

* mainText()   The main title.
* subText()    The sub title.

```javascript
var title = d3.ez.component.title()
	.mainText("Super Fruit Survey")
	.subText("Which fruit do you like?");
```

All of the components above support the following options:

* colors()

### Data Structures

At its most basic description, the format of the d3-ez data is a series of key / value pairs. Depending on whether the chart is a single series or multi series chart the data structure differs slightly.

#### Single Series Data

Used by charts such as a single series bar chart, the data structure is an object with the following structure:
* `key` {string} - The series name
* `values` {array} - An array of objects containing:
  * `key` {string} - The value name
  * `value` {number} - The value
  * `x` {number} - X axis value\*
  * `y` {number} - Y axis value\*
	
_\*optional, `x` & `y` values are used for cartesian coordinate type graphs such as the bubble chart._

```javascript
var myData = {
	key: "UK",
	values: [
		{ key: "Apples", value: 9, x: 1, y: 2, z: 5 },
		/* ... */
		{ key: "Bananas", value: 7, x: 6, y: 3, z: 8 }
	]
};
```

#### Multi Series Data

Used by charts such as the multi series scatter plot, the multi series data structure is simply an array of the single series data objects above.

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

-   Bar charts are good for quantitative data.
-   Pie charts for good to represent parts of a whole.
-   Histograms are good for showing distribution.
-   Line charts are good for showing time series data.
-   Circular heatmap is good for cyclic data (rolling hours, days, years).  

For more information on which charts are good for different types of data see the [Data Viz Project](http://datavizproject.com/) or [Data Viz Catalogue](https://datavizcatalogue.com/index.html)

### Alternatives

For reference, here are a few other alternative D3 chart libraries which also follow the D3 reusable components pattern:

-   [Britecharts](http://eventbrite.github.io/britecharts/)
-   [NVD3](http://nvd3.org)
-   [D4](http://visible.io/index.html)
-   [C3](http://c3js.org)
-   [D3 Plus](http://d3plus.org)
-   [ReD3](https://github.com/bugzin/reD3)
-   [Miso d3.chart](http://misoproject.com/d3-chart/)
-   [d3fc](https://d3fc.io)

### Credits

* Peter Cook <http://animateddata.co.uk/> For giving permission to use his Radial Bar and Radial Heat Map charts.
* Virgin Media <http://www.virginmedia.co.uk/> For support in development of the Tabular Heat Map.
* Data Viz Project <http://datavizproject.com/> For helping me while deciding on naming of chart types.
* Dip Parmar <https://github.com/DipParmar> For contributing to zooming, radar and horizontal bar charts.
* You may also be interested in the sister project [d3-x3dom](https://github.com/jamesleesaunders/d3-x3dom) D3 X3DOM Data Visualisation Library.

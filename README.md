# d3-ez

## D3 Easy Reusable Charts

[![npm version](https://badge.fury.io/js/d3-ez.svg)](https://badge.fury.io/js/d3-ez)
[![Build Status](https://travis-ci.org/jamesleesaunders/d3-ez.svg?branch=master)](https://travis-ci.org/jamesleesaunders/d3-ez)
[![Known Vulnerabilities](https://snyk.io/test/github/jamesleesaunders/d3-ez/badge.svg?targetFile=package.json)](https://snyk.io/test/github/jamesleesaunders/d3-ez?targetFile=package.json)

**d3-ez** is a library of reusable charts which use [D3.js](http://www.d3js.org/). Inspired by Mike Bostock's tutorial [Towards Reusable Charts](http://bost.ocks.org/mike/chart/), the aim of the library is to harness the power of D3, whilst simplifying the process of creating charts and graph making with D3. **d3-ez** makes it easier for people who are still learning JavaScript or D3 to quickly produce data visualisations with minimal code.

### Getting Started

The primary aim of **d3-ez** is to make is quick and easy to generate charts. The following example shows how, with minimal code, you can be up and running with a simple bar chart in no time!

Include the D3.js and d3-ez JS and CSS files in your page header:

```html
<script src="d3.v5.min.js"></script>
<script src="d3-ez.min.js"></script>
<link rel="stylesheet" type="text/css" href="d3-ez.css" />
```

Add a 'chartholder' DIV to your page body:

```html
<div id="chartholder"></div>
```

Generate some data:
See the [Data Structure](#data-structure) section for more details.

```javascript
var data = {
	"key": "Fruit",
	"values": [
		{"key": "Apples", "value": 9},
		{"key": "Oranges", "value": 3},
		{"key": "Grapes", "value": 5},
		{"key": "Bananas", "value": 7}
	]
};
```

Configure chart components, 'chart', 'legend' & 'title':
See the [Chart Components](#chart-components) section for more details.

```javascript
var title = d3.ez.component.title()
	.mainText("Super Fruit Survey")
	.subText("Which fruit do you like?");

var chart = d3.ez.chart.barChartVertical()
	.colors(['#00c41d', '#ffa500', '#800080', '#ffe714']);

var legend = d3.ez.component.legend()
	.title("Fruit Type");
```

Construct chart base from the above components:
See the [Chart Base](#chart-base) for more details.

```javascript
var myChart = d3.ez()
	.width(750)
	.height(400)
	.chart(chart)
	.legend(legend)
	.title(title);
```

Attach data and chart to 'chartholder' DIV:

```javascript
d3.select("#chartholder")
	.datum(data)
	.call(myChart);
```

### Chart Base

The chart base has 3 components:

-   Title
-   Legend
-   Chart

### Chart Components

As described in the [Chart Base](#chart-base) section a **d3-ez** chart is made up of 3 components:

**Title**

The title component has the following options:

-   mainText()   The main title.
-   subText()    The sub title.
    Example:

```javascript
var title = d3.ez.component.title()
	.mainText("Super Fruit Survey")
	.subText("Which fruit do you like?");
```

**Legend**

The title component has the following options:

-   title()     The legend title.

```javascript
var legend = d3.ez.component.legend()
	.title("Fruit Type");
```

**Chart**

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

All of the above support the following options:

-   colors()

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

### Data Structure

The format of the d3-ez data must be in key / value pairs.

### Examples

Here are a few Blocks (Gists) examples demonstrating some of the d3-ez charts. One of the aims of **d3-ez** to make it easier to create visualizations with graphs which are clickable interact with each other, this is done though the use of D3's dispatch, please see the 'Showcase' link below for example:

-   [Bar Chart (Circular)](http://bl.ocks.org/jamesleesaunders/7505129553c74ba04191d40e4fe6e2d7)
-   [Bar Chart (Clustered)](http://bl.ocks.org/jamesleesaunders/0d4cf768065e8e7e9bfb)
-   [Bar Chart (Stacked)](http://bl.ocks.org/jamesleesaunders/ac5b6134ad7144e8327d)
-   [Bar Chart (Vertical)](http://bl.ocks.org/jamesleesaunders/8ba1fb5657d6bc7286be)
-   [Bubble Chart](http://bl.ocks.org/jamesleesaunders/e724157a7a387dcc08dd4ba80e48b72f)
-   [Candlestick Chart](http://bl.ocks.org/jamesleesaunders/37a5340da620e0f63ea3f2b0da5240a7)
-   [Donut Chart](http://bl.ocks.org/jamesleesaunders/8a1b06f3a93f748bb902)
-   [Heat Map (Radial)](http://bl.ocks.org/jamesleesaunders/0cbfa9ab9bdce220113f)
-   [Heat Map (Tabular)](https://bl.ocks.org/jamesleesaunders/b1c57dc590c78aba5eaae9135e01be0a)
-   [Line Chart](http://bl.ocks.org/jamesleesaunders/0f25b04b9b9080b67714)
-   [Polar Area Chart](http://bl.ocks.org/jamesleesaunders/36ccc5e130948c098209)
-   [Punch Card](http://bl.ocks.org/jamesleesaunders/0215cd9bc81e32fb0c9f)
-   [Rose Chart](http://bl.ocks.org/jamesleesaunders/)
-   [HTML Table](http://bl.ocks.org/jamesleesaunders/cc4439445d228fc06358)
-   [HTML List](http://bl.ocks.org/jamesleesaunders/9f73d0878f3ab9d8c958)
-   [Multi Chart Showcase](http://bl.ocks.org/jamesleesaunders/1b42123c808ecea748be)

### What type of chart should I use?

What type of chart is best for different types of data?

-   Bar charts are good for quantitative data.
-   Pie charts for good to represent parts of a whole.
-   Histograms are good for showing distribution.
-   Line charts are good for showing time series data.
-   Circular heatmap is good for cyclic data (rolling hours, days, years).  

For more information on which charts are good for different types of data see the [Data Viz Project](http://datavizproject.com/) or [Data Viz Catalogue](https://datavizcatalogue.com/index.html)

### Alternatives to d3-ez

For reference here are a few other alternative D3 chart libraries which also follow the D3 reusable components pattern:

-   [Britecharts](http://eventbrite.github.io/britecharts/)
-   [NVD3](http://nvd3.org)
-   [D4](http://visible.io/index.html)
-   [C3](http://c3js.org)
-   [D3 Plus](http://d3plus.org)
-   [ReD3](https://github.com/bugzin/reD3)
-   [Miso d3.chart](http://misoproject.com/d3-chart/)
-   [d3fc](https://d3fc.io)
-   [Docs](http://jamesleesaunders.github.io/d3-ez/)

### Credits

-   Peter Cook <http://animateddata.co.uk/> For giving permission to use his Radial Bar and Radial Heat Map charts.
-   Virgin Media <http://www.virginmedia.co.uk/> For support in development of the Tabular Heat Map.
-   Data Viz Project <http://datavizproject.com/> For helping me while deciding on naming of chart types.
-   Dip Parmar <https://github.com/DipParmar> For contributing to zooming, radar and horizontal bar charts.

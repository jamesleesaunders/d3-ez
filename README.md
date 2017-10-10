# d3-ez
## D3 Easy Reusable Charts

**d3-ez** is a library of reusable charts which use [D3v4](http://www.d3js.org/). Inspired by Mike Bostock's tutorial [Towards Reusable Charts](http://bost.ocks.org/mike/chart/), the aim of the library is to harness the power of D3, whilst simplifying the process of creating charts and graph making with D3. **d3-ez** makes it easier for people who are still learning JavaScript or D3 to quickly produce data visualizations with minimal code.

### Getting Started

The primary aim of **d3-ez** is to make is quick and easy to generate charts. The following example shows how, with minumal code, you can be up and running with a simple bar chart in no time!

Include the D3v4 and d3-ez JS and CSS files in your page header:
```html
<script src="d3.v4.min.js"></script>
<script src="d3-ez.min.js"></script>
<link rel="stylesheet" type="text/css" href="d3-ez.css" />
```

Add a 'chartholder' DIV to your page body:
```html
<div id="chartholder"></div>
```

Generate some data:
See [Data Structure](#data-structure) section for more details.
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

Configure chart components, 'chart', 'legend' & 'title'.
See the [Chart Components](#chart-components) for more details:
```javascript
var title = d3.ez.component.title()
	.mainText("Super Fruit Survey")
	.subText("Which fruit do you like?");

var chart = d3.ez.chart.discreteBar()
	.colors(['#00c41d', '#FFA500', '#800080', '#ffe714']);

var legend = d3.ez.component.legend()
	.title("Fruit Type");

```

Construct chart base from the above components:
See the [Chart Base](#chart-base) for more details.
```javascript
var myChart = d3.ez.chart()
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
* Title
* Legend
* Chart

### Chart Components

As described in the [Chart Base](#chart-base) section a d3-ez chart is made up of 3 components:

**Title**

The title component has the following options:
* mainText()   The main title.
* subText()    The sub title.
Example:
```javascript
var title = d3.ez.component.title()
	.mainText("Super Fruit Survey")
	.subText("Which fruit do you like?");
```

**Legend**

The title component has the following options:
* title()     The legend title.
```javascript
var legend = d3.ez.component.legend()
	.title("Fruit Type");
```

**Chart**

The following charts are currently supported:
* circularHeat()
* discreteBar()
* donut()
* groupedBar()
* multiSeriesLine
* punchcard()
* radialBar()
* tabularHeat()

All of the above support the following options:
* colors()

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
* [Discrete Bar Chart](http://bl.ocks.org/jamesleesaunders/8ba1fb5657d6bc7286be)
* [Donut Chart](http://bl.ocks.org/jamesleesaunders/8a1b06f3a93f748bb902)
* [Grouped Bar Chart (Clustered)](http://bl.ocks.org/jamesleesaunders/0d4cf768065e8e7e9bfb)
* [Grouped Bar Chart (Stacked)](http://bl.ocks.org/jamesleesaunders/ac5b6134ad7144e8327d)
* [Radial Bar Chart](http://bl.ocks.org/jamesleesaunders/36ccc5e130948c098209)
* [Multi Series Line Chart](http://bl.ocks.org/jamesleesaunders/0f25b04b9b9080b67714)
* [Punchcard](http://bl.ocks.org/jamesleesaunders/0215cd9bc81e32fb0c9f)
* [Circular Heat Chart](http://bl.ocks.org/jamesleesaunders/0cbfa9ab9bdce220113f)
* [Tabular Heat Chart](https://bl.ocks.org/jamesleesaunders/b1c57dc590c78aba5eaae9135e01be0a)
* [HTML Table](http://bl.ocks.org/jamesleesaunders/cc4439445d228fc06358)
* [HTML List](http://bl.ocks.org/jamesleesaunders/9f73d0878f3ab9d8c958)
* [Multi Chart Showcase](http://bl.ocks.org/jamesleesaunders/1b42123c808ecea748be)

### What type of chart should I use?
What type of chart is best for different types of data?
* Bar Charts are good for quantitive data.
* Pie Charts for good to represent parts of a whole.
* Histograms are good for showing distribution.

### Alternatives to d3-ez
For reference here are a few other alternative D3 chart libraries which also follow the D3 reusable components pattern:
* [Britecharts](http://eventbrite.github.io/britecharts/)
* [NVD3](http://nvd3.org)
* [D4](http://visible.io/index.html)
* [C3](http://c3js.org)
* [D3 Plus](http://d3plus.org)
* [ReD3](https://github.com/bugzin/reD3)
* [Miso d3.chart](http://misoproject.com/d3-chart/)

### Credits
* Peter Cook http://animateddata.co.uk/ For giving permission to use his Radial Bar and Radial Heat Map charts.
* Virgin Media http://www.virginmedia.co.uk/ For support in development of the Tabular Heat Map.

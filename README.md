# d3-ez
## D3 Easy Reusable Charts

**d3-ez** is a library of reusable charts which use [D3v4](http://www.d3js.org/). Inspired by Mike Bostock's tutorial [Towards Reusable Charts](http://bost.ocks.org/mike/chart/), the aim of the library is to harness the power of D3, whilst simplifying the process of creating charts and graph making with D3. **d3-ez** makes it easier for people who are still learning JavaScript or D3 to quickly produce data visualizations with minimal code.

### Getting Started

Include the following files in your header:
```html
<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="scripts/d3-ez.js"></script>
```

Add a 'chartholder' element to your page body:
```html
<div id="chartholder"></div>
```

Generate some data see the [Data Format](#data-format) section for more details:
```javascript
var data = {
	"key": "Fruit",
	"values": [
		{"key": "Apples", "value": 6},
		{"key": "Pears", "value": 3},
		{"key": "Grapes", "value": 4},
		{"key": "Banana", "value": 1}
	]
};
```

Configure chart components:
```javascript
var chart = d3.ez.chart.discreteBar().colors(d3.ez.colors.categorical(1));
var legend = d3.ez.component.legend().title("Fruit");
var title = d3.ez.component.title().mainText("Fruit Survey").subText("Which fruit do you like?");
```

Construct chart from components:
```javascript
var myChart = d3.ez.chart()
	.width(750)
	.height(400)
	.chart(chart)
	.legend(legend)
	.title(title);
```

Attach data and chart to 'chartholder' element:
```javascript
d3.select("#chartholder")
	.datum(data)
	.call(myChart);
```

### Data Format

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

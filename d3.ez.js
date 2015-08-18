/**
 * D3.EZ
 * 
 * @version 1.4.2
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2015 James Saunders
 * @license GPLv3
 */

d3.ez = {
    version: "1.4.2"
};

/**
 * Colour Palettes
 * 
 */
d3.ez.colors = {
	// Categorical:
	// Stephen Few’s Book, Show Me the Numbers
	cat1: ['#5DA5DA', '#FAA43A', '#60BD68', '#F17CB0', '#B2912F', '#B276B2', '#DECF3F', '#F15854', '#4D4D4D'],
	// www.google.com/design/spec/style/color.html#color-color-palette
	cat2: ['#F44336', '#9C27B0', '#3F51B5', '#03A9F4', '#009688', '#8BC34A', '#FFEB3B', '#FF9800', '#795548'],
	// brand.linkedin.com/visual-identity/color-palettes
	cat3: ['#00A0DC', '#8C68CB', '#EC4339', '#F47B16', '#00AEB3', '#EFB920', '#ED4795', '#7CB82F', '#86898C']

	// Sequential:

	// Diverging:

};

/**
 * Discrete Bar Chart
 * 
 * @example
 * var myChart = d3.ez.discreteBarChart()
 * 	.width(400)
 * 	.height(300)
 * 	.transition({ease: "bounce", duration: 1500})
 * 	.colors(d3.scale.category10().range());
 * d3.select("#chartholder")
 * 	.datum(data)
 * 	.call(myChart);
 */
d3.ez.discreteBarChart = function module() {
	// SVG container (populated by 'my' function below) 
	var svg;
	
	// Default settings (some configurable via Settersbelow)
	var width             = 400;
	var height            = 300;
	var margin            = {top: 20, right: 20, bottom: 20, left: 40};
	var transition        = {ease: "bounce", duration: 500};
	var colors            = d3.ez.colors.cat3;
	var gap               = 0;
	var classed           = "discreteBarChart";
	
	var dispatch   = d3.dispatch("customHover");
	
	function my(selection) {
		selection.each(function(data) {
			var chartW = width - margin.left - margin.right;
			var chartH = height - margin.top - margin.bottom;
			
			// Cut the data in different ways....
			var yAxisLabel = d3.values(data)[0];
			var maxValue = d3.max(data.values, function(d) { return d.value;} );
			var categories = d3.values(data)[1].map(function(d) { return d.key; });

			// X & Y Scales
			var xScale = d3.scale.ordinal()
				.domain(categories)
				.rangeRoundBands([0, chartW], 0.1);

			var yScale = d3.scale.linear()
				.domain([0, maxValue])
				.range([chartH, 0]);

			// X & Y Axis
			var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom");

			var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left");
			
			// Colour Scale
			var colorScale = d3.scale.ordinal()
				.domain(categories)
				.range(colors);

			// Create SVG element (if it does not exist already)
			if (!svg) {
				svg = d3.select(this)
					.append("svg")
					.classed("d3ez", true)
					.classed(classed, true);

				var container = svg.append("g").classed("container", true);
				container.append("g").classed("chart", true);
				container.append("g").classed("x-axis axis", true);
				container.append("g").classed("y-axis axis", true);
				
			}

			// Update the outer dimensions
			svg.transition().attr({width: width, height: height});
			
			// Update the inner dimensions.
			svg.select(".container")
				.attr({transform: "translate(" + margin.left + "," + margin.top + ")"});			
			
			// Add X & Y axis to the chart
			svg.select(".x-axis")
				.attr({transform: "translate(0," + chartH + ")"})
				.call(xAxis);

			svg.select(".y-axis")	
				.call(yAxis);
			
			ylabel = svg.select(".y-axis")
				.selectAll('.y-label')
				.data([data.key]);
			ylabel.enter()
				.append("text")
				.classed("y-label", true)
				.attr("transform", "rotate(-90)")
				.attr("y", -35)
				.attr("dy", ".71em")
				.style("text-anchor", "end");
			ylabel.transition()
				.text(function(d) { return (d);} );
			
			// Add columns to the chart
			var gapSize = xScale.rangeBand() / 100 * gap;
			var barW = xScale.rangeBand() - gapSize;

			var bars = svg.select(".chart")
				.selectAll(".bar")
				.data(data.values);
						
			bars.enter().append("rect")
				.attr("class", function(d) { return d.key + ' bar'; })
				.attr("fill", function(d) { return colorScale(d.key); })
				.attr({
					width: barW,
					x: function(d, i) { return xScale(d.key) + gapSize / 2; },
					y: chartH,
					height: 0
				})
				.on("mouseover", dispatch.customHover);
						
			bars.transition()
				.ease(transition.ease)
				.duration(transition.duration)				
				.attr({
					width: barW,
					x: function(d, i) { return xScale(d.key) + gapSize / 2; },				
					y: function(d, i) { return yScale(d.value); },
					height: function(d, i) { return chartH - yScale(d.value); }
				});

			bars.exit()
				.transition()
				.style({opacity: 0})
				.remove();	
			
		});
	}
	
	// Configuration Getters & Setters
	my.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};
			
	my.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};
	
	my.colors = function(_) {
		if (!arguments.length) return colors;
		colors = _;
		return this;
	};
	
	my.transition = function(_) {
		if (!arguments.length) return transition;
		transition = _;
		return this;
	};		
			
	d3.rebind(my, dispatch, "on");
	return my;
};

/**
 * Grouped Bar Chart
 * 
 * @example
 * var myChart = d3.ez.groupedBarChart()
 * 	.width(400)
 * 	.height(300)
 * 	.transition({ease: "bounce", duration: 1500})
 * 	.groupType('stacked');
 * d3.select("#chartholder")
 * 	.datum(data)
 * 	.call(myChart);
 */
d3.ez.groupedBarChart = function module() {
	// SVG container (populated by 'my' function below) 
	var svg;
	
	// Default settings (some configurable via Setters below)
	var width             = 400;
	var height            = 300;
	var margin            = {top: 20, right: 70, bottom: 20, left: 40};
	var transition        = {ease: "bounce", duration: 500};
	var colors            = d3.ez.colors.cat3;
	var gap               = 0;
	var yAxisLabel        = null;
	var groupType         = "clustered";
	var classed           = "groupedBarChart";	
	
	var dispatch   = d3.dispatch("customHover");	
	
	function my(selection) {
		selection.each(function(data) {
			var chartW = width - margin.left - margin.right;
			var chartH = height - margin.top - margin.bottom;
			
			// Cut the data in different ways....
			// Group and Category Names
			var groupNames = data.map(function(d) { return d.key; });
			
			var categoryNames = [];
			data.map(function(d) { return d.values; })[0].forEach(function(d, i) {
				categoryNames[i] = d.key;
			});			
		
			// Group and Category Totals
			var categoryTotals = [];
			var groupTotals = [];
			var maxValue = 0;
			d3.map(data).values().forEach(function(d) {
				grp = d.key;
				d.values.forEach(function(d) {
					categoryTotals[d.key] = (typeof(categoryTotals[d.key]) === 'undefined' ? 0 : categoryTotals[d.key]);
					categoryTotals[d.key] += d.value;		
					groupTotals[grp] = (typeof(groupTotals[grp]) === 'undefined' ? 0 : groupTotals[grp]);
					groupTotals[grp] += d.value;
					maxValue = (d.value > maxValue ? d.value : maxValue);
				});
			});
			var maxGroupTotal = d3.max(d3.values(groupTotals));
			
			// X & Y Scales
			var xScale = d3.scale.ordinal()
				.rangeRoundBands([0, chartW], .1)
				.domain(groupNames);
						
			var yScale = d3.scale.linear()
	    		.range([chartH, 0])
	    		.domain([0, (groupType == 'stacked' ? maxGroupTotal : maxValue)]);
			
			// X & Y Axis
			var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom");
			
			var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left");
			
			// Colour Scale
			var colorScale = d3.scale.ordinal()
				.range(colors)
				.domain(categoryNames);
			
			// Create SVG element (if it does not exist already)			
			if (!svg) {
				svg = d3.select(this)
					.append("svg")
					.classed("d3ez", true)
					.classed(classed, true);					
				
				var container = svg.append("g")
					.classed("container", true);
				
				container.append("g")
					.classed("chart", true);
				
				container.append("g")
					.classed("x-axis axis", true);
				
				container.append("g")
					.classed("y-axis axis", true)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", -35)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text(yAxisLabel);
			}			

			// Update the outer dimensions
			svg.transition().attr({width: width, height: height});
			
			// Update the inner dimensions
			svg.select(".container")
				.attr({transform: "translate(" + margin.left + "," + margin.top + ")"});			
			
			// Add X & Y axis to the chart
			svg.select(".x-axis")
				.attr({transform: "translate(0," + chartH + ")"})
				.call(xAxis);

			svg.select(".y-axis")	
				.call(yAxis);
			
			// Create Bar Group	
			var barGroup = svg.select(".chart")		
				.selectAll(".barGroup")
				.data(data);
			
			barGroup.enter()
				.append("g")
				.attr("class", "barGroup")
				.attr("transform", function(d, i) { return "translate(" + xScale(d.key) + ", 0)"; })
				.on("mouseover", dispatch.customHover);

			// Add Bars to Group
			var bars = barGroup.selectAll(".bar")
				.data(function(d) { 
					series = [];
					var y0 = 0;
					d3.map(d.values).values().forEach(function(d, i) { 
						series[i] = {name: d.key, value: d.value, y0: y0, y1: y0 + d.value};
						y0 += d.value;
					});
					return series;
				});
			
			if (groupType == 'stacked') {
				
				var gapSize = xScale.rangeBand() / 100 * gap;
				var barW = xScale.rangeBand() - gapSize;
				
				bars.enter()
					.append("rect")
					.classed("bar", true)
					.attr("class", function(d) { return d.name + ' bar'; })
					.attr({
						width: barW,
						x: 0,
						y: chartH,		
						height: 0
					})
					.attr("fill", function(d) { return colorScale(d.name); });

				bars.transition()
					.ease(transition.ease)
					.duration(transition.duration)				
					.attr({
						width: barW,
						x: 0,
						y: function(d) {  return yScale(d.y1); },				
						height: function(d) { return yScale(d.y0) - yScale(d.y1); }
					})
					.attr("fill", function(d) { return colorScale(d.name); });

				bars.exit()
					.transition()
					.style({opacity: 0})
					.remove();
				
			} else if (groupType == 'clustered') {
				
				var x1 = d3.scale.ordinal()
					.rangeRoundBands([0, xScale.rangeBand()])
					.domain(categoryNames);
				
				bars.enter()
					.append("rect")
					.classed("bar", true)
					.attr({
						width: x1.rangeBand(),
						x: function(d) { return x1(d.name); },
						y: chartH,	
						height: 0
					})				
					.attr("fill", function(d) {
					return colorScale(d.name); });

				bars.transition()
					.ease(transition.ease)
					.duration(transition.duration)				
					.attr({
						width: x1.rangeBand(),
						x: function(d) { return x1(d.name); },
						y: function(d) { return yScale(d.value); },	
						height: function(d) { return chartH - yScale(d.value); }
					})
					.attr("fill", function(d) { return colorScale(d.name); });

				bars.exit()
					.transition()
					.style({opacity: 0})
					.remove();
			}
			
			// Add legend to chart
			var legend = svg.selectAll(".legend")
				.data(categoryNames.slice().reverse())
				.enter()
				.append("g")
				.attr("class", "legend")
				.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

			legend.append("rect")
				.attr("x", width - 18)
				.attr("width", 18)
				.attr("height", 18)
				.style("fill", colorScale);

			legend.append("text")
				.attr("x", width - 24)
				.attr("y", 9)
				.attr("dy", ".35em")
				.style("text-anchor", "end")
				.text(function(d) { return d; });
			
		});
	}
	
	// Configuration Getters & Setters
	my.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	my.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};
	
	my.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
		return this;
	};

	my.yAxisLabel = function(_) {
		if (!arguments.length) return yAxisLabel;
		yAxisLabel = _;
		return this;
	};
	
	my.groupType = function(_) {
		if (!arguments.length) return groupType;
		groupType = _;
		return this;
	};
	
	my.transition = function(_) {
		if (!arguments.length) return transition;
		transition = _;
		return this;
	};		

	my.colors = function(_) {
		if (!arguments.length) return colors;
		colors = _;
		return this;
	};
	
	d3.rebind(my, dispatch, "on");	
	return my;	
};

/**
 * Punchcard
 * 
 * @example
 * var myChart = d3.ez.punchCard()
 * 	.width(600)
 * 	.height(350)
 * 	.color("green")
 * 	.minRadius(5)
 * 	.maxRadius(19)
 * 	.useGlobalScale(true);
 * d3.select("#chartholder")
 * 	.datum(data)
 * 	.call(myChart);
 */
d3.ez.punchCard = function module() {
	// SVG container (populated by 'my' function below) 
	var svg;
	
	// Default settings (some configurable via Setters below)
	var width             = 400;
	var height            = 300;
	var margin            = {top: 20, right: 80, bottom: 20, left: 20};
	var maxRadius         = 9;
	var minRadius         = 2;
	var color             = "steelblue";
	var formatTick        = d3.format("0000");
	var useGlobalScale    = true;
	var classed           = "punchCard";	
	
	var dispatch   = d3.dispatch("customHover");

	function my(selection) {
		selection.each(function(data) {
			var chartW = width - margin.left - margin.right;
			var chartH = height - margin.top - margin.bottom;
			
			function mouseover(d) {
				var g = d3.select(this).node().parentNode;
				d3.select(g).selectAll("circle").style("display", "none");
				d3.select(g).selectAll("text.value").style("display", "block");
				dispatch.customHover(d);
			}

			function mouseout(d) {
				var g = d3.select(this).node().parentNode;
				d3.select(g).selectAll("circle").style("display","block");
				d3.select(g).selectAll("text.value").style("display","none");
			}			
			
			// Cut the data in different ways....
		    var allValues = [];
		    var rowCount = 0;
			data.forEach(function(d) {
				allValues = allValues.concat(d.values);
				rowCount++;
			});

			//var categoryNames = d3.extent(allValues, function(d) { return d['key']; });
			var categoryNames = [];
			var categoryTotals = [];
			var maxValue = 0;
			
			data.map(function(d) { return d.values; })[0].forEach(function(d, i) {
				categoryNames[i] = d.key;
			});	
			
			var rowHeight = chartH / rowCount;
			// var rowHeight = (maxRadius * 2) + 2;
			var valDomain = d3.extent(allValues, function(d) { return d['value']; });			
			
			// X (& Y) Scales
			var xScale = d3.scale.ordinal()
				.domain(categoryNames)
				.rangeRoundBands([0, chartW], 1);

			// X (& Y) Axis
			var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom")
				.ticks(data[0].values.length);
				//.tickFormat(formatTick);
			
			// Colour Scale
			var colorScale = d3.scale.linear()
				.domain(d3.extent(allValues, function(d) {return d['value'];}))
				.range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);
			
			// Create SVG element (if it does not exist already)
			if (!svg) {
				svg = d3.select(this)
					.append("svg")
					.classed("d3ez", true)
					.classed(classed, true);	

				var container = svg.append("g").classed("container", true);
				container.append("g").classed("chart", true);
				container.append("g").classed("x-axis axis", true);
			}

			// Update the outer dimensions
			svg.transition().attr({width: width, height: height});			
			
			// Update the inner dimensions
			svg.select(".container")
				.attr({transform: "translate(" + margin.left + "," + margin.top + ")"});			
			
			// Add X (& Y) axis to the chart
			svg.select(".x-axis")
				.attr({transform: "translate(0," + chartH + ")"})
				.call(xAxis);

			for (var j = 0; j < data.length; j++) {
				var rDomain = useGlobalScale ? valDomain : [0, d3.max(data[j]['values'], function(d) { return d['value']; })];
				var rScale = d3.scale.linear()
					.domain(rDomain)
					.range([minRadius, maxRadius]);
				
				var g = svg.select(".chart").append("g");

				var circles = g.selectAll("circle")
					.data(data[j]['values'])
					.enter()
					.append("circle")
					.attr("cx", function(d, i) { return xScale(d['key']); })
					.attr("cy", (chartH - rowHeight * 2) - (j * rowHeight) + rowHeight)
					.attr("r", function(d) { return rScale(d['value']); })
					.style("fill", function(d) { return colorScale(d['value']) });				

				var text = g.selectAll("text")
					.data(data[j]['values'])
					.enter()
					.append("text")
					.attr("y", (chartH - rowHeight * 2) - (j * rowHeight) + (rowHeight + 5))
					.attr("x", function(d, i) { return xScale(d['key']) - 4; })
					.attr("class", "value")
					.text(function(d) { return d['value']; })
					.style("fill", function(d) { return colorScale(d['value']) })
					.style("display", "none");

				g.append("text")
					.attr("y", (chartH - rowHeight * 2) - ( j * rowHeight) + (rowHeight + 5))
					.attr("x", chartW + rowHeight)
					.attr("class", "label")
					.text(data[j]['key'])
					.style("fill", function(d) { return color })
					.style("text-anchor", "end")
					.on("mouseover", mouseover)
					.on("mouseout", mouseout);
			}
		
		});
	};

	// Configuration Getters & Setters
	my.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return my;
	};

	my.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return my;
	};
	
	my.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
		return this;
	};
	
	my.minRadius = function(_) {
		if (!arguments.length) return minRadius;
		minRadius = _;
		return my;
	};

	my.maxRadius = function(_) {
		if (!arguments.length) return maxRadius;
		maxRadius = _;
		rowHeight = (maxRadius*2)+2;
		return my;
	};

	my.color = function(_) {
		if (!arguments.length) return color;
		color = _;
		return my;
	};

	my.useGlobalScale = function(_) {
		if (!arguments.length) return useGlobalScale;
		useGlobalScale = _;
		return my;
	};
	
	d3.rebind(my, dispatch, "on");	
	return my;
};

/** 
 * Time Series Chart
 * 
 * @example
 * var formatDate = d3.time.format("%b %Y");
 * var myChart = d3.ez.timeSeriesChart()
 * 	.x(function(d) { return formatDate.parse(d.date); })
 * 	.y(function(d) { return +d.price; })
 * 	.width(600)
 * 	.height(350);
 * d3.select("#chartholder")
 * 	.datum(data)
 * 	.call(myChart);
 */
d3.ez.timeSeriesChart = function module() {
	// SVG container (populated by 'my' function below) 
	var svg;	
	
	// Default settings (some configurable via Setters below)
	var width             = 400;
	var height            = 300;
	var margin            = {top: 20, right: 20, bottom: 20, left: 40};
	var color             = 'steelblue';
	var xValue            = function(d) { return d[0]; };
	var yValue            = function(d) { return d[1]; };
	var classed           = "timeSeriesChart";

	function my(selection) {
		selection.each(function(data) {
			var chartW = width - margin.left - margin.right;
			var chartH = height - margin.top - margin.bottom;

			// Convert data to standard representation greedily;
			// this is needed for nondeterministic accessors.
			data = data.map(function(d, i) {
				return [xValue.call(data, d, i), yValue.call(data, d, i)];
			});

			// X & Y Scales
			var xScale = d3.time.scale()	
				.domain(d3.extent(data, function(d) { return d[0]; }))
				.range([0, chartW]);
			
			var yScale = d3.scale.linear()
				.domain([0, d3.max(data, function(d) { return d[1]; })])
				.range([chartH, 0]);

			// X & Y Axis
			var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom")
				.tickSize(6, 0);		

			var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left")
				.tickSize(6, 6);
			
			// Setup the Line and Area
			var area = d3.svg.area()
				.x(function(d) { return xScale(d[0]); })
				.y1(function(d) { return yScale(d[1]); });
			
			var line = d3.svg.line()
				.x(function(d) { return xScale(d[0]); })
				.y(function(d) { return yScale(d[1]); });	
			
			// Create SVG element (if it does not exist already)
			if (!svg) {
				svg = d3.select(this)
					.append("svg")
					.classed("d3ez", true)
					.classed(classed, true);

				var container = svg.append("g").classed("container-group", true);				
				container.append("path").classed("chart-area-path", true);
				container.append("path").classed("chart-line-path", true);
				container.append("g").classed("x-axis-group axis", true);
				container.append("g").classed("y-axis-group axis", true);
			}

			// Update the outer dimensions
			svg.attr("width", width)
				.attr("height", height);

			// Update the inner dimensions
			var g = svg.select("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// Add X & Y axis to the chart
			g.select(".x-axis-group.axis")
				.attr("transform", "translate(0," + yScale.range()[0] + ")")
				.call(xAxis);

			g.select(".y-axis-group.axis")
				.call(yAxis);			
			
			// Update the area path
			g.select(".chart-area-path")
				.data([data])
				.attr("d", area.y0(yScale.range()[0]))
				.attr("fill", color);

			// Update the line path
			g.select(".chart-line-path")
				.data([data])
				.attr("d", line)
				.attr("fill", "none");
		});
	}
	
	// Configuration Getters & Setters
	my.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	my.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	my.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
		return this;
	};	

	my.x = function(_) {
		if (!arguments.length) return xValue;
		xValue = _;
		return this;
	};

	my.y = function(_) {
		if (!arguments.length) return yValue;
		yValue = _;
		return this;
	};
	
	my.color = function(_) {
		if (!arguments.length) return color;
		color = _;
		return this;
	};	
	
	return my;
};

/** 
 * Donut Chart
 * 
 * @example
 * var myChart = d3.ez.donutChart()
 * 	.width(400)
 * 	.height(300)
 * 	.radius(200)
 * 	.innerRadius(50);
 * d3.select("#chartholder")
 * 	.datum(data)
 * 	.call(myChart);
 */
d3.ez.donutChart = function module() {
	// SVG container (populated by 'my' function below) 
	var svg;
	
	// Default settings (some configurable via Setters below)	
	var width             = 400;
	var height            = 300;
	var margin            = {top: 20, right: 90, bottom: 20, left: 90};
	var transition        = {ease: "cubic", duration: 300};
	var radius            = d3.min([(width - (margin.right + margin.left)), (height - (margin.top + margin.bottom))]) / 2;
	var innerRadius       = 70;
	var colors            = d3.ez.colors.cat3;
	var classed           = "donutChart";
	
	// To sort...
	var strokeColor       = "#FFF";
	var strokeWidth       = 4;
	var enableLabels      = true;
	var labelGroupOffset  = 20;
	var labelColor        = "#333";
	var labelNameOffset   = 0;
	var tickColor         = "#333";
	var tickWidth         = 1;
	var tickOffset        = [0, 0, 2, 8]; // [x1, x2, y1, y2]
	var labelValueOffset  = 16;

	var dispatch = d3.dispatch("customHover");

	function my(selection) {
		selection.each(function(data) {
			
			var values = d3.values(data)[1].map(function(d) { return d.value; });
			var categoryNames = d3.values(data)[1].map(function(d) { return d.key; });
			
			// Colour Scale
			var colorScale = d3.scale.ordinal()
				.range(colors)
				.domain(categoryNames);
			
			var pie = d3.layout.pie()
				.sort(null);
			
			var arc = d3.svg.arc()
				.innerRadius(innerRadius)
				.outerRadius(radius);
			
			var outerArc = d3.svg.arc()
				.innerRadius(radius * 0.9)
				.outerRadius(radius * 0.9);
			
			function arcTween(d) {
				var i = d3.interpolate(this._current, d);
				this._current = i(0);
				return function(t) {
					return arc(i(t));
				};
			}
			
			function midAngle(d) {
				return d.startAngle + (d.endAngle - d.startAngle) / 2;
			}
			
			var key = function(d, i) { return data.values[i].key; };
				
			// Create SVG element (if it does not exist already)
			svg = d3.select(this).select("svg > g");
			if (svg.empty()) {
				var svg = d3.select(this)
					.append("svg")
					.classed("d3ez", true)
					.classed(classed, true);
				svg.attr("width", width).attr("height", height)
				svg.append("g")
					.attr("class", "slices")
					.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
				svg.append("g")
					.attr("class", "labels")
					.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
				svg.append("g")
					.attr("class", "lines")
					.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");					
			}
			
			// Slices
			var slices = d3.select(".slices")
				.selectAll("path.slice")
				.data(pie(values));
			
			slices.enter()
				.append("path")
				.attr("class", "slice")
				.attr("fill", function(d, i) { return colorScale(data.values[i].key); })
				.attr("d", arc)
				.each(function(d) { this._current = d; } )
				.on("mouseover", dispatch.customHover);
			
			slices.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attrTween("d", arcTween);
           
			slices.exit()
				.remove();
			
			// Labels
			var labels = d3.select(".labels")
				.selectAll("text.label")
				.data(pie(values), key);

			labels.enter()
				.append("text")
				.attr("class", "label")
				.attr("dy", ".35em");

			labels.transition()
				.duration(transition.duration)
				.text(function(d, i) { return data.values[i].key; })
				.attrTween("transform", function(d) {
					this._current = this._current || d;
					var interpolate = d3.interpolate(this._current, d);
					this._current = interpolate(0);
					return function(t) {
						var d2 = interpolate(t);
						var pos = outerArc.centroid(d2);
						pos[0] = radius * (midAngle(d2) < Math.PI ? 1.2 : -1.2);
						return "translate("+ pos +")";
					};
				})
				.styleTween("text-anchor", function(d) {
					this._current = this._current || d;
					var interpolate = d3.interpolate(this._current, d);
					this._current = interpolate(0);
					return function(t) {
						var d2 = interpolate(t);
						return midAngle(d2) < Math.PI ? "start":"end";
					};
				});

			labels.exit()
				.remove();	
			
			// Slice to Label Lines
			var lines = d3.select(".lines")
				.selectAll("polyline.line")
				.data(pie(values));
		
			lines.enter()
				.append("polyline")
				.attr("class", "line");

			lines.transition().duration(transition.duration)
				.attrTween("points", function(d) {
					this._current = this._current || d;
					var interpolate = d3.interpolate(this._current, d);
					this._current = interpolate(0);
					return function(t) {
						var d2 = interpolate(t);
						var pos = outerArc.centroid(d2);
						pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1.2 : -1.2);
						return [arc.centroid(d2), outerArc.centroid(d2), pos];
					};			
				});
		
			lines.exit()
				.remove();

		});
	}
   
	// Configuration Getters & Setters
	my.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		radius = d3.min([(width - (margin.right + margin.left)), (height - (margin.top + margin.bottom))]) / 2;
		return this;
	};

	my.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		radius = d3.min([(width - (margin.right + margin.left)), (height - (margin.top + margin.bottom))]) / 2;
		return this;
	};
	
	my.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
		return this;
	};	

	my.radius = function(_) {
		if (!arguments.length) return radius;
		radius = _;
		return this;
	};

	my.innerRadius = function(_) {
		if (!arguments.length) return innerRadius;
		innerRadius = _;
		return this;
	};
	
	my.colors = function(_) {
		if (!arguments.length) return colors;
		colors = _;
		return this;
	}; 
	
	my.transition = function(_) {
		if (!arguments.length) return transition;
		transition = _;
		return this;
	};	
   
	d3.rebind(my, dispatch, "on");
	return my;
};

/** 
 * Simple HTML Table
 * 
 * @example
 * var myTable = d3.ez.htmlTable()
 * 	.classed('myClass')
 * 	.width('600');
 * d3.select("#tableholder")
 * 	.datum(data)
 * 	.call(myTable);
 */
d3.ez.htmlTable = function module() {
	// Table container (populated by 'my' function below) 
	var table;
	
	// Default settings (some configurable via Setters below)
	var classed           = "htmlTable";
	var width             = 800;
	
	var dispatch   = d3.dispatch("customHover");
	
	function my(selection) {	
		selection.each(function(data) {

			// Cut the data in different ways....
			var rowNames = data.map(function(d) { return d.key; });
			
			var columnNames = [];
			data.map(function(d) { return d.values; })[0].forEach(function(d, i) {
				columnNames[i] = d.key;
			});
			
			// If the table does not exist then create it,
			// otherwise empty it ready for new data.
			if(!table) {
				table = d3.select(this)
					.append("table")
					.classed("d3ez", true)
					.classed(classed, true)					
					.attr("width", width);
			} else {
				table.selectAll("*")
					.remove();
			}
			var head = table.append("thead");
			var foot = table.append("tfoot");
			var body = table.append("tbody");
			
			// Add table headings
			hdr = head.append("tr")
			
			hdr.selectAll("th")
				.data(function() {
					// Tack on a blank cell at the beginning,
					// this is for the top of the first column.
					return [''].concat(columnNames);
				})
				.enter()
				.append("th")
				.html(function(d) { return d; });
			
			// Add table body 
			rows = body.selectAll("tr")
				.data(data)
				.enter()
				.append("tr")
				.attr("class", function(d) { return d.key; })
				.on("mouseover", dispatch.customHover);
			
			// Add the first column of headings (categories)
			rows.append("th")
				.html(function(d) { return d.key; });
			
			// Add the main data values
			rows.selectAll("td")
				.data(function(d) { return d.values; })
				.enter()
				.append("td")
				.attr("class", function(d) { return d.key; })
				.html(function(d) { return d.value; });
		});
	}
	
	// Configuration Getters & Setters
	my.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};
	
	my.classed = function(_) {
		if (!arguments.length) return classed;
		classed = _;
		return this;
	};
	
	d3.rebind(my, dispatch, "on");
	return my;
};

/** 
 * Simple HTML List
 * 
 * @example
 * var myList = d3.ez.htmlList()
 * 	.classed('myClass');
 * d3.select("#listholder")
 * 	.datum(data)
 * 	.call(myList);
 */
d3.ez.htmlList = function module() {
	// Table container (populated by 'my' function below) 
	var list;
	
	// Default settings (some configurable via Setters below)
	var classed           = "htmlList";
	
	var dispatch   = d3.dispatch("customHover");
	
	function my(selection) {	
		selection.each(function(data) {

			// Cut the data in different ways....
			var rowNames = data.map(function(d) { return d.key; });
			
			var columnNames = [];
			data.map(function(d) { return d.values; })[0].forEach(function(d, i) {
				columnNames[i] = d.key;
			});
			
			// If the ul list does not exist then create it,
			// otherwise empty it ready for new data.
			if(!list) {
				list = d3.select(this)
					.append("ul")
					.classed("d3ez", true)
					.classed(classed, true);
			} else {
				list.selectAll("*")
					.remove();
			}
			
			// Add table body 
			items = list.selectAll("li")
				.data(data)
				.enter()
				.append("li")
				.html(function(d) { return d.values; })
				.attr("class", function(d) { return d.key; })
				.on("mouseover", dispatch.customHover);
		});
	}
	
	// Configuration Getters & Setters
	my.classed = function(_) {
		if (!arguments.length) return classed;
		classed = _;
		return this;
	};
	
	d3.rebind(my, dispatch, "on");
	return my;
};


/** 
 * Labeled Node
 * 
 * @example
 * var myNode = d3.ez.labeledNode()
 * 	.color('#FF0000')
 * 	.opacity(0.5)
 * 	.stroke(1)
 * 	.label('Node Label')
 * 	.radius(5);
 */
d3.ez.labeledNode = function module() {
	// Default settings (some configurable via Setters below)
	var color       = 'steelblue';
	var opacity     = 1;
	var strokeColor = '#000000';
	var strokeWidth = 0;
	var radius      = 8;
	var label       = null;
	var fontSize    = 10;

	// Create Label Object
	function my(d, i) {
		var r = sizeAccessor(d);

		var node = d3.select(this)
			.attr('class', 'node');

		node.append('circle')
			.attr('fill-opacity', opacity)
			.attr('r', r)
			.style('stroke', strokeColor)
			.style('stroke-width', strokeWidth)
			.style('fill', color);

		node.append('text')
			.text(label)
			.attr('dx', r + 2)
			.attr('dy', r + 6)
			.style('text-anchor', 'left')
			.style('font-size', fontSize + 'px')
			.attr('class', 'nodetext');
	}

	// Configuration Getters & Setters
	my.color = function(_) {
		if (!arguments.length) return color;
		color = _;
		return my;
	};

	my.opacity = function(_) {
		if (!arguments.length) return opacity;
		opacity = _;
		return my;
	};

	my.radius = function(_) {
		if (!arguments.length) return radius;
		radius = _;
		return my;
	};

	my.label = function(_) {
		if (!arguments.length) return label;
		label = _;
		return my;
	};

	my.fontSize = function(_) {
		if (!arguments.length) return fontSize;
		fontSize = _;
		return my;
	};
	
	my.stroke = function(_width, _color) {
		if (!arguments.length) return strokeWidth + ", " + strokeColor;
		strokeWidth = _width;
		strokeColor = _color;
		return my;
	};	

	function sizeAccessor(_) {
		return (typeof radius === 'function' ? radius(_) : radius);
	};

	return my;
};

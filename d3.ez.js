/*
 * D3.EZ
 * Copyright (C) 2015  James Saunders
 * 
 * This program is free software: you can redistribute it and/or modify it under the 
 * terms of the GNU General Public License as published by the Free Software Foundation, 
 * either version 3 of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 * See the GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along with this program.  
 * If not, see <http://www.gnu.org/licenses/>.
 */

d3.ez = {
    version: "1.1.2"
};

/* 
 * REUSABLE CHARTS - Charts, Tables, Graphs etc. 
 */

// Reusable Column Chart
// --------------------- 
// Use:
//	var data = [34, 5, 12, 32, 43, 18, 2];
// 	var myChart = d3.ez.columnChart()
// 		.width(400)
// 		.height(300)
// 		.color('#ff0000');
//	d3.select("#chartholder")
// 		.datum(data)
// 		.call(myChart);
//
// Credits:
// 	Chris Viau, Andrew Thornton, Ger Hobbelt, and Roland Dunn
// 	http://backstopmedia.booktype.pro/developing-a-d3js-edge/reusable-bar-chart/
//
d3.ez.columnChart = function module() {
	// SVG container (populated by exports function below) 
	var svg;
	// Default Settings (some configurable via Settersbelow)
	var width  = 400;
	var height = 300;
	var margin = {top: 20, right: 20, bottom: 20, left: 40};
	var color  = 'steelblue';
	var gap    = 0;
	var ease   = "bounce";

	var dispatch = d3.dispatch("customHover");
	
	function exports(selection) {
		selection.each(function(data) {
			var chartW = width - margin.left - margin.right;
			var chartH = height - margin.top - margin.bottom;

			// X & Y Scales
			var xScale = d3.scale.ordinal()
				.domain(data.map(function(d, i) { return i;}))
				.rangeRoundBands([0, chartW], 0.1);

			var yScale = d3.scale.linear()
				.domain([0, d3.max(data, function(d, i) { return d;})])
				.range([chartH, 0]);

			var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom");

			var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left");

			// Trick to just append the svg skeleton once
			if (!svg) {
				svg = d3.select(this)
					.append("svg")
					.classed("chart", true);

				var container = svg.append("g").classed("container-group", true);
				container.append("g").classed("chart-group", true);
				container.append("g").classed("x-axis-group axis", true);
				container.append("g").classed("y-axis-group axis", true);
			}

			// Update the outer dimensions.
			svg.transition().attr({width: width, height: height});
			
			// Update the inner dimensions.
			svg.select(".container-group")
				.attr({transform: "translate(" + margin.left + "," + margin.top + ")"});			
			
			svg.select(".x-axis-group.axis")
				.attr({transform: "translate(0," + chartH + ")"})
				.call(xAxis);

			svg.select(".y-axis-group.axis")	
				.call(yAxis);

			var gapSize = xScale.rangeBand() / 100 * gap;
			var barW = xScale.rangeBand() - gapSize;

			// Enter, Update, Exit on bars
			var bars = svg.select(".chart-group")
				.selectAll(".bar")
				.data(data);
						
			bars.enter().append("rect")
				.classed("bar", true)
				.attr("fill", color)
				.attr({
					width: barW,
					x: chartW,
					y: function(d, i) { return yScale(d); },
					height: function(d, i) { return chartH - yScale(d); }
				})
				.on("mouseover", dispatch.customHover);
						
			bars.transition()
				.ease(ease)
				.attr({
					width: barW,
					x: function(d, i) { return xScale(i) + gapSize / 2; },
					y: function(d, i) { return yScale(d); },
					height: function(d, i) { return chartH - yScale(d); }
				});

			bars.exit()
				.transition()
				.style({opacity: 0})
				.remove();
		});
	}
	
	// Configuration Getters & Setters
	exports.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};
			
	exports.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};
	
	exports.color = function(_) {
		if (!arguments.length) return color;
		color = _;
		return this;
	};
			
	d3.rebind(exports, dispatch, "on");
	return exports;
};

// Simple Reusable HTML Table
// --------------------------
// Use:
// 	var data = [
// 		['Jim', 34, 12, 'Male', 'Eastbourne'], 
// 		['Claire', 32, 15, 'Female', 'Portsmouth']
// 		['Philip', 65, 11, 'Male', 'Macclesfield']
// 	];
// 	var myTable = d3.ez.htmlTable()
// 		.classed('sortable');
// 	d3.select("#tableholder")
// 		.datum(data)
// 		.call(myTable);
//
// Credits:
//	Inspiration from Mike Bostock
// 	http://bost.ocks.org/mike/chart/
//
d3.ez.htmlTable = function module() {
	// Table container (populated by exports function below) 
	var table;	
	// Default Settings (some configurable via Setters below)
	var classed = "sortable";
	
	function exports(selection) {	
		selection.each(function(data) {
			// If data is only a single dimention array then
			// convert it to a multi-dimentional array.
			if(data[0].constructor != Array) {
				data = [data];
			}
			// If the table does not exist create it,
			// else empty it ready for new data.
			if(!table) {
				table = d3.select(this)
					.append("table")
					.classed(classed, true);
			} else {
				table.selectAll("*").remove();
			}
			var head = table.append("thead");
			var foot = table.append("tfoot");
			var body = table.append("tbody");

			// Add table headings
			var tr = head.append("tr");
			// Get the keys for the first row, This is not really relevant while only 
			// passing plain data array but if/when keyed data object then may use?
			var firstRow = data[Object.keys(data)[0]];
			var row = Object.keys(firstRow);
			//var row = data[0];
			var td = tr.selectAll("th")
				.data(row);
			td.enter()
				.append("th")
				.html(function(d) { return "Row " + d; });

			// Add table body data
			data.forEach(function(row) {
				var tr = body.append("tr");
				var td = tr.selectAll("td")
					.data(row);
				td.enter()
					.append("td")
					.html(function(d) { return d; });
			});
		});
	}
	
	// Configuration Getters & Setters
	exports.classed = function(_) {
		if (!arguments.length) return classed;
		classed = _;
		return this;
	};
	
	return exports;
};

// Reusable Time Series Chart
// --------------------------
// Use:
// 	var data = [
// 		{date: "Nov 2000", price: 1394.46},
// 		{date: "Dec 2000", price: 1140.45},
// 		{date: "Jan 2001", price: 1500.22},
// 		{date: "Feb 2001", price: 1054.75}
// 	];
// 	var formatDate = d3.time.format("%b %Y");
// 	var myChart = d3.ez.timeSeriesChart()
// 		.x(function(d) { return formatDate.parse(d.date); })
// 		.y(function(d) { return +d.price; })
// 		.width(600)
// 		.height(350);
// 	d3.select("#chartholder")
// 		.datum(data)
// 		.call(myChart);
//
// Credits:
//	Mike Bostock
// 	http://bost.ocks.org/mike/chart/
//
d3.ez.timeSeriesChart = function module() {
	// SVG container (populated by exports function below) 
	var svg;	
	// Default Settings (some configurable via Setters below)
	var width  = 400;
	var height = 300;
	var margin = {top: 20, right: 20, bottom: 20, left: 40};
	var color  = 'steelblue';
	var xValue = function(d) { return d[0]; };
	var yValue = function(d) { return d[1]; };
	var xScale = d3.time.scale();
	var yScale = d3.scale.linear();
	var area   = d3.svg.area().x(X).y1(Y);
	var line   = d3.svg.line().x(X).y(Y);

	function exports(selection) {
		selection.each(function(data) {
			var chartW = width - margin.left - margin.right;
			var chartH = height - margin.top - margin.bottom;
			
			// Convert data to standard representation greedily;
			// this is needed for nondeterministic accessors.
			data = data.map(function(d, i) {
				return [xValue.call(data, d, i), yValue.call(data, d, i)];
			});

			// X & Y Scales
			xScale
				.domain(d3.extent(data, function(d) { return d[0]; }))
				.range([0, chartW]);
			
			yScale
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
			
			// Trick to just append the svg skeleton once
			if (!svg) {
				svg = d3.select(this)
					.append("svg")
					.classed("chart", true);

				var container = svg.append("g").classed("container-group", true);				
				container.append("path").classed("chart-area-path", true);
				container.append("path").classed("chart-line-path", true);
				container.append("g").classed("x-axis-group axis", true);
				container.append("g").classed("y-axis-group axis", true);
			}

			// Update the outer dimensions.
			svg.attr("width", width)
				.attr("height", height);

			// Update the inner dimensions.
			var g = svg.select("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// Update the area path.
			g.select(".chart-area-path")
				.data([data])
				.attr("d", area.y0(yScale.range()[0]))
				.attr("fill", color);

			// Update the line path.
			g.select(".chart-line-path")
				.data([data])
				.attr("d", line)
				.attr("fill", "none");				

			// Update the x-axis.
			g.select(".x-axis-group.axis")
				.attr("transform", "translate(0," + yScale.range()[0] + ")")
				.call(xAxis);

			// Update the x-axis.
			g.select(".y-axis-group.axis")
				.call(yAxis);			
			
		});
	}
	
	// Configuration Getters & Setters
	exports.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	exports.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	exports.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
		return this;
	};	

	exports.x = function(_) {
		if (!arguments.length) return xValue;
		xValue = _;
		return this;
	};

	exports.y = function(_) {
		if (!arguments.length) return yValue;
		yValue = _;
		return this;
	};
	
	exports.color = function(_) {
		if (!arguments.length) return color;
		color = _;
		return this;
	};	
	
	// The X-accessor for the path generator; xScale ∘ xValue.
	function X(d) {
		return xScale(d[0]);
	}

	// The Y-accessor for the path generator; yScale ∘ yValue.
	function Y(d) {
		return yScale(d[1]);
	}	

	return exports;
};

// Reusable Donut Chart
// --------------------
// Use:
// 	var data = [['Apples', 12], ['Pears', 20], ['Bananas', 32], ['Tangerines', 18]];
// 	var myChart = d3.ez.donutChart()
// 		.width(400)
// 		.height(300)
// 		.radius(200)
// 		.innerRadius(50);
// 	d3.select("#chartholder")
// 		.datum(data)
// 		.call(myChart);
//
// Credits:
// 	Jeffrey Pierce
// 	https://github.com/jeffreypierce/d3-donut-chart/blob/master/d3-donut-chart.js
//
d3.ez.donutChart = function module() {
	// SVG container (populated by exports function below) 
	var svg;	
	// Default Settings (some configurable via Setters below)	
	var width             = 400;
	var height            = 300;
	var margin            = {top: 30, right: 30, bottom: 30, left: 30};
	var radius            = d3.min([(width - margin.right - margin.left), (height - margin.top - margin.bottom)]) / 2;
	var innerRadius       = 90;
	var strokeColor       = "#FFF";
	var strokeWidth       = 4;
	var enableLabels      = true;
	var labelGroupOffset  = 20;
	var labelColor        = "#333";
	var labelNameOffset   = 0;
	var tickColor         = "#333";
	var tickWidth         = 1;
	var tickOffset        = [0, 0, 2, 8]; // [x1, x2, y1, y2]
	var easeFunction      = 'cubic';
	var animationDuration = 250;
	var labelValueOffset  = 16;


	function exports(selection) {
		selection.each(function(data) {
			var _donutChart = this;
			this.currentData = [];
			this.oldData = [];
			
			// Settings
			var colors = d3.scale.category20();
			
			var labelValueText = function(arc) {
				return Math.floor((arc.value / _donutChart.totals) * 100) + "%";
			};
			var labelNameText = function(arc) {
				return arc.name + " (" + arc.value + ")";
			};						

			// ** Animation Functions ** //
			var calculateAngles = function(start, end) {
				var _this = this;
				var interpolate = d3.interpolate(
					{ startAngle : start, endAngle : end },
					{ startAngle : _this.startAngle, endAngle : _this.endAngle }
				);

				return function(t) {
					var b = interpolate(t);
					return arc(b);
				};
			};

			// Not sure yet?
			var chartTween = function(d, i) {
				var start   = 0;
				var end     = 0; 
				var oldData = _donutChart.oldData;
				
				if (oldData[i]) {
					start = oldData[i].startAngle;
					end = oldData[i].endAngle;
				} else if (!(oldData[i]) && oldData[i - 1]) {
					start = oldData[i - 1].endAngle;
					end = oldData[i - 1].endAngle;
				} else if (!(oldData[i - 1])
						&& oldData.length > 0) {
					start = oldData[oldData.length - 1].endAngle;
					end = oldData[oldData.length - 1].endAngle;
				}
				return calculateAngles.call(d, start, end);
			};
			
			// Not sure yet?
			var removeChartTween = function(d) {
				var start = 2 * Math.PI, end = 2 * Math.PI;
				return calculateAngles.call(d, start, end);
			};
			
			// Not sure yet?
			var textTween = function(d, i) {
				var a = 0
				var b; 
				var fn; 
				var oldData = _donutChart.oldData;

				if (oldData[i]) {
					a = (oldData[i].startAngle
						+ oldData[i].endAngle - Math.PI) / 2;
				} else if (!(oldData[i]) && oldData[i - 1]) {
					a = (oldData[i - 1].startAngle
						+ oldData[i - 1].endAngle - Math.PI) / 2;
				} else if (!(oldData[i - 1]) && oldData.length > 0) {
					a = (oldData[oldData.length - 1].startAngle
						+ oldData[oldData.length - 1].endAngle - Math.PI) / 2;
				}

				b = (d.startAngle + d.endAngle - Math.PI) / 2;

				fn = d3.interpolateNumber(a, b);

				return function(t) {
					var val = fn(t);
					return "translate(" + Math.cos(val)
							* (radius + labelGroupOffset) + ","
							+ Math.sin(val)
							* (radius + labelGroupOffset) + ")";
				};
			};

			var positionLabels = function(offset) {
				var _position = function() {
					this.attr("dy", function(d) { return offset; })
						.attr("text-anchor", function(d) {
							if ((d.startAngle + d.endAngle) / 2 < Math.PI) {
								return "beginning";
							} else {
								return "end";
							}
						});
				};
				_position.call(this);

				this.enter()
					.append("text")
					.attr("fill", labelColor)
					.attr("transform", function(d) {
						return "translate("
							+ Math.cos(((d.startAngle
							+ d.endAngle - Math.PI) / 2))
							* (radius + labelGroupOffset)
							+ ","
							+ Math.sin((d.startAngle
							+ d.endAngle - Math.PI) / 2)
							* (radius + labelGroupOffset)
							+ ")";
						}
					);
				_position.call(this);

				this.transition()
					.ease(easeFunction)
					.duration(animationDuration)
					.attrTween("transform", textTween);

				this.exit()
					.remove();
				
				return this;
			};

			// Wrap D3 natives with the data paramaters
			var donut = d3.layout.pie()
				.value(function(data) { return data[1]; });

			var arc = d3.svg.arc()
				.startAngle(function(d) { return d.startAngle; })
				.endAngle(function(d) { return d.endAngle; })
				.innerRadius(innerRadius)
				.outerRadius(radius);

			// ** Display Functions ** //
			// Chart Container
			var chart = d3.select(this).append("svg")
				.attr("class", "chart")
				.attr("width", width)
				.attr("height", height);

			// Paths
			var path_group = chart.append("g")
				.attr("class", "path-group")
				.attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

			// Labels
			var label_group = chart.append("g")
				.attr("class", "label-group")
				.attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

			// Public Update Method
			this.update = function(newData) {
				_donutChart.totals = 0;
				var paths, lines, valueLabels, nameLabels,

				filterData = function(element, index, array) {
					element.name = newData[index][0];
					element.value = newData[index][1];
					_donutChart.totals += element.value;
					return element.value > 0;
				};

				this.oldData = this.currentData;
				this.currentData = donut(newData).filter(filterData);

				if (this.currentData.length > 0) {
					var currentData = this.currentData;
					// draw arcs
					paths = path_group.selectAll("path").data(
							currentData);

					paths.enter()
						.append("svg:path")
						.attr("stroke", strokeColor)
						.attr("stroke-width", strokeWidth)
						.attr("fill", function(d, i) {
							return colors(i);
						})
						.transition().ease(easeFunction)
						.duration(animationDuration)
						.attrTween("d", chartTween);

					paths.transition()
						.ease(easeFunction)
						.duration(animationDuration)
						.attrTween("d", chartTween);

					paths.exit()
						.transition()
						.ease(easeFunction)
						.duration(animationDuration)
						.attrTween("d", removeChartTween)
						.remove();

					if (enableLabels) {
						// draw tick marks 
						lines = label_group.selectAll("line")
							.data(currentData);

						lines.enter()
							.append("svg:line")
							.attr("x1", tickOffset[0])
							.attr("x2", tickOffset[1])
							.attr("y1", 0 - radius - tickOffset[2])
							.attr("y2", 0 - radius - tickOffset[3])
							.attr("stroke", tickColor)
							.attr("stroke-width", tickWidth)
							.attr("transform", function(d) {
								return "rotate("
									+ (d.startAngle + d.endAngle)
									/ 2
									* (180 / Math.PI)
									+ ")";
								}
							);

						lines.transition()
							.ease(easeFunction)
							.duration(animationDuration)
							.attr("transform", function(d) {
								return "rotate("
									+ (d.startAngle + d.endAngle)
									/ 2
									* (180 / Math.PI)
									+ ")";
								}
							);

						lines.exit().remove();

						// draw labels names
						nameLabels = label_group.selectAll("text.name")
							.data(currentData);

						positionLabels.call(nameLabels, labelNameOffset)
							.attr("class", "name")
							.text(labelNameText);

						// draw label values
						valueLabels = label_group.selectAll("text.value")
							.data(currentData);

						positionLabels.call(valueLabels, labelValueOffset)
							.attr("class", "value").text(labelValueText);
					}
					return this;
				} else {
					throw 'No usable data';
				}
			};

			if (data) {
				// Although right at the end this is where it all begins..
				// If we have some data then update the (or generate a new) chart.						
				this.update(data);
			}
		});
	}; 
	
	// Configuration Getters & Setters
	exports.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	exports.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};
	
	exports.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
		return this;
	};	

	exports.radius = function(_) {
		if (!arguments.length) return radius;
		radius = _;
		return this;
	};

	exports.innerRadius = function(_) {
		if (!arguments.length) return innerRadius;
		innerRadius = _;
		return this;
	};
		
	return exports;
};

// Punchcard
// --------------------------
// Use:
// 	var myChart = d3.ez.punchCard()
// 		.width(400)
// 		.height(300);
// 	d3.select("#chartholder")
// 		.datum(data)
// 		.call(myChart);
//
// Credits:
// 	Nattawat Nonsung https://gist.github.com/nnattawat/9720082
//
d3.ez.punchCard = function module() {
	// SVG container (populated by exports function below) 
	var svg;	
	// Default Settings (some configurable via Setters below)
	var width = 400;
	var height = 300;
	var margin = {top: 40, right: 200, bottom: 40, left: 20};
	var maxRadius = 9;
	var minRadius = 2;
	var color = "steelblue";
	var object = {};
	var formatTick = d3.format("0000");
	var x, xAxis, xScale, colorScale;
	var rowHeight = (maxRadius*2)+2;
	var useGlobalScale = true;
 
	function exports(selection) {
		selection.each(function(data) {
			
		    var allValues = [];
			data.forEach(function(d){
				allValues = allValues.concat(d.values);
			});			
			
			x = d3.scale
				.linear()
				.range([0, width]);
 
			xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");
 
			xAxis.ticks(data[0].values.length)
				.tickFormat(formatTick);
 
			svg = selection.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.bottom)
				.style("margin-left", margin.left + "px")
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
			var domain = d3.extent(allValues, function(d) { return d['key']; });
			var valDomain = d3.extent(allValues, function(d) { return d['value']; });
			x.domain(domain);
 
			xScale = d3.scale.linear()
				.domain(domain)
				.range([0, width]);
 
			colorScale = d3.scale.linear()
				.domain(d3.extent(allValues, function(d){return d['value'];}))
				.range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);
 
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + (height - margin.bottom) + ")")
				.call(xAxis);
 
			function mouseover(p) {
				var g = d3.select(this).node().parentNode;
				d3.select(g).selectAll("circle").style("display","none");
				d3.select(g).selectAll("text.value").style("display","block");
			}
 
			function mouseout(p) {
				var g = d3.select(this).node().parentNode;
				d3.select(g).selectAll("circle").style("display","block");
				d3.select(g).selectAll("text.value").style("display","none");
			}
 
			for (var j = 0; j < data.length; j++) {
				var g = svg.append("g");
 
				var circles = g.selectAll("circle")
					.data(data[j]['values'])
					.enter()
					.append("circle");
 
				var text = g.selectAll("text")
					.data(data[j]['values'])
					.enter()
					.append("text");
 
				var rDomain = useGlobalScale? valDomain : [0, d3.max(data[j]['values'], function(d) { return d['value']; })];
				var rScale = d3.scale.linear()
					.domain(rDomain)
					.range([minRadius, maxRadius]);
 
				circles
					.attr("cx", function(d, i) { return xScale(d['key']); })
					.attr("cy", (height - margin.bottom - rowHeight*2) - (j*rowHeight)+rowHeight)
					.attr("r", function(d) { return rScale(d['value']); })
					.style("fill", function(d) { return colorScale(d['value']) });
 
				text
					.attr("y",(height - margin.bottom - rowHeight*2) - (j*rowHeight)+(rowHeight+5))
					.attr("x",function(d, i) { return xScale(d['key'])-5; })
					.attr("class","value")
					.text(function(d){ return d['value']; })
					.style("fill", function(d) { return colorScale(d['value']) })
					.style("display","none");
 
				g.append("text")
					.attr("y", (height - margin.bottom - rowHeight*2) - (j*rowHeight)+(rowHeight+5))
					.attr("x",width+rowHeight)
					.attr("class","label")
					.text(data[j]['key'])
					.style("fill", function(d) { return color })
					.on("mouseover", mouseover)
					.on("mouseout", mouseout);
			}
		
		});
	};

	// Configuration Getters & Setters
	exports.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return exports;
	};
 
	exports.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return exports;
	};
	
	exports.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
		return this;
	};
	
	exports.minRadius = function(_) {
		if (!arguments.length) return minRadius;
		minRadius = _;
		return exports;
	};
 
 	exports.maxRadius = function(_) {
 		if (!arguments.length) return maxRadius;
 		maxRadius = _;
 		rowHeight = (maxRadius*2)+2;
 		return exports;
	};
 
	exports.color = function(_) {
		if (!arguments.length) return color;
		color = _;
		return exports;
	};
 
 	exports.useGlobalScale = function(_) {
 		if (!arguments.length) return useGlobalScale;
 		useGlobalScale = _;
 		return exports;
	};
	
	return exports;
};

// Stacked Column Chart
// --------------------
// Use:
// 	var data = [
// 		{'State':'Jim', 'Apples':'4', 'Oranges':'3', 'Pears':'1', 'Bananas':'0'},
// 		{'State':'Claire', 'Apples':'3', 'Oranges':'1', 'Pears':'2', 'Bananas':'2'},
// 		{'State':'Beth', 'Apples':'1', 'Oranges':'4', 'Pears':'2', 'Bananas':'3'}
// 	];
// 	var myChart = d3.ez.columnChartStacked()
// 		.width(400)
// 		.height(300);
// 	d3.select("#chartholder")
// 		.datum(data)
// 		.call(myChart);
//
d3.ez.columnChartStacked = function module() {
	// SVG container (populated by exports function below) 
	var svg;	
	// Default Settings (some configurable via Setters below)
	var width = 400;
	var height = 300;
	var margin = {top: 20, right: 70, bottom: 20, left: 40};		
	// var colors = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];
	var colors = d3.scale.category10().range();
	var yAxisLabel = 'Y Axis Label';
	
	function exports(selection) {
		selection.each(function(data) {
			var chartW = width - margin.left - margin.right;
			var chartH = height - margin.top - margin.bottom;

			// X & Y Scales
			var xScale = d3.scale.ordinal()
				.rangeRoundBands([0, chartW], .1);

			var yScale = d3.scale.linear()
				.rangeRound([chartH, 0]);

			var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom");

			var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left")
				.tickFormat(d3.format(".2s"));
			
			var color = d3.scale.ordinal()
				.range(colors);			
			
			if (!svg) {
				svg = d3.select(this)
					.append("svg")
					.classed("chart", true);
				
				var container = svg.append("g").classed("container-group", true);				
				container.append("g").classed("chart-group", true);
				container.append("g").classed("x-axis-group axis", true);
				container.append("g").classed("y-axis-group axis", true);				
			}
			
			// Update the outer dimensions.
			svg.transition().attr({width: width, height: height});
			
			// Update the inner dimensions.
			svg.select(".container-group")
				.attr({transform: "translate(" + margin.left + "," + margin.top + ")"});			
			
			color.domain(d3.keys(data[0]).filter(function(key) { return key !== "State"; }));
			
			data.forEach(function(d) {
				var y0 = 0;
				d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
				d.total = d.ages[d.ages.length - 1].y1;
			});
			
			// Arrange bars largest to smallest
			// data.sort(function(a, b) { return b.total - a.total; });
			
			xScale.domain(data.map(function(d) { return d.State; }));
			yScale.domain([0, d3.max(data, function(d) { return d.total; })]);
			
			svg.select(".x-axis-group.axis")
				.attr({transform: "translate(15," + chartH + ")"})
				.call(xAxis);

			svg.select(".y-axis-group.axis")	
				.call(yAxis)
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text(yAxisLabel);
			
			var bars = svg.select(".chart-group")
				.selectAll(".bar")
				.data(data)
				.enter()
				.append("g")
				.attr("class", "g")
				.attr("transform", function(d) { return "translate(" + (xScale(d.State) + 10) + ", 0)"; });
			
			bars.selectAll("rect")
				.data(function(d) { return d.ages; })
			  	.enter()
			  	.append("rect")
				.attr("width", xScale.rangeBand())
				.attr("y", function(d) { return yScale(d.y1); })
				.attr("height", function(d) { return yScale(d.y0) - yScale(d.y1); })
				.style("fill", function(d) { return color(d.name); });
			
			var legend = svg.selectAll(".legend")
				.data(color.domain().slice().reverse())
			  	.enter()
			  	.append("g")
				.attr("class", "legend")
			  	.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
			
			legend.append("rect")
				.attr("x", width - 18)
			  	.attr("width", 18)
			  	.attr("height", 18)
			  	.style("fill", color);
			
			legend.append("text")
				.attr("x", width - 24)
				.attr("y", 9)
				.attr("dy", ".35em")
				.style("text-anchor", "end")
				.text(function(d) { return d; });
			
		});
	}
	
	// Configuration Getters & Setters
	exports.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	exports.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};
	
	exports.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
		return this;
	};

	exports.yAxisLabel = function(_) {
		if (!arguments.length) return margin;
		yAxisLabel = _;
		return this;
	};

	exports.colors = function(_) {
		if (!arguments.length) return margin;
		colors = _;
		return this;
	};
	
	return exports;	
};


/* 
 * REUSABLE COMPONENTS - Boxes, Legends, Nodes etc. 
 */

// Reusable Labeled Circle Node
// ----------------------------
// Use:
// 	var myLabeledNode = d3.ez.labeledNode()
// 		.color('#FF0000')
// 		.opacity(0.5)
// 		.stroke(1)
// 		.label('Node Label')
// 		.radius(5);
//
// Credits:
// 	Peter Cook http://animateddata.co.uk/
//
d3.ez.labeledNode = function module() {
	// Configurable Variables
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

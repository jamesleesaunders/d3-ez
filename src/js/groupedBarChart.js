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
	var colors            = d3.ez.colors.categorical(4);
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
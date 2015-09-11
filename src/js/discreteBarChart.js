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
	// SVG container (Populated by 'my' function) 
	var svg;
	
	// Default Options (Configurable via setters)
	var width              = 400;
	var height             = 300;
	var margin             = {top: 20, right: 20, bottom: 20, left: 40};
	var transition         = {ease: "bounce", duration: 500};
	var classed            = "discreteBarChart";	
	var colors             = d3.ez.colors.categorical(4);	
	var gap                = 0;

	// Data Options (Populated by 'init' function)
	var chartW = 0;
	var chartH = 0;
	var yAxisLabel = null;
	var maxValue = null;
	var categories = null;
	var xScale = null;
	var yScale = null;
	var xAxis = null;
	var yAxis = null;
	var colorScale = null;		
	
	// Dispatch (Custom events)
	var dispatch           = d3.dispatch("customHover");

	function init(data) {		
		chartW = width - margin.left - margin.right;
		chartH = height - margin.top - margin.bottom;
		
		yAxisLabel = d3.values(data)[0];
		maxValue = d3.max(data.values, function(d) { return d.value;} );
		categories = d3.values(data)[1].map(function(d) { return d.key; });

		// X & Y Scales
		xScale = d3.scale.ordinal()
			.domain(categories)
			.rangeRoundBands([0, chartW], 0.1);

		yScale = d3.scale.linear()
			.domain([0, maxValue])
			.range([chartH, 0]);

		// X & Y Axis
		xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom");

		yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left");
		
		// Colour Scale
		colorScale = d3.scale.ordinal()
			.domain(categories)
			.range(colors);
	}
	
	function my(selection) {
		selection.each(function(data) {
			// Initialise Data
			init(data);

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
				.selectAll(".y-label")
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
				.attr("class", function(d) { return d.key + " bar"; })
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
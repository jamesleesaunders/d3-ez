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
	var width              = 400;
	var height             = 300;
	var margin             = {top: 20, right: 20, bottom: 20, left: 40};
	var transition         = {ease: "bounce", duration: 500};
	var classed            = "timeSeriesChart";	
	var color              = "steelblue";
	var xValue             = function(d) { return d[0]; };
	var yValue             = function(d) { return d[1]; };

	var dispatch           = d3.dispatch("customHover");
	
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
	
	d3.rebind(my, dispatch, "on");
	
	return my;
};
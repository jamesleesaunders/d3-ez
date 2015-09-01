/** 
 * Radial Bar Chart
 * 
 * @example
 * var myChart = d3.ez.radialBarChart();
 * d3.select("#chartholder")
 * 	.datum(data)
 * 	.call(myChart);
 * 
 * Credit: Peter Cook http://animateddata.co.uk/
 */
d3.ez.radialBarChart = function module() {
	// SVG container (populated by 'my' function below) 
	var svg;

	// Default settings (some configurable via Setters below)
	var width              = 400;
	var height             = 300;
	var margin             = {top: 20, right: 20, bottom: 20, left: 20};
	var barHeight          = 100;
	var reverseLayerOrder  = false;
	var colors             = d3.ez.colors.categorical(4);		
	var capitalizeLabels   = false;
	var domain             = [0, 100];
	var tickValues         = undefined;
	var colorLabels        = false;
	var tickCircleValues   = [];
	var transition         = {ease: "bounce", duration: 500};
	var classed            = 'radialBarChart';
	
	// Scales & other useful things
	var numBars     = null;
	var barScale    = null;
	var keys        = null;
	var labelRadius = 0;

	function init(d) {
		barScale = d3.scale.linear().domain(domain).range([0, barHeight]);

		keys = d3.map(d[0].data).keys();
		numBars = keys.length;

		// Radius of the key labels
		labelRadius = barHeight * 1.025;   
	}

	function my(selection) {
		selection.each(function(data) {	
			width = 2 * barHeight + 50;
			height = 2 * barHeight + 50;
			var chartW = width - margin.left - margin.right;
			var chartH = height - margin.top - margin.bottom;
			
			init(data);
			if(reverseLayerOrder) data.reverse();
			
			// Create SVG element (if it does not exist already)			
			if (!svg) {
				svg = d3.select(this)
					.append("svg")
					.classed("d3ez", true)
					.classed(classed, true)
				
				var container = svg.append("g").classed("container", true);
					container.append("g").classed("tickCircles", true);
					container.append("g").classed("layers", true);
					container.append("g").classed("spokes", true);
					container.append("g").classed("axis", true)
					container.append('circle').classed("outerCircle", true)
					container.append("g").classed("labels", true);
			}			

			// Update the outer dimensions
			svg.transition().attr({width: width, height: height});
			
			// Update the inner dimensions.
			svg.select(".container")
				.attr('transform', 'translate(' + (margin.left + barHeight) + ',' + (margin.top + barHeight) +')');

			// Concentric tick circles
			tickCircles = d3.select('.tickCircles')
				.selectAll('circle')
				.data(tickCircleValues)
				.enter()
				.append('circle')
				.attr('r', function(d) {return barScale(d);})
				.style('fill', 'none');
			
			// Layer enter/exit/update
			var layers = d3.select('.layers')
				.selectAll('g.layer')
				.data(data);

			layers.enter()
				.append('g')
				.attr('class', function(d, i) {
					return 'layer-' + i;
				})
				.classed('layer', true);

			layers.exit()
				.remove();

			// Segment enter/exit/update
			var segments = layers
				.selectAll('path')
				.data(function(d) {
					var m = d3.map(d.data);
					return m.values(); 
				});

			segments.enter()
				.append('path')
				.style('fill', function(d, i) {
					if(!colors) return;
					return colors[i % colors.length];
				});

			segments.exit()
				.remove();

			segments.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attr('d', d3.svg.arc().innerRadius(0).outerRadius(or).startAngle(sa).endAngle(ea));

			// Spokes
			spokes = d3.select('.spokes')
				.selectAll('line')
				.data(keys)
				.enter()
				.append('line')
				.attr('y2', -barHeight)
				.attr('transform', function(d, i) {return 'rotate('+ (i * 360 / numBars) +')';});
			
			// Axis
			var axisScale = d3.scale.linear().domain(domain).range([0, -barHeight]);
			var axis = d3.svg.axis().scale(axisScale).orient('right');
			
			if(tickValues) axis.tickValues(tickValues);
			axis = d3.select('.axis')
				.call(axis);

			// Outer Circle
			outerCircle = d3.select('.outerCircle')
				.attr('r', barHeight)
				.style('fill', 'none');

			// Labels
			var labels = d3.select('.labels');
			labels.append('def')
				.append('path')
				.attr('id', 'label-path')
				.attr('d', 'm0 ' + -labelRadius + ' a' + labelRadius + ' ' + labelRadius + ' 0 1,1 -0.01 0');

			labels.selectAll('text')
				.data(keys)
				.enter()
				.append('text')
				.style('text-anchor', 'middle')
				.style('fill', function(d, i) {return colorLabels ? barColors[i % barColors.length] : null;})
				.append('textPath')
				.attr('xlink:href', '#label-path')
				.attr('startOffset', function(d, i) {return i * 100 / numBars + 50 / numBars + '%';})
				.text(function(d) {return capitalizeLabels ? d.toUpperCase() : d;});
		});
	}

	/* Arc functions */
	or = function(d, i) {
		return barScale(d);
	}
	sa = function(d, i) {
		return (i * 2 * Math.PI) / numBars;
	}
	ea = function(d, i) {
		return ((i + 1) * 2 * Math.PI) / numBars;
	}

	// Configuration Getters & Setters
	my.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
		return my;
	};

	my.barHeight = function(_) {
		if (!arguments.length) return barHeight;
		barHeight = _;
		return my;
	};

	my.reverseLayerOrder = function(_) {
		if (!arguments.length) return reverseLayerOrder;
		reverseLayerOrder = _;
		return my;
	};

	my.colors = function(_) {
		if (!arguments.length) return colors;
		colors = _;
		return my;
	};

	my.capitalizeLabels = function(_) {
		if (!arguments.length) return capitalizeLabels;
		capitalizeLabels = _;
		return my;
	};

	my.domain = function(_) {
		if (!arguments.length) return domain;
		domain = _;
		return my;
	};

	my.tickValues = function(_) {
		if (!arguments.length) return tickValues;
		tickValues = _;
		return my;
	};

	my.colorLabels = function(_) {
		if (!arguments.length) return colorLabels;
		colorLabels = _;
		return my;
	};

	my.tickCircleValues = function(_) {
		if (!arguments.length) return tickCircleValues;
		tickCircleValues = _;
		return my;
	};

	my.transition = function(_) {
		if (!arguments.length) return transition;
		transition = _;
		return my;   
	};

	return my;
};
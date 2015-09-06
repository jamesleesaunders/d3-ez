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
	var colorLabels        = false;
	var transition         = {ease: "bounce", duration: 500};
	var classed            = 'radialBarChart';
	
	// To sort!
	var tickValues         = [];	
	var tickCircleValues   = [];	
	var domain             = [];
	
	// Scales & other useful things
	var numBars     = null;
	var barScale    = null;
	var keys        = null;
	var labelRadius = 0;
	
	var dispatch   = d3.dispatch("customHover");

	function init(data) {
		// bars
		keys = d3.values(data[0])[1].map(function(d) { return d.key; });
		numBars = keys.length;

		// Radius of the key labels
		labelRadius = barHeight * 1.025;
	
		// Totals MAx, etc
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
		
		// tickCircleValues
		tickCircleValues   = [];
		for (var i=0; i<=maxValue; i++) {
			tickCircleValues.push(i);
		}

		// tickCircleValues (dont know the difference really?)
		tickValues         = [];	
		tickValues = tickCircleValues;
		tickValues.push(maxValue + 1)		
		
		// Domain
		domain = [0, maxValue+1];
		
		// Scale
		barScale = d3.scale.linear()
			.domain(domain)
			.range([0, barHeight]);
	}

	function my(selection) {
		selection.each(function(data) {	
			width = 2 * barHeight + 50;
			height = 2 * barHeight + 50;
			var chartW = width - margin.left - margin.right;
			var chartH = height - margin.top - margin.bottom;
			
			// Cut the data in different ways....
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
			
			// Update the inner dimensions
			svg.select(".container")
				.attr('transform', 'translate(' + (margin.left + barHeight) + ',' + (margin.top + barHeight) +')');

			// Concentric tick circles
			tickCircles = d3.select('.tickCircles')
				.selectAll('circle')
				.data(tickCircleValues)
				
			tickCircles.enter()
				.append('circle')
				.style('fill', 'none');
			
			tickCircles.transition()
				.attr('r', function(d) {return barScale(d);})
				.ease(transition.ease)
				.duration(transition.duration);
			
			tickCircles.exit()
				.remove();
			
			
			
			// Layer enter/exit/update
			var layers = d3.select('.layers')
				.selectAll('g.layer')
				.data(data);

			layers.enter()
				.append('g')
				.attr('class', function(d, i) {
					return 'layer-' + i;
				})
				.classed('layer', true)
				.on("mouseover", dispatch.customHover);

			layers.exit()
				.remove();

			// Segment enter/exit/update
			var segments = layers
				.selectAll('path')
				.data(function(d) {
					return d3.values(d)[1].map(function(d) { return d.value; });
				});

			segments.enter()
				.append('path')
				.style('fill', function(d, i) {
					if(!colors) return;
					return colors[i % colors.length];
				});

			segments.exit()
				.remove();

			// Arc Generator
			var arc = d3.svg.arc()
				.innerRadius(0)
				.outerRadius(function(d, i) { return barScale(d); })
				.startAngle(function(d, i) { return (i * 2 * Math.PI) / numBars; })
				.endAngle(function(d, i) { return ((i + 1) * 2 * Math.PI) / numBars; });
			
			segments.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attr('d', arc);

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

	d3.rebind(my, dispatch, "on");
	
	return my;
};
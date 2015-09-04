/**
 * Circular Heat Chart
 * 
 * @example
 * var myChart = d3.ez.circularHeatChart();
 * d3.select("#chartholder")
 * 	.datum(data)
 * 	.call(myChart);
 * 
 * Credit: Peter Cook http://animateddata.co.uk/
 */
d3.ez.circularHeatChart = function module() {
	// SVG container (populated by 'my' function below) 
	var svg;
	
	// Default settings (some configurable via Setters below)	
	var width              = 800;
	var height             = 800;
	var margin             = {top: 20, right: 20, bottom: 20, left: 20};
	var innerRadius        = 50
	var numSegments        = 24;
	var segmentHeight      = 20;
	var domain             = null;
	var range              = ["white", "red"];
	var accessor           = function(d) {return d;};
	var radialLabels       = segmentLabels = [];
	var classed            = "circularHeatChart";	
	
	function my(selection) {
		selection.each(function(data) {
			//width = 2 * barHeight + 50;
			//height = 2 * barHeight + 50;
			//var chartW = width - margin.left - margin.right;
			//var chartH = height - margin.top - margin.bottom;			

			var offset = innerRadius + Math.ceil(data.length / numSegments) * segmentHeight;

			// Create SVG element (if it does not exist already)	

			if (!svg) {
				svg = d3.select(this)
					.append("svg")
					.classed("d3ez", true)
					.classed(classed, true)
				
				var container = svg.append("g").classed("container", true);
					container.append("g").classed("segments", true);
					container.append("g").classed("radialLabels", true)
					container.append("g").classed("segmentLabels", true);
			}	

			// Update the outer dimensions
			svg.transition().attr({width: width, height: height});
			
			// Update the inner dimensions
			svg.select(".container")
				.attr("transform", "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")");

			var autoDomain = false;
			if (domain === null) {
				domain = d3.extent(data, accessor);
				autoDomain = true;
			}

			var color = d3.scale.linear()
				.domain(domain)
				.range(range);

			if(autoDomain)
				domain = null;
			
			// Arc Generator
			var arc = d3.svg.arc()
				.innerRadius(function(d, i) { return innerRadius + Math.floor(i/numSegments) * segmentHeight; })
				.outerRadius(function(d, i) { return innerRadius + segmentHeight + Math.floor(i/numSegments) * segmentHeight; })
				.startAngle(function(d, i) { return (i * 2 * Math.PI) / numSegments; })
				.endAngle(function(d, i) { return ((i + 1) * 2 * Math.PI) / numSegments; });
			
			// Segments
			d3.select(".segments").selectAll("path")
				.data(data)
				.enter()
				.append("path")
				.attr("d", arc)
				.attr("fill", function(d) {return color(accessor(d));});

			// Unique id so that the text path defs are unique - is there a better way to do this?
			var id = d3.selectAll(".circular-heat")[0].length;

			// Radial Labels
			var lsa = 0.01; // Label start angle
			var radLabels = d3.select(".radialLabels")
				.classed("labels", true);

			radLabels.selectAll("def")
				.data(radialLabels)
				.enter()
				.append("def")
				.append("path")
				.attr("id", function(d, i) {return "radial-label-path-"+id+"-"+i;})
				.attr("d", function(d, i) {
					var r = innerRadius + ((i + 0.2) * segmentHeight);
					return "m" + r * Math.sin(lsa) + " -" + r * Math.cos(lsa) + 
						" a" + r + " " + r + " 0 1 1 -1 0";
				});

			radLabels.selectAll("text")
				.data(radialLabels)
				.enter()
				.append("text")
				.append("textPath")
				.attr("xlink:href", function(d, i) {return "#radial-label-path-"+id+"-"+i;})
				.text(function(d) {return d;});

			// Segment Labels
			var segmentLabelOffset = 2;
			var r = innerRadius + Math.ceil(data.length / numSegments) * segmentHeight + segmentLabelOffset;
			var segLabels = d3.select(".segmentLabels")
				.classed("labels", true);

			segLabels.append("def")
				.append("path")
				.attr("id", "segment-label-path-"+id)
				.attr("d", "m0 -" + r + " a" + r + " " + r + " 0 1 1 -1 0");

			segLabels.selectAll("text")
				.data(segmentLabels)
				.enter()
				.append("text")
				.append("textPath")
				.attr("xlink:href", "#segment-label-path-"+id)
				.attr("startOffset", function(d, i) {return i * 100 / numSegments + "%";})
				.text(function(d) {return d;});
		});
	}

	// Configuration Getters & Setters
	my.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
		return my;
	};

	my.innerRadius = function(_) {
		if (!arguments.length) return innerRadius;
		innerRadius = _;
		return my;
	};

	my.numSegments = function(_) {
		if (!arguments.length) return numSegments;
		numSegments = _;
		return my;
	};

	my.segmentHeight = function(_) {
		if (!arguments.length) return segmentHeight;
		segmentHeight = _;
		return my;
	};

	my.domain = function(_) {
		if (!arguments.length) return domain;
		domain = _;
		return my;
	};

    my.range = function(_) {
        if (!arguments.length) return range;
        range = _;
        return my;
    };

    my.radialLabels = function(_) {
    	if (!arguments.length) return radialLabels;
    	if (_ == null) _ = [];
    	radialLabels = _;
    	return my;
    };

    my.segmentLabels = function(_) {
    	if (!arguments.length) return segmentLabels;
    	if (_ == null) _ = [];
    	segmentLabels = _;
    	return my;
    };

    my.accessor = function(_) {
    	if (!arguments.length) return accessor;
    	accessor = _;
    	return my;
    };

    return my;
};
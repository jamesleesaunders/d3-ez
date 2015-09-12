/**
 * Radial Bar Chart
 * 
 * @example
 * var myChart = d3.ez.radialBarChart();
 * d3.select("#chartholder")
 *     .datum(data)
 *     .call(myChart);
 * 
 * Credit: Peter Cook http://animateddata.co.uk/
 */
d3.ez.radialBarChart = function module() {
    // SVG container (Populated by 'my' function) 
    var svg;

    // Default Options (Configurable via setters)
    var width              = 400;
    var height             = 300;
    var margin             = {top: 20, right: 20, bottom: 20, left: 20};
    var transition         = {ease: "bounce", duration: 500};
    var classed            = "radialBarChart";
    var colors             = d3.ez.colors.categorical(4);	
    var radius             = d3.min([(width - (margin.right + margin.left)), (height - (margin.top + margin.bottom))]) / 2;
    var capitalizeLabels   = false;
    var colorLabels        = false;

    // Data Options (Populated by 'init' function)	
    var tickValues         = [];	
    var tickCircleValues   = [];	
    var domain             = [];
    var numBars            = null;
    var barScale           = null;
    var keys               = null;
    var labelRadius        = 0;

    // Dispatch (Custom events)
    var dispatch           = d3.dispatch("customHover");

    function init(data) {
        // bars
        keys = d3.values(data)[1].map(function(d) { return d.key; });
        numBars = keys.length;

        // Radius of the key labels
        labelRadius = radius * 1.025;

        // Totals Max, etc
        var categoryTotals = [];
        var groupTotals = [];
        var maxValue = d3.max(data.values, function(d) { return d.value;} );	

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
            .range([0, radius]);
    }

    function my(selection) {
        selection.each(function(data) {
            init(data);

            // Create SVG element (if it does not exist already)			
            if (!svg) {
                svg = d3.select(this)
                    .append("svg")
                    .classed("d3ez", true)
                    .classed(classed, true);

                var container = svg.append("g").classed("container", true);
                container.append("g").classed("tickCircles", true);
                container.append("g").classed("layers", true);
                container.append("g").classed("spokes", true);
                container.append("g").classed("axis", true)
                container.append("circle").classed("outerCircle", true)
                container.append("g").classed("labels", true);
            }			

            // Update the outer dimensions
            svg.transition().attr({width: width, height: height});

            // Update the inner dimensions
            svg.select(".container")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            // Concentric tick circles
            tickCircles = d3.select(".tickCircles")
                .selectAll("circle")
                .data(tickCircleValues)

            tickCircles.enter()
                .append("circle")
                .style("fill", "none");

            tickCircles.transition()
                .attr("r", function(d) { return barScale(d);} )
                .ease(transition.ease)
                .duration(transition.duration);

            tickCircles.exit()
                .remove();

            // Arc Generator
            var arc = d3.svg.arc()
                .innerRadius(0)
                .outerRadius(function(d, i) { return barScale(d.value); })
                .startAngle(function(d, i) { return (i * 2 * Math.PI) / numBars; })
                .endAngle(function(d, i) { return ((i + 1) * 2 * Math.PI) / numBars; });			

            // Segment enter/exit/update
            var segments = d3.select(".layers")
                .selectAll("path")
                .data(data.values);

            segments.enter()
                .append("path")
                .style("fill", function(d, i) {
                    if(!colors) return;
                    return colors[i % colors.length];
                })
                .classed("layer", true)
                .on("mouseover", dispatch.customHover);

            segments.exit()
                .remove();

            segments.transition()
                .ease(transition.ease)
                .duration(transition.duration)
                .attr("d", arc);

            // Spokes
            spokes = d3.select(".spokes")
                .selectAll("line")
                .data(keys)
                .enter()
                .append("line")
                .attr("y2", -radius)
                .attr("transform", function(d, i) {return "rotate(" + (i * 360 / numBars) + ")";});

            // Axis
            var axisScale = d3.scale.linear().domain(domain).range([0, -radius]);
            var axis = d3.svg.axis().scale(axisScale).orient("right");

            if(tickValues) axis.tickValues(tickValues);
            axis = d3.select(".axis")
                .call(axis);

            // Outer Circle
            outerCircle = d3.select(".outerCircle")
                .attr("r", radius)
                .style("fill", "none");

            // Labels
            var labels = d3.select(".labels");
            labels.append("def")
                .append("path")
                .attr("id", "label-path")
                .attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");

            labels.selectAll("text")
                .data(keys)
                .enter()
                .append("text")
                .style("text-anchor", "middle")
                .style("fill", function(d, i) {return colorLabels ? barColors[i % barColors.length] : null;})
                .append("textPath")
                .attr("xlink:href", "#label-path")
                .attr("startOffset", function(d, i) {return i * 100 / numBars + 50 / numBars + "%";})
                .text(function(d) {return capitalizeLabels ? d.toUpperCase() : d;});
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
        radius = d3.min([(width - (margin.right + margin.left)), (height - (margin.top + margin.bottom))]) / 2;
        return this;
    };

    my.radius = function(_) {
        if (!arguments.length) return radius;
        radius = _;
        return this;
    };

    my.colors = function(_) {
        if (!arguments.length) return colors;
        colors = _;
        return this;
    };

    my.capitalizeLabels = function(_) {
        if (!arguments.length) return capitalizeLabels;
        capitalizeLabels = _;
        return this;
    };

    my.domain = function(_) {
        if (!arguments.length) return domain;
        domain = _;
        return this;
    };

    my.tickValues = function(_) {
        if (!arguments.length) return tickValues;
        tickValues = _;
        return this;
    };

    my.colorLabels = function(_) {
        if (!arguments.length) return colorLabels;
        colorLabels = _;
        return this;
    };

    my.tickCircleValues = function(_) {
        if (!arguments.length) return tickCircleValues;
        tickCircleValues = _;
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
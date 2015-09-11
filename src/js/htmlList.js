/** 
 * Simple HTML List
 * 
 * @example
 * var myList = d3.ez.htmlList()
 * 	.classed("myClass");
 * d3.select("#listholder")
 * 	.datum(data)
 * 	.call(myList);
 */
d3.ez.htmlList = function module() {
	// HTML container (Populated by 'my' function)
	var list;
	
	// Default Options (Configurable via setters)
	var classed             = "htmlList";
	
	// Dispatch (Custom events)
	var dispatch            = d3.dispatch("customHover");
	
	function my(selection) {	
		selection.each(function(data) {
			// Create HTML UL List element (if it does not exist already)
			if(!list) {
				list = d3.select(this)
					.append("ul")
					.classed("d3ez", true)
					.classed(classed, true);
			} else {
				list.selectAll("*")
					.remove();
			}
			
			list.selectAll("li")
				.data(data)
				.enter()
				.append("li")
				.text(function(d) { return d.key; })
				.on("click", expand);

			function expand(d) {
				d3.event.stopPropagation();
				dispatch.customHover(d);
				
				if (typeof d.values === "undefined") {
					return 0;
				} 
				
				var ul = d3.select(this)
					.on("click", collapse)
					.append("ul");
					
				var li = ul.selectAll("li")
					.data(d.values)
					.enter()
					.append("li")
					.text(function(d) {
						if (typeof d.value !== "undefined") {
							return d.key + " : " + d.value;
						} else {
							return d.key;
						}
					})
					.on("click", expand);
			}
			
			function collapse(d) {
				d3.event.stopPropagation();
				d3.select(this)
					.on("click", expand)
					.selectAll("*")
					.remove();
			}
			
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
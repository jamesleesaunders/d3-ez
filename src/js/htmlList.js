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
	var classed            = "htmlList";
	
	var dispatch   = d3.dispatch("customHover");
	
	function my(selection) {	
		selection.each(function(data) {
			// If it is a single object, wrap it in an array
			if (data.constructor !== Array) data = [data];
			
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
			
			list.selectAll("li")
				.data(data)
				.enter()
				.append("li")
				.text(function(d) { return d.key; })
				.on("click", expand);

			function expand(d) {
				d3.event.stopPropagation();
				dispatch.customHover(d);
				
				if (typeof d.values === 'undefined') {
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
						if (typeof d.value !== 'undefined') {
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
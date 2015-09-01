include('js/header.js');
include('js/radialBarChart.js');
include('js/circularHeatChart.js');
include('js/discreteBarChart.js');
include('js/groupedBarChart.js');
include('js/punchCard.js');
include('js/timeSeriesChart.js');
include('js/donutChart.js');
include('js/htmlTable.js');
include('js/htmlList.js');
include('js/reusableComponents.js');

function include(file) {
	// Method 1 - Using document.write
	var loc = document.currentScript.src
	var path = loc.substring(0, loc.lastIndexOf("/") + 1);
	var src = path + file;
	var type = 'text/javascript';
	
    document.write('<' + 'script src="' + src + '"' + ' type="' + type + '"><' + '/script>');
}

function include2(file) {
	// Method 2 - Using document.createElement
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');

	var loc = document.currentScript.src
	var path = loc.substring(0, loc.lastIndexOf("/") + 1);

	script.src = path + file;
    script.type = 'text/javascript';
    script.async = false;
    script.onload = function() { console.log(file); };
    head.appendChild(script);
}

function include3(file) {
	// Method 3 - Using D3
	var loc = document.currentScript.src
	var path = loc.substring(0, loc.lastIndexOf("/") + 1);
	var src = path + file;
	var type = 'text/javascript';
	
	d3.select('head')
		.append('script')
		.attr('src', src)
		.attr('type', type)
		.attr('async', false)
		.attr('onload', function() { console.log(file); });
}
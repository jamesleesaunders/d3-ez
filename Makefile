# D3.EZ Makefile

JS_FILES := 	js/header.js \
				js/radialBarChart.js \
				js/circularHeatChart.js \
				js/discreteBarChart.js \
				js/groupedBarChart.js \
				js/punchCard.js \
				js/timeSeriesChart.js \
				js/donutChart.js \
				js/htmlTable.js \
				js/htmlList.js \
				js/reusableComponents.js
	
CSS_FILES := 	css/global.css \
				css/radialBarChart.css \
				css/circularHeatChart.css \
				css/groupedBarChart.css \
				css/donutChart.css \
				css/htmlList.css \
				css/htmlTable.css

all: js css min
.PHONY: js css min

js: $(JS_FILES)
	@for file in $^; do cat "$$file"; echo "\n"; done > d3.ez.js
	@echo Built d3.ez.js

css: $(CSS_FILES)
	@for file in $^; do cat "$$file"; echo "\n"; done > d3.ez.css
	@echo Built d3.ez.css
	
min:
	@yuicompressor d3.ez.js -o d3.ez.min.js
	@echo Built d3.ez.min.js
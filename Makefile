# D3.EZ Makefile

JS_FILES :=        js/header.js \
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

GENERATED_FILES := d3.ez.js \
                   d3.ez.min.js \
                   d3.ez.css \
                   README.md \
                   LICENSE.md

all: js css min zip
.PHONY: js css min zip

js: $(JS_FILES)
	@for file in $^; do cat "$$file"; echo "\n"; done > d3.ez.js
	@echo Concatinated JS Files

css: $(CSS_FILES)
	@for file in $^; do cat "$$file"; echo "\n"; done > d3.ez.css
	@echo Concatinated CSS Files

min:
	@yuicompressor d3.ez.js -o d3.ez.min.js
	@echo Minified Files

zip: $(GENERATED_FILES)
	@zip d3.ez.zip $^
	@echo Zipped Files

# D3.EZ Makefile

JS_FILES :=        src/js/header.js \
                   src/js/radialBarChart.js \
                   src/js/circularHeatChart.js \
                   src/js/discreteBarChart.js \
                   src/js/groupedBarChart.js \
                   src/js/punchCard.js \
                   src/js/timeSeriesChart.js \
                   src/js/donutChart.js \
                   src/js/htmlTable.js \
                   src/js/htmlList.js \
                   src/js/reusableComponents.js
	
CSS_FILES :=       src/css/global.css \
                   src/css/radialBarChart.css \
                   src/css/circularHeatChart.css \
                   src/css/groupedBarChart.css \
                   src/css/donutChart.css \
                   src/css/htmlList.css \
                   src/css/htmlTable.css

GENERATED_FILES := d3.ez.js \
                   d3.ez.min.js \
                   d3.ez.css \
                   README.md \
                   LICENSE.md

all: js css min zip
.PHONY: js css min zip

js: $(JS_FILES)
	@echo Concatinating JS Files...
	@rm -f d3.ez.js
	@for file in $^; do cat "$$file"; echo "\n"; done > d3.ez.js


css: $(CSS_FILES)
	@echo Concatinating CSS Files...
	@rm -f d3.ez.css
	@for file in $^; do cat "$$file"; echo "\n"; done > d3.ez.css

min:
	@echo Minifying...
	@rm -f d3.ez.min.js
	@yuicompressor d3.ez.js -o d3.ez.min.js


zip: $(GENERATED_FILES)
	@echo Zipping...
	@rm -f d3.ez.zip
	@zip -q d3.ez.zip $^
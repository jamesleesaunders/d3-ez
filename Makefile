# D3.EZ Makefile

JS_FILES :=        src/js/header.js \
                   src/js/chart.js \
									 src/js/component.js \
									 src/js/colors.js \
                   src/js/chart/discreteBar.js \
                   src/js/chart/groupedBar.js \
                   src/js/chart/radialBar.js \
                   src/js/chart/circularHeat.js \
                   src/js/chart/tabularHeat.js \
                   src/js/chart/donut.js \
                   src/js/chart/punchCard.js \
                   src/js/chart/multiSeriesLine.js \
                   src/js/html/table.js \
                   src/js/html/list.js


CSS_FILES :=       src/css/global.css \
                   src/css/chart/groupedBar.css \
                   src/css/chart/radialBar.css \
                   src/css/chart/circularHeat.css \
                   src/css/chart/tabularHeat.css \
                   src/css/chart/donut.css \
                   src/css/chart/punchCard.css \
                   src/css/chart/multiSeriesLine.css \
                   src/css/html/list.css \
                   src/css/html/table.css

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
	@uglifyjs $^ --beautify indent_level=4 --comments all > d3.ez.js

css: $(CSS_FILES)
	@echo Concatinating CSS Files...
	@rm -f d3.ez.css
	@for file in $^; do cat "$$file"; echo "\n"; done > d3.ez.css

min:
	@echo Minifying...
	@rm -f d3.ez.min.js
	@uglifyjs d3.ez.js > d3.ez.min.js

zip: $(GENERATED_FILES)
	@echo Zipping...
	@rm -f d3.ez.zip
	@zip -q d3.ez.zip $^

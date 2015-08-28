# Example Makefile for compiling CSS and Javascript in watched folder

PHONY: optimize

css:
	@cat src/css/file1.css src/css/file2.css > d3.ez.css
	@echo Built d3.ez.css

js:
	@cat src/js/file1.js src/js/file2.js > d3.ez.js
	@echo Built all.js

watch:
	@echo Watching for changes...
	@fswatch src/css:src/js "echo changed && make css js" 

optimize: css js
	@yuicompressor d3.ez.css -o d3.ez.min.css
	@yuicompressor d3.ez.js -o d3.ez.min.js
	@echo Optimized d3.ez.js

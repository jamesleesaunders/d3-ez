/**
 * d3-ez
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2018 James Saunders
 * @license GPLv2
 */

const author = "James Saunders";
const date = new Date();
const copyright = "Copyright (C) " + date.getFullYear() + " " + author;
import { version, license } from "./package.json";

import base from "./src/base";
import chart from "./src/chart";
import component from "./src/component";
import palette from "./src/palette";
import dataTransform from "./src/dataTransform";

const ez = function() {
	const ez = base;
	ez.version = version;
	ez.author = author;
	ez.copyright = copyright;
	ez.license = license;
	ez.chart = chart;
	ez.component = component;
	ez.palette = palette;
	ez.dataTransform = dataTransform;

	// TODO: Remove base when new 'ez' constructor fully tested.
	ez.base = base;

	return ez;
}();

export default ez;

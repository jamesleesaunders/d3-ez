/**
 * d3-ez
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2024 James Saunders
 * @license GPLv2
 */

const author = "James Saunders";
const date = new Date();
const copyright = "Copyright (C) " + date.getFullYear() + " " + author;
import { version, license } from "./package.json";

import chart from "./src/chart";
import component from "./src/component";
import palette from "./src/palette";
import dataTransform from "./src/dataTransform";

const d3Ez = function() {
	return {
		version: version,
		author: author,
		copyright: copyright,
		license: license,
		chart: chart,
		component: component,
		palette: palette,
		dataTransform: dataTransform
	};
}();

export default d3Ez;

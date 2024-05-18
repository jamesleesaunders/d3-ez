/**
 * d3-ez
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2024 James Saunders
 * @license GPLv2
 */

const author = "James Saunders";
const year = new Date().getFullYear();
const copyright = `Copyright (C) ${year} ${author}`;

import {default as packageJson} from "../package.json" with { type: "json" };
const version = packageJson.version;
const license = packageJson.license;

import chart from "./chart.js";
import component from "./component.js";
import palette from "./palette.js";
import dataTransform from "./dataTransform.js";

export default {
		version: version,
		author: author,
		copyright: copyright,
		license: license,
		chart: chart,
		component: component,
		palette: palette,
		dataTransform: dataTransform
};

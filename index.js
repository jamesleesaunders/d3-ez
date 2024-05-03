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

//import { version, license } from "./package.json";
import {default as packageJson} from "./package.json" with { type: "json" };
//let [version, license] = ["4.0.1", "GPLv2"];
const version = packageJson.version;
const license = packageJson.license;

import chart from "./src/chart.js";
import component from "./src/component.js";
import palette from "./src/palette.js";
import dataTransform from "./src/dataTransform.js";

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

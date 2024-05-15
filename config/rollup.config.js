import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";

let banner = `/**
 * d3-ez
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2024 James Saunders
 * @license GPLv2
 */
`;

export default {
	input: "index.js",
	output: {
		file: "dist/d3-ez.js",
		format: "umd",
		extend: true,
		name: "d3.ez",
		banner: banner,
		strict: true,
		globals: { d3: "d3" }
	},
	external: ["d3"],
	plugins: [
		babel({
			exclude: ["node_modules/**", "*.json"],
			babelrc: false,
			babelHelpers: 'bundled',
			presets: [["@babel/preset-env", { modules: false }]],
			plugins: [
				//"@babel/plugin-external-helpers",
				//"@babel/plugin-transform-object-assign",
				"@babel/plugin-syntax-import-attributes"
			]
		}),
		json({
			exclude: ["node_modules/**"]
		})
	]
};

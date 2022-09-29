#!/usr/bin/env node

import { createRequire } from 'module';
import { readFile, stat, writeFile } from "fs/promises"; 
import { getConfig, projectDir, getManifest } from "./helper.js";
import path from "path";

const require = createRequire(import.meta.url);
require("svelte/register");

const DEPLOY_ENV = process.env.DEPLOY_ENV;

async function fileExists(filePath) {
	return stat(filePath)
		.then(() => true)
		.catch(() => false);
}

// render static html for embedding
async function renderHtml(componentFilename, contentFilename) {
	const Component = require(path.join(projectDir, componentFilename)).default;
	if (contentFilename) {
		const dataPath = path.join(projectDir, contentFilename);
		let contentFileExists = await fileExists(dataPath);
		if (contentFileExists) {
			const content = await readFile(dataPath, "utf-8").then(JSON.parse);
			// require component relative to the src/ directory
			const { html } = Component.render({ content: content });
			return html;
		} else {
			console.error("content file not found: " + contentFilename);
			process.exit(1);
		}
	} else {
		const { html } = Component.render();
		return html;
	}
}

async function createEmbed(moduleName, componentFilename, contentFilename, assetPath) {
	const manifest = await getManifest();
	const entryName = `${moduleName}.html`;
	const outputFile = path.join(projectDir, "dist", `${moduleName}-embed.html`);
	const js = `${assetPath}/${manifest[entryName].file}`;
	const rendered = await renderHtml(componentFilename, contentFilename);
	let styles = "";
	for (let style of manifest[entryName].css) {
		styles += `<link href="${assetPath}/${style}" rel="stylesheet" />\n`
	}
	const html = `${styles}<div id="${moduleName}" class="usat-interactive-graphic">${rendered}</div>\n<script src="${js}"></script>\n`;
	return writeFile(outputFile, html, "utf-8");
}

async function main() {
	console.log("Checking for any SSR embeds");
	// @TODO figure out how to configure SSR embeds
	const appConfig = await getConfig();
	const ASSET_PATH = appConfig.asset_path.replace("$BRANCH", DEPLOY_ENV);
	process.env.ASSET_PATH = ASSET_PATH;
	let embeds = [];
	const outputs = appConfig.indepth_embeds;
	if (outputs) {
		outputs.forEach((output) => {
			console.log("Rendering embed for module " + output.name);
			embeds.push(
				createEmbed(output.name, output.component, output.content, ASSET_PATH)
			);
		});
	}
	return Promise.all(embeds);
}

main();


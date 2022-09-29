import { createRequire } from "module";
import { readdirSync, statSync } from "fs";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import YAML from "yaml";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const projectDir = path.join(__dirname, "..");
const srcDir = path.resolve(projectDir, "src");
const distDir = path.join(projectDir, "dist");

function getPackage() {
	return require(path.join(projectDir, "package.json"));
}

export async function getConfig() {
	return await readFile(path.join(projectDir, "graphicconfig.yml"), "utf-8")
		.then(YAML.parse)
		.catch((e) => {
			console.error(e);
			process.exit(1);
		});
}

export const appPackage = getPackage();

// returns a list of all the files in the src directory
function getSourceFiles(folder) {
	const folderContents = readdirSync(folder);
	let results = [];
	for (const item of folderContents) {
		const itemPath = path.resolve(folder, item);
		// check if it is a sub folder and recurse
		if (statSync(itemPath).isDirectory()) {
			results = results.concat(getSourceFiles(itemPath));
		} else {
			results.push(itemPath);
		}
	}
	return results;
}

// checks if a given file path exists on the disk
export function fileExists(filePath) {
	try {
		statSync(filePath);
		return true;
	} catch {
		return false;
	}
}

// if dist/manifest.json exists, return its contents as an object
// if it does not exist, return null
export async function getManifest() {
	const manifestFilePath = path.join(distDir, "manifest.json");
	if (fileExists(manifestFilePath)) {
		return await readFile(manifestFilePath, "utf-8")
			.then(JSON.parse)
			.catch((e) => {
				console.error("Error parsing manifest file");
				console.error(e);
				process.exit(1);
			});
	} else {
		return null;
	}
}

// returns a list of all HTML files in the src directory
export function getBuildInputs() {
	const sourceFiles = getSourceFiles(srcDir);
	const htmlResults = sourceFiles.filter(
		(item) => path.basename(item).toLowerCase().indexOf(".html") >= 0
	);
	let inputs = {};
	for (const item of htmlResults) {
		const name = path.basename(item);
		inputs[name] = item;
	}
	return inputs;
}

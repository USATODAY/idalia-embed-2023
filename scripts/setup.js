#!/usr/bin/env node
import { writeFile, readFile, rm } from "fs/promises";
import path from "path";
import { appPackage, getConfig, projectDir } from "./helper.js";
import YAML from "yaml";

const pathArray = projectDir.split("/");
const slug = pathArray[pathArray.length - 1];

async function generateConfig() {
	const appConfig = await getConfig();
	const configPath = path.join(projectDir, "graphicconfig.yml");

	appConfig.slug = slug;
	appConfig.asset_path = `https://www.gannett-cdn.com/experiments/storytelling-embed/$BRANCH/${slug}`;
	return writeFile(configPath, YAML.stringify(appConfig));
}

function generatePackage() {
	const packagePath = path.join(projectDir, "package.json");
	appPackage.name = slug;
	appPackage.version = "1.0.0";
	appPackage.description = "";
	appPackage.homepage = "";
	appPackage.scripts.deploy = "npm run build && ./scripts/deploy.sh --production --storytelling-embed";
	appPackage.scripts.setup = 'echo "This project has already been initialized."';
	return writeFile(packagePath, JSON.stringify(appPackage, null, 4));
}

async function generateReadme() {
	const templateFilename = path.join(projectDir, "scripts", "__PROJECT_README.md");
	const templateContents = await readFile(templateFilename, {encoding: "utf-8"});
	const modifiedTemplateContents = templateContents.replaceAll("$PROJECT-NAME", slug);
	const readmeFilename = path.join(projectDir, "README.md");
	await rm(readmeFilename);
	await rm(templateFilename);
	return writeFile(readmeFilename, modifiedTemplateContents, {encoding: "utf-8"});
}

function main() {
	console.log("====================================================");
	console.log(
		"   __  _______ ___       __________  ____  _____  __\n  / / / / ___//   |     /_  __/ __ \\/ __ \\/   \\ \\/ /\n / / / /\\__ \\/ /| |      / / / / / / / / / /| |\\  / \n/ /_/ /___/ / ___ |     / / / /_/ / /_/ / ___ |/ /  \n\\____//____/_/  |_|    /_/  \\____/_____/_/  |_/_/   \n                                                    "
	);
	console.log("====================================================");
	console.log("\nWelcome to graphics kit!");
	console.log("Setting up your project now...");
	return Promise.all([generatePackage(), generateConfig(), generateReadme()]);
}
main()
	.then(() => {
		console.log(`\n...Succes!\n\nNew graphic ${slug} is setup and ready to be built`);
	})
	.catch((e) => {
		console.error("Error setting up graphic");
		console.error(e);
		process.exit(1);
	});

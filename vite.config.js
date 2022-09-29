import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
import { getBuildInputs, getConfig } from "./scripts/helper.js";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
	const appConfig = await getConfig();
	const productionMode = mode === "production";
	const DEPLOY_ENV = process.env.DEPLOY_ENV || "dev";
	const ASSET_PATH = productionMode
		? appConfig.asset_path.replace("$BRANCH", DEPLOY_ENV)
		: "/";
	return {
		root: "src",
		base: productionMode ? ASSET_PATH + "/" : "/",
		define: {
			__ASSET_PATH__: JSON.stringify(ASSET_PATH),
			__PRODUCTION__: productionMode,
			__APP_NAME__: JSON.stringify(appConfig.slug),
		},
		build: {
			emptyOutDir: true,
			outDir: "../dist",
			manifest: true,
			rollupOptions: {
				input: getBuildInputs(),
			},
		},
		css: {
			postcss: {
				plugins: [autoprefixer({ flexbox: "no-2009" })],
			},
		},
		plugins: [
			svelte({
				compilerOptions: {
					hydratable: true
				}
			}),
		],
	};
});

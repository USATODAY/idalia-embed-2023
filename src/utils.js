export function urlFor(urlPath) {
	const isAbsUrl = urlPath.substring(0, 4) === "http";
	const assetPath = process.env.ASSET_PATH || window.location.origin + "/";
	if (isAbsUrl) {
		return urlPath;
	}
	return `${assetPath}static/${urlPath}`;
}

import "./fonts.css";
import "./style.css";
import App from "./App.svelte";
import content from "./content.json";

const el = document.getElementById("index");
new App({
	target: el,
});

if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(el, 3000);
	myResizer.watch();
}

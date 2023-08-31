<script>
	import mapboxgl from "mapbox-gl";
	import { onMount, onDestroy, setContext } from "svelte";
	import "../../node_modules/mapbox-gl/dist/mapbox-gl.css";

	export let style;
	export let mapEl;

	let map;

	function initMap() {
		mapboxgl.accessToken =
			"pk.eyJ1IjoidXNhdG9kYXlncmFwaGljcyIsImEiOiJjanh4bWkzY3gwMGg1M2RuNW51NTA1YnJ5In0.PI5qvRHP1632tkBdl8-gaQ";
		const map = new mapboxgl.Map({
			container: mapEl,
			style: style,
			bounds: [-80.9347,25.514909,-78.232576,38.000809],
			scrollZoom: false,
		});
		return map;
	}

	setContext("map", {
		getMap: () => map,
	});

	onMount(() => {
		map = initMap();
	});

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});
</script>

<style>
	.map-wrapper {
		height: 600px;
		margin: 0 auto;
	}
</style>

<div class="map-wrapper" bind:this={mapEl}>
	 {#if map}
		 <slot />
	 {/if}
</div>

<script>
	import Map from "./components/Map.svelte";
	import MapLegend from "./components/MapLegend.svelte";
	import HurricaneLayer from "./components/HurricaneLayer.svelte";

	const mapStyle = "mapbox://styles/usatodaygraphics/cjxxldhzk00mi1cmj699iou3b";
</script>
<MapLegend></MapLegend>
<Map style={mapStyle}>
	<HurricaneLayer data="https://www.gannett-cdn.com/experiments/usatoday/hurricane-tracker/data/2022/ian.json" />
</Map>
<div class="graphic-footer">
<p class="source-line">SOURCE: National Oceanic and Atmospheric Administration (NOAA)</p>
</div>

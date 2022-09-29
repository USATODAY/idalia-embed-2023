<script>
	import { getContext } from "svelte";
	import geobuf from "geobuf";
	import Pbf from "pbf";
	export let data;

	const { getMap } = getContext("map");
	const map = getMap();
	const lineTypes = ["ft", "pt"];
	const stormTypes = [
		{
			name: "Tropical Depression",
			range: {
				low: 0,
				high: 34,
			},
			circle: {
				color: "#FFEBC3",
			},
			polygon: {
				color: "#7FBDFF",
			},
			css_class: "depression",
		},
		{
			name: "Tropical Storm",
			range: {
				low: 34,
				high: 64,
			},
			circle: {
				color: "#FFC98F",
			},
			polygon: {
				color: "#7FBDFF",
			},
			css_class: "storm",
		},
		{
			name: "Category 1",
			range: {
				low: 64,
				high: 83,
			},
			circle: {
				color: "#F5A768",
			},
			polygon: {
				color: "#8A32A3",
			},
			css_class: "cat1",
		},
		{
			name: "Category 2",
			range: {
				low: 83,
				high: 96,
			},
			circle: {
				color: "#E6864B",
			},
			polygon: {
				color: "#8A32A3",
			},
			css_class: "cat2",
		},
		{
			name: "Category 3",
			range: {
				low: 96,
				high: 113,
			},
			circle: {
				color: "#D46637",
			},
			polygon: {
				color: "#8A32A3",
			},
			css_class: "cat3",
		},
		{
			name: "Category 4",
			range: {
				low: 113,
				high: 137,
			},
			circle: {
				color: "#C0462A",
			},
			polygon: {
				color: "#8A32A3",
			},
			css_class: "cat4",
		},
		{
			name: "Category 5",
			range: {
				low: 137,
				high: Infinity,
			},
			circle: {
				color: "#AA1E23",
			},
			polygon: {
				color: "#8A32A3",
			},
			css_class: "cat5",
		},
	];

	async function loadHurricane(url) {
		const r = await fetch(url).then(async (d) => await d.arrayBuffer());
		return geobuf.decode(new Pbf(r));
	}

	function fixLineSegment(stormGeo) {
		let i;
		for (i = 0; i < stormGeo.features.length; i++) {
			// We only care about the line segment features
			if (stormGeo.features[i].geometry.type === "LineString") {
				// Once we find the forecast track, we add the first (current position) coordinate from the forecast track section to the end of the coordinate array for the past track section thus adding the missing line segment.
				if (stormGeo.features[i].properties.at === "ft") {
					stormGeo.features[i - 1].geometry.coordinates.push(
						stormGeo.features[i].geometry.coordinates[0]
					);
				}
			}
		}
		return stormGeo;
	}

	function addLine(lineType) {
		let paint = {
			"line-color": "#A5A5A5",
			"line-width": 2.5,
		};
		if (lineType === "ft") {
			paint["line-dasharray"] = [2, 2];
		}
		map.addLayer({
			id: "storm-line-" + lineType,
			type: "line",
			source: "storm-data",
			paint: paint,
			filter: ["all", ["==", "$type", "LineString"], ["==", "at", lineType]],
		});
	}

	function addWind() {
		map.addLayer({
			id: "stormLayer",
			type: "fill",
			source: "storm-data",
			paint: {
				"fill-color": "#7FBDFF",
				"fill-opacity": 0.5,
			},
			filter: ["all", ["==", "$type", "Polygon"], ["!=", "at", "fc"]],
		});
	}

	function addPoints() {
		for (let stormType of stormTypes) {
			map.addLayer({
				id: "storm-points-" + stormType.css_class,
				type: "circle",
				source: "storm-data",
				paint: {
					"circle-radius": 2.4,
					"circle-opacity": 0,
					"circle-stroke-width": 3.2,
					"circle-stroke-color": stormType.circle.color,
				},
				// give color a range
				filter: [
					"all",
					["==", "$type", "Point"],
					[">=", "wind", stormType.range.low],
					["<=", "wind", stormType.range.high],
				],
			});
		}
	}

	function addLabels() {
		map.addLayer({
			id: "storm-labels",
			type: "symbol",
			source: "storm-data",
			paint: {
			},
			// give color a range
			filter: [
				"all",
				["==", "$type", "Point"],
			],
		});

	}

	const hurricaneData = loadHurricane(data);
	hurricaneData.then((d) => {
		map.on("load", () => {
			map.addSource("storm-data", {
				type: "geojson",
				data: fixLineSegment(d),
			});

			addWind();
			addLine("pt");
			addLine("ft");
			addPoints();
		})
	});
</script>

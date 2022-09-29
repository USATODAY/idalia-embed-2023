<div class="legend">
	<p class="legend-label">Category</p>
	<div class="legend-item">
		<div class="legend-point cat5"></div>
		<p class="legend-label">5</p>
	</div>
	<div class="legend-item">
		<div class="legend-point cat4"></div>
		<p class="legend-label">4</p>
	</div>
	<div class="legend-item">
		<div class="legend-point cat3"></div>
		<p class="legend-label">3</p>
	</div>
	<div class="legend-item">
		<div class="legend-point cat2"></div>
		<p class="legend-label">2</p>
	</div>
	<div class="legend-item">
		<div class="legend-point cat1"></div>
		<p class="legend-label">1</p>
	</div>
	<div class="legend-item">
		<div class="legend-point storm"></div>
		<p class="legend-label">Tropical storm</p>
	</div>
	<div class="legend-item">
		<div class="legend-area wind"></div>
		<p class="legend-label">Area of tropical-storm-force winds</p>
	</div>
</div>
<style>
	.legend {
		display: flex;
		padding: 1em 0;
		max-width: 800px;
		margin: 0 auto;
		flex-wrap: wrap;
	}
	.legend-item {
		margin-right: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: 5px;
	}
	.legend-area {
		height: 12px;
		width: 12px;
		background: #7FBDFF;
		margin-right: 5px;
		border-radius: 2px;
		flex-shrink: 0;
	}
	.legend-point {
		height: 12px;
		width: 12px;
		border: solid 3px #404040;
		border-radius: 50%;
		margin-right: 5px;
		flex-shrink: 0;
	}
	.legend-point.depression {
		border-color: #FFEBC3;
	}
	.legend-point.storm {
		border-color: #FFC98F;
	}
	.legend-point.cat1 {
		border-color: #F5A768;
	}
	.legend-point.cat2 {
		border-color: #E6864B;
	}
	.legend-point.cat3 {
		border-color: #D46637;
	}
	.legend-point.cat4 {
		border-color: #C0462A;
	}
	.legend-point.cat5 {
		border-color: #AA1E23;
	}
	.legend-label {
		font-size: 12px;
	}
</style>

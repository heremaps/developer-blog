const map = new harp.MapView({
   canvas: document.getElementById('map'),
   theme: "theme.json",
   maxVisibleDataSourceTiles: 40, 
   tileCacheSize: 100
});

map.resize(window.innerWidth, window.innerHeight);
window.onresize = () => map.resize(window.innerWidth, window.innerHeight);

const omvDataSource = new harp.OmvDataSource({
   baseUrl: "https://xyz.api.here.com/tiles/herebase.02",
   apiFormat: harp.APIFormat.XYZOMV,
   styleSetName: "tilezen",
   authenticationCode: 'AaEqtplvlWF4r0KXvrH-f5U',
});
map.addDataSource(omvDataSource);

const controls = new harp.MapControls(map);

const options = { 
   tilt: 50, 
   distance: 3000,
   center: new harp.GeoCoordinates(42.361145, -71.057083),
   angle: 50
};

map.addEventListener(harp.MapViewEventNames.Render, () => {
   map.lookAt(options.center, options.distance, options.tilt, (options.angle += 0.07))
});
map.beginAnimation();


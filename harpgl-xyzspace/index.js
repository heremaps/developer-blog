
const TOKEN = 'AS5fV38SlsAWy5busf3eizY';
const SPACE_ID = '8NXQJlgF';
const map = new harp.MapView({
   canvas: document.getElementById('map'),
   theme: "https://unpkg.com/@here/harp-map-theme@latest/resources/berlin_tilezen_day_reduced.json",
});

map.setCameraGeolocationAndZoom(
   new harp.GeoCoordinates(-10.617488, -70.065335),
   5
);

const controls = new harp.MapControls(map);
controls.maxPitchAngle = 90;
controls.setRotation(20, 50);

window.onresize = () => map.resize(window.innerWidth, window.innerHeight);

const omvDataSource = new harp.OmvDataSource({
   baseUrl: "https://xyz.api.here.com/tiles/herebase.02",
   apiFormat: harp.APIFormat.XYZOMV,
   styleSetName: "tilezen",
   authenticationCode: TOKEN,
});
map.addDataSource(omvDataSource);

const xyzSpaceDataSource = new harp.OmvDataSource({
   baseUrl: `https://xyz.api.here.com/hub/spaces/${SPACE_ID}/tile/web`,
   apiFormat: harp.APIFormat.XYZSpace,
   authenticationCode: TOKEN,
});

map.addDataSource(xyzSpaceDataSource).then(() => {
   const colorConfig = [
      { classification: 'Wild', color: '#E85A3C' },
      { classification: 'Recreational', color: '#3C7EE8' },
      { classification: 'Scenic', color: '#D04FFF' }
   ];

   const styles = colorConfig.map(x => {
      return {
         "when": `$geometryType ^= 'line' && properties.CLASSIFICATION == '${x.classification}'`,
         "renderOrder": 1000,
         "technique": "solid-line",
         "attr": {
            "color": x.color,
            "metricUnit": "Pixel",
            "lineWidth": 3
         }
      }
   });
   xyzSpaceDataSource.setStyleSet(styles);
   map.update();
});

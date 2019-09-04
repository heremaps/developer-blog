class MapRotation {
   constructor(map) {
      this.map = map;
      this.interval;
      this.heading = this.map.getViewModel().getLookAtData().heading;
   }

   start() {
      this.map.getViewModel().setLookAtData({
         tilt: 60,
         heading: this.heading += 0.015
      }, true);

      setTimeout(() => {
         this.interval = setInterval(() => {
            this.map.getViewModel().setLookAtData({
               tilt: 60,
               heading: this.heading += 0.015
            });
         }, 10)
      }, 300)
   }

   stop() {
      clearInterval(this.interval);
      this.map.getViewModel().setLookAtData({
         tilt: 0,
         heading: 180
      }, true);
   }
}

export default MapRotation;

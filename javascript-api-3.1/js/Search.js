import { $ } from './helpers.js';
import { autocompleteGeocodeUrl, requestGeocode } from './here.js';
import { center } from './config.js';
import { calculateIsoline, marker } from './app.js';

class Search {

   constructor(startLocation) {
      this.active = 0;
      this.matches = [];
      this.container = $('.search-container');
      this.input = $('.city-field');
      this.input.innerText = startLocation;
      this.input.oninput = (evt) => this.updateField(evt);
      this.input.onkeydown = (evt) => this.onkeyinput(evt);
      this.label = '';
   }

   async updateField(evt) {
      const value = evt.target.innerText;
      if (value.length === 0) {
         return;
      }
      
      this.matches = await fetch( autocompleteGeocodeUrl(value) ).then(res => res.json());
      const match = this.matches.suggestions.filter(x => x.matchLevel === 'city')[0];

      if (match === undefined) {
         $('.city-field-suggestion').innerText = '';
      } else {
         this.label = match.address.city + ', ' +  match.countryCode;
         this.active = match.locationId;
         $('.city-field-suggestion').innerText = value + this.label.substring(value.length, this.label.length);
      }
   }

   onkeyinput(evt) {
      const code = evt.keyCode;
      if (code === 13 || code === 9) {
         $('.city-field').innerText = this.label;
         $('.city-field-suggestion').innerText = '';
         evt.preventDefault();
         this.selectMatch();
      }
   }

   async selectMatch() {
      const { Latitude: lat, Longitude: lng } = await requestGeocode(this.active);
      center.lat = lat;
      center.lng = lng;
      marker.setGeometry(center);
      calculateIsoline();
   }
}

export default Search;
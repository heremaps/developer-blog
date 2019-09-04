const $ = q => document.querySelector(q);
const $$ = qq => document.querySelectorAll(qq);

function toAMPMFormat(val) {
   val = Number(val);
   if (val === 0) {
      return '12:00 AM';
   } else if (val < 12) {
      return `${val}:00 AM`;
   } else if (val === 12) {
      return `12:00 PM`;
   } else {
      return `${val - 12}:00 PM`;
   }
}

function to24HourFormat(val) {
   val = val + ':00';
   return val.length === 4 ? '0' + val : val;
}

function toDateInputFormat(val) {
   const local = new Date(val);
   local.setMinutes(val.getMinutes() - val.getTimezoneOffset());
   return local.toJSON().slice(0, 10);
}

function formatRangeLabel(range, type) {
   if (type === 'time') {
      const minutes = range / 60;
      if (minutes < 60) {
         return minutes.toFixed(0) + ' mins';
      } else {
         return (minutes / 60).toFixed(0) + ' hours, ' + (minutes % 60).toFixed(0) + ' mins';
      }
   } else { //Distance
      if (range < 2000) {
         return range + ' meters';
      } else {
         const km = range / 1000;
         return km.toFixed(1) + ' KM';
      }  
   }
}

export {
   $,
   $$,
   toAMPMFormat,
   to24HourFormat,
   toDateInputFormat,
   formatRangeLabel
}
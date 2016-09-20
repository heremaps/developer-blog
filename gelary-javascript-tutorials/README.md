# Blog series “Gelary”

This repository holds a series of tutorials for building a web application from start to finish using the **HERE Maps API for JavaScript**. More information about the API can be found on [developer.here.com](https://developer.here.com/javascript-apis/) under the JavaScript APIs section.

> **Note:** In order to get the sample code to work, you **must** replace all instances of `{YOUR_APP_ID}` and `{YOUR_APP_CODE}` within the code and use your own **HERE** credentials.

> You can obtain a set of credentials from the [Plans Page](https://developer.here.com/plans/api/consumer-mapping) on developer.here.com.

See the [LICENSE](LICENSE) file in the root of this project for license details.

## Who wants ice cream?! 

In this series of blog posts we are going to develop a small web application called “Gelary” using HERE maps and services. Gelary aims to disrupt the ice–cream market by enabling ice–cream producers to deliver their sweet goods directly to their customers, wherever they are.

The final application will resemble a mobile dashboard view for the employees of our little start–up which they can either take on the road or use at Gelary HQ to plan their work.

It will consist of a map and a floating control panel behind a menu button. The map is used to visualise a route, starting from the user’s current position along a series of customers, and the traffic situation along the route. The control panel will enable our delivery drivers to search for nearby ice cream shops, display turn–by–turn directions as well as to calculate the best pick–up location for a group of selected customers. The app will also be able to handle order changes: e.g. if a customer cancels or updates his or her position, the route will automatically be recalculated.

To keep things simple our application will use plain Javascript (ES5) and front–end technologies and will target mobile and desktop browsers alike.
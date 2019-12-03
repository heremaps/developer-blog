// codes and keys. Got from developer.here.com
var app_id = "MMRyT9PioGx6DeImyPie",
	app_code = "SB7YD1dqPH40vz-lSJE19g",
	app_id_cors = "BTp1kLd1IpptcQe2Ir3h",
	app_code_cors = "zMDPaKTAFR2g3wF3h4ok7w",
	api_key = "43ZNwPKXbl1IXT3H4qSdaSs0xAw_M76NaT_7bmlju98";

// Require variables
var routeIDs = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
var routeColors = [];
var mapContainer = document.getElementById('mapContainer');

// check if the site was loaded via secure connection
var secure = (location.protocol === 'https:') ? true : false;

// Create a platform object to communicate with the HERE REST APIs
var platform = new H.service.Platform({
	apikey: '43ZNwPKXbl1IXT3H4qSdaSs0xAw_M76NaT_7bmlju98',
	useCIT: true,
	useHTTPS: secure
}),
	maptypes = platform.createDefaultLayers(),
	geocoder = platform.getGeocodingService(),
	router = platform.getRoutingService(),
	group = new H.map.Group(),
	markerGroup = new H.map.Group(),
	map = new H.Map(
		document.getElementById('mapContainer'),
		maptypes.vector.normal.map,
		{
			zoom: 8,
			center: { lat: 40.730610, lng: -73.935242 }
		});

window.addEventListener('resize', () => map.getViewPort().resize());

// add behavior control
new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// add UI
var ui = H.ui.UI.createDefault(map, maptypes);
// End rendering the initial map

// add long click in map event listener
map.addEventListener('longpress', handleLongClickInMap);
// Required variables for the route api 

var routeButton = document.getElementById("routeButton2");
var start = document.getElementById("start");
var dest = document.getElementById("dest");
var mapReleaseTxt = document.getElementById("mapReleaseTxt");

var pointA, pointB, startMarker = null, destMarker = null, routeLinkHashMap = new Object(), routerMapRelease, release,
	currentBubble, currentOpenBubble, bErrorHappened = false, bLongClickUseForStartPoint = true;

var routeColor = ["rgba(0, 170, 255,1)", "rgba(0, 189, 2,1)", "rgb(73, 78, 218)"],
	ppType_A_Color = ["rgba(255, 255, 0, 0.8)", "rgba(255, 255, 0, 0.7)", "rgba(255, 255, 0, 0.6)"],
	ppType_a_Color = ["rgba(255, 216, 0, 0.8)", "rgba(255, 216, 0, 0.7)", "rgba(255, 216, 0, 0.6)"],
	ppType_S_Color = ["rgba(255, 0, 0, 0.8)", "rgba(255, 0, 0, 0.7)", "rgba(255, 0, 0, 0.6)"],
	ppType_p_Color = ["rgba(255, 127, 127, 0.8)", "rgba(255, 127, 127, 0.7)", "rgba(255, 127, 127, 0.6)"],
	ppType_F_Color = ["rgba(214, 127, 255, 0.8)", "rgba(214, 127, 255, 0.7)", "rgba(214, 127, 255, 0.6)"],
	ppType_K_Color = ["rgba(178, 0, 255, 0.8)", "rgba(178, 0, 255, 0.7)", "rgba(178, 0, 255, 0.6)"],
	ppType_U_Color = ["rgba(0, 204, 0, 0.8)", "rgba(0, 204, 0, 0.7)", "rgba(0, 204, 0, 0.6)"];
var tollCostStroke = 5, routeStroke = 5;
var strRoutingRequestSend = "Waiting for response...";
var strTceRequestSend = "Route Toll Cost request sent and logged. Waiting for response...";
var strTceError = "An Error happened during Route Toll Cost calculation. Please check the vehicle specification<br/>F.e. Trailer number set but no trailer type.";
var strTceResponseReceived = "Received TCE response. Processing it now.";
// toll image
var tollImg = document.createElement("img");
tollImg.src = "tollimg.gif";
var tollIcon = new H.map.Icon(tollImg, { anchor: new H.math.Point(10, 35) });
map.addObject(markerGroup);


function clearLastRouteCalculation() {
	bErrorHappened = false;
	bLongClickUseForStartPoint = true;
	if (currentOpenBubble) {
		ui.removeBubble(currentOpenBubble);
	}
	group.removeAll();

}

var startRouteCalculation = function () {
	$('#mydiv').fadeIn('slow');
	clearLastRouteCalculation();
	geocode(start.value, true);
}
routeButton.onclick = startRouteCalculation;


function handleLongClickInMap(currentEvent) {
	var lastClickedPos = map.screenToGeo(currentEvent.currentPointer.viewportX, currentEvent.currentPointer.viewportY);

	if (bLongClickUseForStartPoint) {
		clearLastRouteCalculation();
		var line1 = "" + lastClickedPos.lat + "," + lastClickedPos.lng;
		var line2 = null;
		start.value = line1;
		pointA = new H.geo.Point(lastClickedPos.lat, lastClickedPos.lng)
		if (startMarker != null) {
			markerGroup.removeObject(startMarker);
		}
		startMarker = new H.map.Marker(pointA,
			{
				icon: createIconMarker(line1, line2)
			});
		markerGroup.addObject(startMarker);
		bLongClickUseForStartPoint = false;
	}
	else {
		var line1 = "" + lastClickedPos.lat + "," + lastClickedPos.lng;
		var line2 = null;
		dest.value = line1;
		pointB = new H.geo.Point(lastClickedPos.lat, lastClickedPos.lng)
		if (destMarker != null) {
			markerGroup.removeObject(destMarker);
		}
		destMarker = new H.map.Marker(pointB,
			{
				icon: createIconMarker(line1, line2)
			});
		markerGroup.addObject(destMarker);
		bLongClickUseForStartPoint = true;
	}

	map.getViewModel().setLookAtData({ bounds: markerGroup.getBoundingBox(), zoom: 5 }, true);
}


var geocode = function (searchTerm, start) {
	//add Geocoder Release information if not already done

	geocoder.search(
		{
			searchText: searchTerm
		},
		function (result) {
			if (result.Response.View[0].Result[0].Location != null) {
				pos = result.Response.View[0].Result[0].Location.DisplayPosition;
			}
			else {
				pos = result.Response.View[0].Result[0].Place.Locations[0].DisplayPosition;
			}

			if (start)
				pointA = new H.geo.Point(pos.Latitude, pos.Longitude);
			else
				pointB = new H.geo.Point(pos.Latitude, pos.Longitude);

			if (result.Response.View[0].Result[0].Location != null) {
				address = result.Response.View[0].Result[0].Location.Address;
			}
			else {
				address = result.Response.View[0].Result[0].Place.Locations[0].Address;
			}


			line1 = pos.Latitude + " " + pos.Longitude;
			line2 = address.Label;

			if (start) {
				if (startMarker != null) {
					markerGroup.removeObject(startMarker);
				}
				startMarker = new H.map.Marker(pointA,
					{
						icon: createIconMarker(line1, line2)
					});
				markerGroup.addObject(startMarker);

			}
			else {
				if (destMarker != null) {
					markerGroup.removeObject(destMarker);
				}
				destMarker = new H.map.Marker(pointB,
					{
						icon: createIconMarker(line1, line2)
					});
				markerGroup.addObject(destMarker);

				map.getViewModel().setLookAtData({
					bounds: markerGroup.getBoundingBox(),
					zoom: 6
				}, true);

			}
			if (start)
				geocode(dest.value, false);
			else
				calculateRoute(pointA, pointB);
		},
		function (error) {
			alert("Source and Destinations inputs are required!")
			$('#mydiv').fadeOut('slow');
			alert(error);
		}
	);
}


var calculateRoute = function (start, destination) {
	feedbackTxt.innerHTML = ''
	// generate routing request
	var transportMode = "car";
	if (vehicles.value == "3" || vehicles.value == "9") {
		transportMode = "truck"
	}
	if (vehicles.value == "9" && serverURL.value.search("fleet") != -1) {
		transportMode = "delivery"
	}

	var hasTrailer = null, shippedHazardousGoods = null, limitedWeight = null, trailerWeight = null,
		height = null, width = null, length = null, heightAbove1stAxle = null;

	if (parseInt(trailerType.value) > 0) {
		hasTrailer = "&trailersCount=1";
	}

	if (parseInt(hazardousType.value) == 1) {
		shippedHazardousGoods = "&shippedHazardousGoods=explosive";
	}
	else if (parseInt(hazardousType.value) == 2) {
		shippedHazardousGoods = "&shippedHazardousGoods=other";
	}

	if (parseInt(vehWeight.value) > 0) {
		if (parseInt(vehWeight.value) > parseInt(totalWeight.value)) {
			alert("Total Weight cannot be smaller than Vehicle Weight");
			return;
		}
		limitedWeight = "&limitedWeight=" + (totalWeight.value / 1000) + "t";// router 7.2 used by TCE includes trailer weight
	}


	if (parseInt(vehHeight.value) > 0 || parseInt(trailerHeight.value) > 0) {
		height = "&height=" + ((parseInt(vehHeight.value) > parseInt(trailerHeight.value) ? parseInt(vehHeight.value) : parseInt(trailerHeight.value)) / 100) + "m";
	}

	if (parseInt(totalWidth.value) > 0) {
		width = "&width=" + (totalWidth.value / 100);
	}

	if (parseInt(totalLength.value) > 0) {
		length = "&length=" + (totalLength.value / 100);
	}

	if (document.getElementById("heightAbove1stAxle").value != 0) {
		heightAbove1stAxle = (document.getElementById("heightAbove1stAxle").value / 100) + "m";
	}


	var vspec = `&tollVehicleType=${vehicles.value}&trailerType=0&vehicleNumberAxles=2&trailerNumberAxles=0&hybrid=0
			&emissionType=5&fuelType=petrol&trailerHeight=${trailerHeight.value}&vehicleWeight=${vehWeight.value}
			&disabledEquipped=${disabledEquipped.value}&minimalPollution=minPollution.value&hov=${hov.value}
			&passengersCount=${nrPassengers.value}&tiresCount=${nrOfTotalTires.value}&commercial=${commercial.value}
			&heightAbove1stAxle=${heightAbove1stAxle}`;


	if (width != null && width.length > 0) vspec += width;
	if (length != null && length.length > 0) vspec += length;
	if (shippedHazardousGoods != null && shippedHazardousGoods.length > 0) vspec += shippedHazardousGoods;
	var routerParamsValue = '';
	var finalParamsValue = '';
	if (routerParamsValue !== '') {
		var paramsArray = [];
		var components = routerParamsValue.split('&');
		for (var i = 0; i < components.length; i++) {
			var key = components[i].split('=');
			if (key[0].substr(0, 'waypoint'.length) === 'waypoint') {
				continue;// ignore waypoints because we already specified.
			}
			if (key[0] === 'mode') {
				continue;// Ignore mode since cor build this inside
			}
			paramsArray.push(components[i]);
		}
		finalParamsValue = paramsArray.join('&');
	}

	var routeAlternativesRequested = false;
	if (document.getElementById("routeAlternatives").value != null && document.getElementById("routeAlternatives").value != "0") {
		routeAlternativesRequested = true;
	}
	var isDTFilteringEnabled = document.getElementById("chkEnableDTFiltering").checked;

	var rollupPrm = serverURL.value.search("fleet") != -1 ? "rollups" : "rollup"

	// Preparing the tollcost API end with all required params
	var urlRoutingReq = `${serverURL.value}/2/calculateroute.json?jsonAttributes=41&waypoint0=${start.lat},${start.lng}&detail=1
	&waypoint1=${destination.lat},${destination.lng}&routelegattributes=li&routeattributes=gr&maneuverattributes=none
	&linkattributes=${'none,rt,fl'}&legattributes=${'none,li,sm'}&currency=${document.getElementById('currency').value}&departure=
	${isDTFilteringEnabled ? document.getElementById("startRouteDate").value + "T" + document.getElementById("startRouteTime").value : ''}
	${vspec}&mode=fastest;${transportMode};traffic:disabled${((shippedHazardousGoods != null && shippedHazardousGoods.length > 0) ? shippedHazardousGoods : "")}
	&${rollupPrm}=none,country;tollsys${(routeAlternativesRequested ? "&alternatives=" + document.getElementById("routeAlternatives").value : '')}
	&app_id=${app_id}${(finalParamsValue !== '' ? '&' + finalParamsValue : '')}&app_code=${app_code}&jsoncallback=parseRoutingResponse`

	$('#mydiv').fadeIn('slow');

	script = document.createElement("script");
	script.src = urlRoutingReq;
	document.body.appendChild(script);
}


function newFunction() {
	var hasTrailer = null, shippedHazardousGoods = null, limitedWeight = null, trailerWeight = null, height = null, width = null, length = null, heightAbove1stAxle = null;
	return { hasTrailer, shippedHazardousGoods, limitedWeight, height, width, length, heightAbove1stAxle };
}

function parseRoutingResponse(resp) {
	feedbackTxt.innerHTML = ''
	if (resp.errors != undefined && resp.errors.length != 0) {
		if (resp.errors[resp.errors.length - 1] == "NoRouteFound") {
			alert('Please consider to change your start or destination as the one you entered is not reachable with the given vehicle profile');
			feedbackTxt.innerHTML = 'The Router service is unable to compute the route: try to change your start / destination point';
		}
		else {
			alert(JSON.stringify(resp));
			$('#mydiv').fadeIn('slow');
			feedbackTxt.innerHTML = JSON.stringify(resp);
		}
		return;
	}
	if (resp.response == undefined) {
		if (resp.subtype == "NoRouteFound") {
			alert('Please consider to change your start or destination as the one you entered is not reachable with the given vehicle profile');
			feedbackTxt.innerHTML = 'The Router service is unable to compute the route: try to change your start / destination point';
		}
		else {
			alert(resp.subtype + " " + resp.details);
			feedbackTxt.innerHTML = resp.error;
		}
		return;
	}

	routeLinkHashMap = new Object();


	// create link objects
	for (var r = 0; r < resp.response.route.length; r++) {
		for (var m = 0; m < resp.response.route[r].leg[0].link.length; m++) {
			var strip = new H.geo.LineString(),
				shape = resp.response.route[r].leg[0].link[m].shape,
				i,
				l = shape.length;
			for (i = 0; i < l; i += 2) {
				strip.pushLatLngAlt(shape[i], shape[i + 1], 0);
			}
			routeColors[r] = routeColor[r];
			var link = new H.map.Polyline(strip,
				{
					style: {
						lineWidth: (routeStroke - (r + 1)), // alternatives get smaller line with
						strokeColor: routeColor[r],
					}
				});
			link.setArrows({ color: "#F00F", width: 2, length: 3, frequency: 4 });
			link.$linkId = resp.response.route[r].leg[0].link[m].linkId;

			routeLinkHashMap[(resp.response.route[r].leg[0].link[m].linkId.lastIndexOf("+", 0) === 0 ? resp.response.route[r].leg[0].link[m].linkId.substring(1) : resp.response.route[r].leg[0].link[m].linkId)] = link;

			group.addObject(link);
			link.addEventListener('tap', function (e) {

				var link = new H.map.Polyline(strip,
					{
						style: {
							lineWidth: (routeStroke - (r + 1)), // alternatives get smaller line with
							strokeColor: 'rgba(240, 255, 0, 1)',
							lineCap: 'butt'
						}
					});
				map.addObject(link);
			})
		}
	}

	map.addObject(group);

	(async function () {
		await sleep(2000);
		map.setZoom(map.getViewModel().getLookAtData().zoom - 1);

		console.log('sleep')
	})();
	map.getViewModel().setLookAtData({ bounds: group.getBoundingBox() }, true);

	for (var i = 0; i < resp.response.route.length; i++) {

		highlightRoute(resp.response.route[i].tollCost.routeTollItems, i);

		showTceCost(resp.response.route[i].tollCost.costsByCountryAndTollSystem, resp.response.route[i].cost, resp.response.route[i].summary, resp.warnings, routeIDs[i], routeColors[i]);
		//feedbackTxt.innerHTML += JSON.stringify(resp.response.route[i].summary);
	}
	$('#mydiv').fadeOut('slow')
}
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
function showTceCost(costByCountryAndTollSystem, costs, summary, warnings, routeName, routeColors) {

	var html_code = ''


	if (warnings) {
		for (var j = 0; j < warnings.length; j++) {
			// check only category 10 -> boat ferry and train ferry, both can be on one route.
			if (warnings[j].category == 10 && warnings[j].context.includes("boat")) {
				feedbackTxt.innerHTML += "<br/></br><span style=\"color:#ff0000\">Route contains boat ferry links which might add cost</span>";
			}
			else if (warnings[j].category == 10 && warnings[j].context.includes("train")) {
				feedbackTxt.innerHTML += "<br/></br><span style=\"color:#ff0000\">Route contains train ferry links which might add cost</span>";
			}
		}
	}

	if (!costs) {
		//feedbackTxt.innerHTML += "<br/><br/>None.";
	} else {
		html_code += '<div class="card" style="width: 23rem;border: 8px solid rgba(0,0,0,.125);"><div class="card-body">';
		html_code += '<div style="height: 28px; padding: 5px; border-radius: 10px; margin-bottom: 5px; text-align: center; color: aliceblue; width: 300px;background-color:' + routeColors + '"><h6>Route: ' + routeName + '</h6></div>';
		html_code += "<p>Total Toll Cost: " + costs.totalCost + " " + costs.currency + '. ' + summary.text + "</p>";

	}

	if (costByCountryAndTollSystem != null) {

		var feedback = "";
		feedback += "";

		var prevCoutry = ''

		if (costByCountryAndTollSystem.length > 0) {
			feedback += "<h8>Toll Cost breakdown:</h8>";
		}

		for (var j = 0; j < costByCountryAndTollSystem.length; j++) {

			if (prevCoutry != costByCountryAndTollSystem[j].country) {

				feedback += "<p style=\"font-weight: bold;\">" + costByCountryAndTollSystem[j].country + "</p>"
				prevCoutry = costByCountryAndTollSystem[j].country
			}

			feedback += "<ul><li>";
			if (costByCountryAndTollSystem[j].name != null && costByCountryAndTollSystem[j].name.trim().length > 0) {
				feedback += "" + costByCountryAndTollSystem[j].name + ": ";
			} else if (costByCountryAndTollSystem[j].tollSystemId != null && costByCountryAndTollSystem[j].tollSystemId.trim().length > 0) {
				feedback += "Toll System ID " + costByCountryAndTollSystem[j].tollSystemId + ": "
			} else {
				feedback += "Toll : ";
			}
			feedback += costByCountryAndTollSystem[j].amountInTargetCurrency + " " + costs.currency;
			feedback += "</li></ul>";

		}

		html_code += feedback;

	}
	feedbackTxt.innerHTML += html_code + '</div>';
	return; // done

}

/**
	Highlights the toll links in map display
*/
function highlightRoute(routeTollItems, routeAlternative) {
	if (routeTollItems != null) {
		for (var i = 0; i < routeTollItems.length; i++) {
			var tollType = routeTollItems[i].tollType;
			var color = ppType_S_Color[routeAlternative];
			if (tollType == 'A') {
				color = ppType_A_Color[routeAlternative];
			} else if (tollType == 'a') {
				color = ppType_a_Color[routeAlternative];
			} else if (tollType == 'S') {
				color = ppType_S_Color[routeAlternative];
			} else if (tollType == 'p') {
				color = ppType_p_Color[routeAlternative];
			} else if (tollType == 'F') {
				color = ppType_F_Color[routeAlternative];
			} else if (tollType == 'K') {
				color = ppType_K_Color[routeAlternative];
			} else if (tollType == 'U') {
				color = ppType_U_Color[routeAlternative];
			}

			for (var j = 0; j < routeTollItems[i].linkIds.length; j++) {
				// set color and stroke of links
				var tollstroke = (tollCostStroke - (routeAlternative + 1));	// route alternatives have a different stroke
				var link = routeLinkHashMap[routeTollItems[i].linkIds[j]];
				if (link.getStyle().strokeColor == routeColor[routeAlternative]) { // only change link color to toll color if not already modified
					link.setStyle({ strokeColor: color, lineWidth: tollstroke });
				}
			}

			//toll structures
			if (routeTollItems[i].tollStructures != null) {
				for (var j = 0; j < routeTollItems[i].tollStructures.length; j++) {
					console.log({ 'routeTollItems': routeTollItems[i] })
					createTollMarker(routeTollItems[i].tollStructures[j], routeTollItems[i]);
				}
			}
		}
	}

}

//--- Helper - Create Start / Destination marker
var createIconMarker = function (line1, line2) {
	var svgMarker = svgMarkerImage_Line;

	svgMarker = svgMarker.replace(/__line1__/g, line1);
	svgMarker = svgMarker.replace(/__line2__/g, (line2 != undefined ? line2 : ""));
	svgMarker = svgMarker.replace(/__width__/g, (line2 != undefined ? line2.length * 4 + 20 : (line1.length * 4 + 80)));
	svgMarker = svgMarker.replace(/__widthAll__/g, (line2 != undefined ? line2.length * 4 + 80 : (line1.length * 4 + 150)));

	return new H.map.Icon(svgMarker, {
		anchor: new H.math.Point(24, 57)
	});

};

// Toll cost object (country)
function CountryTce() {
	this.name = "";
	this.adminAdmissionCost = [];	// CostTce array
	this.roadSectionCost = [];		// CostTce array
	this.tollSystemsNames = [];     // TollSystem array
	this.usageFeeRequiredLinks = null;
}

function TollSystem() {
	this.id = null;
	this.names = [];  // TollSystemName array
}

function TollSystemName() {
	this.languageCode = null;
	this.name = null;
}

// Toll cost object (toll info)
function CostTce() {
	this.name = "";
	this.linkIds = []; // String array
	this.conditions = []; // TceConditon array
	this.tollStructures = []; // TollStructure array
}

function TollStructure() {
	this.linkId1 = "";
	this.linkId2 = "";
	this.name = "";
	this.lngCode = "";
	this.latitude = 0;
	this.longitude = 0;
}

// Toll cost object (conditions)
function TceCondition() {
	this.time = null;
	this.pass = null;
	this.amount = null;
	this.currency = null;
	this.methodsOfPayment = null;
	this.daylightHours = null;
	this.discountAvailable = null;
	this.tollSystemsIds = null;
}

// Helper for selecting the value attached to a JS selection
function selectionSettingHelper(selection, value) {
	for (var opt, j = 0; opt = selection.options[j]; j++) {
		if (opt.value == value) {
			selection.selectedIndex = j;
			break;
		}
	}
}


function getTollSystemName(tollSystemId, tollSystemsNames) {
	if (tollSystemId.indexOf(",") == -1) {
		return getTollSystemNameWithLanguageCode(tollSystemId, tollSystemsNames, "ENG");
	}
	var splitTsn = tollSystemId.split(",");
	return (getTollSystemNameWithLanguageCode(splitTsn[0], tollSystemsNames, "ENG") + " , " + getTollSystemNameWithLanguageCode(splitTsn[1], tollSystemsNames, "ENG"));
}

//Retrieves the name related to the specified language code for the provided toll system id
function getTollSystemNameWithLanguageCode(tollSystemId, tollSystemsNames, lngCode) {
	for (var i = 0; i < tollSystemsNames.length; i++) {
		if (tollSystemsNames[i].id == tollSystemId) {
			for (var j = 0; j < tollSystemsNames[i].names.length; j++) {
				if (tollSystemsNames[i].names[j].languageCode == lngCode) {
					return tollSystemsNames[i].names[j].name;
				}
			}
		}
	}

	return "";
}


function handleVehicleSpecChanged() {
	setUserdefinedVehicleSpec(false);
	var vehicle = 2,
		totalNumTires = 4,
		trailerType = 0,
		trailerNum = 0,
		vehicleNumAxles = 2,
		trailerNumAxles = 0,
		hybrid = 0,
		emmisionType = 5,
		vehicleHeight = 167,
		vehicleWeight = 1739,
		trailerHeight = 0,
		totalWeight = 1739,
		totalWidth = 180,
		totalLength = 441,
		disabledEquipped = 0,
		minPollution = 0,
		hov = 0,
		numPassengers = 2,
		commercial = 0,
		hazardousType = 0,
		heightAbove1stAxle = 100,
		fuelType = 'petrol';

	var vehSpecSelection = document.getElementById("predefinedVehSpec");
	if (vehSpecSelection.value == 0) // Car
	{
		vehicle = 2;
		totalNumTires = 4;
		trailerType = 0;
		trailerNum = 0;
		vehicleNumAxles = 2;
		trailerNumAxles = 0;
		hybrid = 0;
		emmisionType = 5;
		vehicleHeight = 167;
		vehicleWeight = 1739;
		trailerHeight = 0;
		totalWeight = 1739;
		totalWidth = 180;
		totalLength = 441;
		disabledEquipped = 0;
		minPollution = 0;
		hov = 0;
		numPassengers = 2;
		commercial = 0;
		hazardousType = 0;
		heightAbove1stAxle = 100;
		fuelType = 'petrol';
	}
	else if (vehSpecSelection.value == 1) // Delivery Truck
	{
		vehicle = 9;
		totalNumTires = 4;
		trailerType = 0;
		trailerNum = 0;
		vehicleNumAxles = 2;
		trailerNumAxles = 0;
		hybrid = 0;
		emmisionType = 5;
		vehicleHeight = 255;
		vehicleWeight = 3500;
		trailerHeight = 0;
		totalWeight = 3500;
		totalWidth = 194;
		totalLength = 652;
		disabledEquipped = 0;
		minPollution = 0;
		hov = 0;
		numPassengers = 1;
		commercial = 1;
		hazardousType = 0;
		heightAbove1stAxle = 130;
		fuelType = 'diesel';
	}
	else if (vehSpecSelection.value == 2) // Truck 7.5t
	{
		vehicle = 3;
		totalNumTires = 4;
		trailerType = 0;
		trailerNum = 0;
		vehicleNumAxles = 2;
		trailerNumAxles = 0;
		hybrid = 0;
		emmisionType = 5;
		vehicleHeight = 340;
		vehicleWeight = 7500;
		trailerHeight = 0;
		totalWeight = 7500;
		totalWidth = 250;
		totalLength = 720;
		disabledEquipped = 0;
		minPollution = 0;
		hov = 0;
		numPassengers = 1;
		commercial = 1;
		hazardousType = 0;
		heightAbove1stAxle = 300;
		fuelType = 'diesel';
	}
	else if (vehSpecSelection.value == 3) // Truck 11t
	{
		vehicle = 3;
		totalNumTires = 6;
		trailerType = 0;
		trailerNum = 0;
		vehicleNumAxles = 2;
		trailerNumAxles = 0;
		hybrid = 0;
		emmisionType = 5;
		vehicleHeight = 380;
		vehicleWeight = 11000;
		trailerHeight = 0;
		totalWeight = 11000;
		totalWidth = 255;
		totalLength = 1000;
		disabledEquipped = 0;
		minPollution = 0;
		hov = 0;
		numPassengers = 1;
		commercial = 1;
		hazardousType = 0;
		heightAbove1stAxle = 300;
		fuelType = 'diesel';
	}
	else if (vehSpecSelection.value == 4) // Truck one trailer 38t
	{
		vehicle = 3;
		totalNumTires = 10;
		trailerType = 2;
		trailerNum = 1;
		vehicleNumAxles = 2;
		trailerNumAxles = 3;
		hybrid = 0;
		emmisionType = 5;
		vehicleHeight = 400;
		vehicleWeight = 24000;
		trailerHeight = 400;
		totalWeight = 38000;
		totalWidth = 255;
		totalLength = 1800;
		disabledEquipped = 0;
		minPollution = 0;
		hov = 0;
		numPassengers = 1;
		commercial = 1;
		hazardousType = 0;
		heightAbove1stAxle = 300;
		fuelType = 'diesel';
	}
	else if (vehSpecSelection.value == 5) // Trailer Truck 40t
	{
		vehicle = 3;
		totalNumTires = 14;
		trailerType = 2;
		trailerNum = 1;
		vehicleNumAxles = 3;
		trailerNumAxles = 2;
		hybrid = 0;
		emmisionType = 5;
		vehicleHeight = 400;
		vehicleWeight = 12000;
		trailerHeight = 400;
		totalWeight = 40000;
		totalWidth = 255;
		totalLength = 1650;
		disabledEquipped = 0;
		minPollution = 0;
		hov = 0;
		numPassengers = 1;
		commercial = 1;
		hazardousType = 0;
		heightAbove1stAxle = 300;
		fuelType = 'diesel';
	}
	else if (vehSpecSelection.value == 6) // Car with Trailer
	{
		vehicle = 2;
		totalNumTires = 6;
		trailerType = 2;
		trailerNum = 1;
		vehicleNumAxles = 2;
		trailerNumAxles = 1;
		hybrid = 0;
		emmisionType = 5;
		vehicleHeight = 167;
		vehicleWeight = 1739;
		trailerHeight = 167;
		totalWeight = 2589;
		totalWidth = 180;
		totalLength = 733;
		disabledEquipped = 0;
		minPollution = 0;
		hov = 0;
		numPassengers = 1;
		commercial = 0;
		hazardousType = 0;
		heightAbove1stAxle = 100;
		fuelType = 'diesel';
	}
	else if (vehSpecSelection.value == 7) // Bus
	{
		vehicle = 3;
		totalNumTires = 6;
		trailerType = 0;
		trailerNum = 0;
		vehicleNumAxles = 3;
		trailerNumAxles = 0;
		hybrid = 0;
		emmisionType = 5;
		vehicleHeight = 371;
		vehicleWeight = 17500;
		trailerHeight = 0;
		totalWeight = 17500;
		totalWidth = 253;
		totalLength = 1300;
		disabledEquipped = 0;
		minPollution = 0;
		hov = 0;
		numPassengers = 51;
		commercial = 1;
		hazardousType = 0;
		eightAbove1stAxle = 300;
		fuelType = 'diesel';
	}
	else if (vehSpecSelection.value == 8) // Motor Home
	{
		vehicle = 3;
		totalNumTires = 4;
		trailerType = 0;
		trailerNum = 0;
		vehicleNumAxles = 2;
		trailerNumAxles = 0;
		hybrid = 0;
		emmisionType = 5;
		vehicleHeight = 372;
		vehicleWeight = 4535;
		trailerHeight = 0;
		totalWeight = 4535;
		totalWidth = 254;
		totalLength = 760;
		disabledEquipped = 0;
		minPollution = 0;
		hov = 0;
		numPassengers = 4;
		commercial = 0;
		hazardousType = 0;
		heightAbove1stAxle = 140;
		fuelType = 'diesel';
	}

	selectionSettingHelper(document.getElementById("vehicles"), vehicle);
	document.getElementById("nrOfTotalTires").value = totalNumTires;
	selectionSettingHelper(document.getElementById("trailerType"), trailerType);
	selectionSettingHelper(document.getElementById("trailerNr"), trailerNum);
	document.getElementById("nrOfAxlesVehicle").value = vehicleNumAxles;
	document.getElementById("nrOfAxlesTrailer").value = trailerNumAxles;
	selectionSettingHelper(document.getElementById("hybrid"), hybrid);
	selectionSettingHelper(document.getElementById("emissionType"), emmisionType);
	document.getElementById("vehHeight").value = vehicleHeight;
	document.getElementById("vehWeight").value = vehicleWeight;
	document.getElementById("trailerHeight").value = trailerHeight;
	document.getElementById("totalWeight").value = totalWeight;
	document.getElementById("totalWidth").value = totalWidth;
	document.getElementById("totalLength").value = totalLength;
	selectionSettingHelper(document.getElementById("disabledEquipped"), disabledEquipped);
	selectionSettingHelper(document.getElementById("minPollution"), minPollution);
	selectionSettingHelper(document.getElementById("hov"), hov);
	document.getElementById("nrPassengers").value = numPassengers;
	selectionSettingHelper(document.getElementById("commercial"), commercial);
	selectionSettingHelper(document.getElementById("hazardousType"), hazardousType);
	selectionSettingHelper(document.getElementById("fuelType"), fuelType);
}

function setUserdefinedVehicleSpec(bSetUserdefinedVehicleSpec) {
	if (bSetUserdefinedVehicleSpec) {
		// show User defined option
		var vehSpecSelection = document.getElementById("predefinedVehSpec");
		selectionSettingHelper(vehSpecSelection, 99);
	}

}


function createTollMarker(oneTollStructure, tollSystemObj) {
	var pos = new H.geo.Point(oneTollStructure.latitude, oneTollStructure.longitude);
	var tollMarker = new H.map.Marker(pos, { icon: tollIcon });

	if (typeof tollSystemObj.tollSystem !== 'undefined') {
		tollMarker.addEventListener("tap", function () { displayTollStructureName(pos, oneTollStructure.name + "<p style='color:green'>TollId:" + tollSystemObj.tollSystem[0].name.toLowerCase() + "</p>"); });
	} else {
		tollMarker.addEventListener("tap", function () { displayTollStructureName(pos, oneTollStructure.name); });
	}
	group.addObject(tollMarker);
}

function displayTollStructureName(position, name) {
	infoBubble = new H.ui.InfoBubble(position, { content: name });
	ui.addBubble(infoBubble);
}


function rgb2hex(rgb) {
	rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
	return (rgb && rgb.length === 4) ? "#" +
		("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
		("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
		("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}

// Check if a string is null/undefined/withoutContent
function isEmpty(str) {
	return (!str || 0 === str.length);
}


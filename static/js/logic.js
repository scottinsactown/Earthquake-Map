// Earthquake Mapping with Leaflet

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(url,function(data) {
    createFeatures(data.features)
})

function createFeatures(earthquakeData) {
  // Add circles to map and bind popups
let markers = [];
for (let index = 0; index < earthquakeData.length; index++) {
  let earthquake = earthquakeData[index];
  let marker = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], { 
    fillOpacity: 0.75,
    //Adjust color based on mag
    color: quakeColor(earthquake.properties.mag),
    fillColor: quakeColor(earthquake.properties.mag),
    // Adjust radius based on mag
    radius: circleSize(earthquake.properties.mag)
  }).bindPopup(
    "<h4>"+earthquake.properties.place+"<h4>"
    + "<h4> Magnitude: " + earthquake.properties.mag + "</h4>"
    + "<h5>" + new Date(earthquake.properties.time) + "</h5>")

    markers.push(marker);
}

  // function onEachFeature(feature, layer) {
  //   L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], { 
  //     fillOpacity: 0.75,
  //     //Adjust color based on mag
  //     color: quakeColor(feature.properties.mag),
  //     fillColor: quakeColor(feature.properties.mag),
  //     // Adjust radius based on mag
  //     radius: circleSize(feature.properties.mag)
  //   });
  
  //   // Give each feature a popup describing the place and magnitude and date of the earthquake
  //   layer.bindPopup(
  //         "<h4>"+feature.properties.place+"<h4>"
  //         + "<h4> Magnitude: " + feature.properties.mag + "</h4>"
  //         + "<h5>" + new Date(feature.properties.time) + "</h5>")
  //      }
  
  // // Create a GeoJSON layer containing the features array on the earthquakeData object
  // let earthquakes = L.geoJSON(earthquakeData, {
  //   onEachFeature: onEachFeature
  // });

    // createMap(earthquakes);
    createMap(L.layerGroup(markers));
}

function createMap(earthquakes) {

    let lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
      });

    // Create our map, giving it the lightmap and earthquakes layers to display on load
    let myMap = L.map("map", {
        center: [
          37.09, -95.71 // Adjust???
        ],
        zoom: 4,
        layers: [lightmap, earthquakes],
        scrollWheelZoom: false
      });

    // Define a baseMaps object to hold our base layers
    let baseMaps = {
    "Light Map": lightmap,
  };

  // Create overlay object to hold our overlay layer
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);

 // Set up the legend (requires CSS for legend)
  var legend = L.control({ position: "bottomleft" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
        div.innerHTML += "<h4>Earthquakes<br>Last 7 Days</h4>";
        div.innerHTML += "<h5>Magnitude</h5>";
        div.innerHTML += '<i style="background: greenyellow"></i><span><1</span><br>';
        div.innerHTML += '<i style="background: yellowgreen"></i><span>1-2</span><br>';
        div.innerHTML += '<i style="background: yellow"></i><span>2-3</span><br>';
        div.innerHTML += '<i style="background: gold"></i><span>3-4</span><br>';
        div.innerHTML += '<i style="background: orange"></i><span>4-5</span><br>';
        div.innerHTML += '<i style="background: red"></i><span>>5</span><br>';

    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
  }

function quakeColor(mag) {
  return mag > 5 ? "red":
  mag > 4 ? "orange":
  mag > 3 ? "gold":
  mag > 2 ? "yellow":
  mag > 1 ? "yellowgreen":
  "greenyellow";
}

function circleSize(mag) {
  return mag * 25000;
}

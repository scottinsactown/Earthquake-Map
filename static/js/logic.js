// Earthquake Mapping with Leaflet

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(url,function(data) {
      // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features)
})
// above ok to do first?

function createFeatures(earthquakeData) {
  // Function to run once for each feature in the features array
  // let quakes = earthquakeData.features;

  // // Initialize an array to hold bike markers
  // let quakeMarkers = [];

  // for (let index = 0; index < quakes.geometry.coordinates; index++) {
  //   let quake = quakes[index];

  //       // For each station, create a marker and bind a popup with the station's name
  //       let quakeMarker = L.marker([station.lat, station.lon])
  //       .bindPopup("<h3>" + station.name + "<h3><h3>Capacity: " + station.capacity + "<h3>");
  
  //     // Add the marker to the bikeMarkers array
  //     bikeMarkers.push(bikeMarker);

  // Give each feature a popup describing the place and magnitude of the earthquake
  function onEachFeature(feature, layer) {
    let color="";
    L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], { //coordinates in brackets - unpack?
      fillOpacity: 0.75,
      //Adjust color based on mag
      color: "yellow",
      fillColor: color,
      // Adjust radius based on mag
      radius: feature.properties.mag
    });
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.mag) + "</p>"); // Meets project requirements???
    }

// //
//   for (var i = 0; i < countries.length; i++) {

//     // Conditionals for countries points
//     var color = "";
//     if (countries[i].points > 200) {
//       color = "yellow";
//     }
//     else if (countries[i].points > 100) {
//       color = "blue";
//     }
//     else if (countries[i].points > 90) {
//       color = "green";
//     }
//     else {
//       color = "red";
//     }
  
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    let lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
      });

    // Define a baseMaps object to hold our base layers
    let baseMaps = {
    "Light Map": lightmap,
  };

  // Create overlay object to hold our overlay layer
  let overlayMaps = {
    Earthquakes: earthquakes
  };

    // Create our map, giving it the lightmap and earthquakes layers to display on load
    let myMap = L.map("map", {
        center: [
          37.09, -95.71 // Adjust???
        ],
        zoom: 4,
        layers: [lightmap, earthquakes]
      });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  // L.control.layers(baseMaps, overlayMaps, {
  //   collapsed: false
  // }).addTo(myMap);

}

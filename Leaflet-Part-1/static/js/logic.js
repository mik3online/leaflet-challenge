// Initialize map
var myMap = L.map("map", {
    center: [0, 0], // Set map center coordinates
    zoom: 2, // Set map zoom level
});

// Add a tile layer 
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(myMap);

// Fetch earthquake data from the USGS GeoJSON feed
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function (data) {
    // Create function to determine marker size based on magnitude
    function markerSize(magnitude) {
        return magnitude * 4000; 
    }

    // Create function to determine marker color based on depth
    function markerColor(depth) {
        // Define color ranges based on depth
        if (depth >= 0 && depth < 10) {
            return "pink";
        } else if (depth >= 10 && depth < 20) {
            return "orange";
        } else if (depth >= 20 && depth < 30) {
            return "red";
        } else if (depth >= 30 && depth < 40) {
            return "green";
        } else if (depth >= 40 && depth < 50) {
            return "blue";
        } else {
            return "purple"; 
        }
    }

    // Loop through the earthquake data features and create markers
data.features.forEach(function (earthquake) {
    var coordinates = earthquake.geometry.coordinates;
    var magnitude = earthquake.properties.mag;
    var depth = coordinates[2];
    var location = earthquake.properties.place;

    // Swap latitude and longitude coordinates
    var latLng = [coordinates[1], coordinates[0]];

    // circle marker with attributes based on magnitude and depth
    L.circle(latLng, {
        radius: markerSize(magnitude),
        color: 'grey', // Outline color
        weight: 1, // Outline thickness
        fillColor: markerColor(depth), // Fill color based on depth
        fillOpacity: 0.5,
    }).bindPopup(`<strong>Location:</strong> ${location}<br><strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth}`).addTo(myMap);
});

    // Create legend for map
var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
    // Create legend div element and populate it with the appropriate HTML
    var div = L.DomUtil.create("div", "info legend");
    var depthLabels = ["00-10 Depth Pink", "10-20 Depth Orange", "20-30 Depth Red", "30-40 Depth Green", "40-50 Depth Blue", "50+ Depth Purple"];
    var colors = ["pink", "orange", "red", "green", "blue", "purple"];

    // Loop through depthLabels and create legend item for each
    for (var i = 0; i < depthLabels.length; i++) {
        div.innerHTML += '<span class="legend-dot" style="background:' + colors[i] + '"></span> ' + depthLabels[i] + '<br>';
    }

    return div;
};

legend.addTo(myMap);
});

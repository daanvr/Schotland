//Mapbox initalisation
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFhbnZyIiwiYSI6ImNpdTJmczN3djAwMHEyeXBpNGVndWtuYXEifQ.GYZf7r9gTfQL3W-GpmmJ3A';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/daanvr/cjg2nbkj61twz2rruflshmfeo',
    center: [-4.337799, 57.157900],
    zoom: 6,
    bearing: 0,
    pitch: 0.5,
});

map.on('load', function(e) {

//load geojson
    map.addSource('Scotland-Data', {
        "type": "geojson",
        "data": "https://daanvr.github.io/Schotland/Scotrip-FotoDataFile-RichOnly-Live.geojson"
    });

//Display selected layer
    map.addLayer({
        "id": "photos-selected",
        "type": "symbol",
        "source": "Scotland-Data",
        "layout": {
            "icon-image": "attraction-15",
            "icon-size": 1.25,
            "icon-padding": 0,
            "icon-allow-overlap":true
        },
        "paint": {
            "icon-opacity": 1
        }
    }, 'country-label-lg'); // Place polygon under this labels.

//Display not selected layer: 0.5 opacity
    map.addLayer({
        "id": "photos-not-selected",
        "type": "symbol",
        "source": "Scotland-Data",
        "layout": {
            "icon-image": "attraction-15",
            "icon-size": 1.25,
            "icon-padding": 0,
            "icon-allow-overlap":true
        },
        "paint": {
            "icon-opacity": 0.5
        }
    }, 'country-label-lg'); // Place polygon under this labels.

//changes cursor style when on clickable layer.
    map.on("mousemove", "photos-selected" && "photos-not-selected", function(e) {map.getCanvas().style.cursor = 'pointer';});
    map.on('mouseleave', "photos-selected" && "photos-not-selected", function() {map.getCanvas().style.cursor = '';});
});

//this makes map features clickable and puts the data in theinfo box
map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, {});
    if (!features.length) {return;}
    var feature = features[0];

//If clicked on a photo, display photo info 
    if (feature.properties.type == "Foto") {
        document.getElementById('infobox_name').innerHTML = (feature.properties.FileName);
        if (feature.properties.URLsmall != undefined) {document.getElementById('infobox_img').setAttribute('src', feature.properties.URLsmall); };
        document.getElementById('Photo-Big').setAttribute('src', feature.properties.URL);
        if (feature.properties.CreateTime != undefined) {document.getElementById('infobox_info').innerHTML = ("Time: " + feature.properties.CreateTime + "<br>" + "Date: " + feature.properties.CreateDate);
        } else {
          document.getElementById('infobox_info').innerHTML = ""; 
        }
    }

//If clicked on a random place on the map, display default info    
    else if (feature.properties.type == undefined) {
        document.getElementById('infobox_name').innerHTML = ("Tonny's reis door Schotland");
        document.getElementById('infobox_info').innerHTML = ("Dit is een interactive kaart van Tonny's reis door Schotland, in April van 2018, ten eren van haar 60ste verjaardag. Deze reis is gefinancierd door familie &amp vrienden als een cadeau voor deze heugelijke mijlpaal.")
        document.getElementById('infobox_img').setAttribute('src', "https://static1.squarespace.com/static/5846811b5016e18b4f9999a2/t/58481cc5e58c6289807c1619/1481121486133/?format=400w");
        document.getElementById('Photo-Big').setAttribute('src', "https://static1.squarespace.com/static/5846811b5016e18b4f9999a2/t/58481cc5e58c6289807c1619/1481121486133/?format=600w");
    }
});

// makes HTML button clickable, with js consequenses
document.getElementById("btn-next").addEventListener('click', function(e) {
    //put js consequenses here:
});

//adds map controls to the map
map.addControl(new mapboxgl.NavigationControl());

//creates Filters used by time selection to only keep data from the relevant year
$(document).ready(function() {
    console.log("ready!");
//     function filterBy(year) {
//         var yearvar = document.getElementById("slider").value;
//         var yearplus1N = Number(yearvar) + 1;
//         var yearminus1N = Number(yearvar) - 1;
//         var yearplus2N = Number(yearvar) + 2;
//         var yearminus2N = Number(yearvar) - 2;
//         var yearplus1 = yearplus1N.toString();
//         var yearminus1 = yearminus1N.toString();
//         var yearplus2 = yearplus2N.toString();
//         var yearminus2 = yearminus2N.toString();
// //Buidings
//         map.setFilter('buildingslayer', [ "all", ['<=', 'start_date', year], ['>=', 'end_date', year]]);
// //Building names
//         map.setFilter('buildingslayer_name', [ "all", ['<=', 'start_date', year], ['>=', 'end_date', year]]);
// //Building shadows
//         map.setFilter('buildingslayer_shadow', [ "all", ['<=', 'start_date', year], ['>=', 'end_date', year]]);
// //Water
//         map.setFilter('waterlayer', [ "all", ['<=', 'start_date', year], ['>=', 'end_date', year]]);
// //Roads
//         map.setFilter('waysdataset', [ "all", ['<=', 'start_date', year], ['>=', 'end_date', year]]);
// //Roads shadows
//         map.setFilter('waysdataset_shadow', [ "all", ['<=', 'start_date', year], ['>=', 'end_date', year]]);
// //POIs
//         map.setFilter('pois', [ "all", ['<=', 'start_date', year], ['>=', 'end_date', year]]);
// //Sport
//         map.setFilter('sports', [ "all", ['<=', 'start_date', year], ['>=', 'end_date', year]]);
// //Sport names
//         map.setFilter('sports_name', [ "all", ['<=', 'start_date', year], ['>=', 'end_date', year]]);
// //Forest
//         map.setFilter('forestcampus', [ "all", ['<=', 'start_date', year], ['>=', 'end_date', year]]);
// //Photos (using + and - 2 years)
//         map.setFilter('photos', [ "any", ['==', 'date', year], ['==', 'date', yearplus1], ['==', 'date', yearminus1], ['==', 'date', yearplus2], ['==', 'date', yearminus2]]);

// //make var based on value of the HTML slider
//     document.getElementById('yearlable').textContent = year;

// //hides the event box by default
//     $('#map-overlay-eventbox').hide();    

// //if "specific year" then write "specific text" in the top middle event box
//     if (year == 1960) {
//       document.getElementById('eventlable').textContent = "1960: The Drienerlo estate";
//       $('#map-overlay-eventbox').show(); };

//     if (year == 1961) {
//       document.getElementById('eventlable').textContent = "1961: Official announcement of the THT";
//       $('#map-overlay-eventbox').show(); };

//     if (year == 1962) {
//       document.getElementById('eventlable').textContent = "1962: Start of the construction works";
//       $('#map-overlay-eventbox').show(); };

//     if (year == 1964) {
//       document.getElementById('eventlable').textContent = "1964: The first students arrive!";
//       $('#map-overlay-eventbox').show(); };

//     if (year == 1986) {
//       document.getElementById('eventlable').textContent = "1986: The THT becomes the University of Twente";
//       $('#map-overlay-eventbox').show(); };

//     if (year == 2002) {
//       document.getElementById('eventlable').textContent = "2002: Fire in the Cubicus destroying the east wing";
//       $('#map-overlay-eventbox').show(); };

// //If non of the abofe if statments is actuated, then hide the event box
//     if (year != 1986 && year != 1961 && year != 1962 && year != 1964 && year != 2002)  {
//       document.getElementById('eventlable').textContent = "";
//       $('#map-overlay-eventbox').hide(); };
//     }  //end of FilterBy(year) 
    
//when the map is loaded, do the things in this function
    map.on('load', function test() {

//Set filter to first year on map loaded
    // filterBy("" + 2002 + "");
    // document.getElementById('slider').addEventListener('input', function(e) {
    //     var year = "" + parseInt(e.target.value, 10) + "";
    //     filterBy(year);
    // });

//animate map at load finished
    // map.flyTo({
    //     center: [-4.337799, 57.157900],
    //     zoom: 7,
    //     pitch: 0,
    //     bearing: 0,
    //     speed: 0.8, // make the flying slow
    //     curve: 1.5, // change the speed at which it zooms out
    // });
    });
});



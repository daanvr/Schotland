
//loads the map
$('#map-overlay-eventbox').hide();
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFhbnZyIiwiYSI6ImNpdTJmczN3djAwMHEyeXBpNGVndWtuYXEifQ.GYZf7r9gTfQL3W-GpmmJ3A';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/daanvr/cjg2nbkj61twz2rruflshmfeo',
    center: [-4.337799, 57.157900],
    zoom: 6,
    bearing: 0,
    pitch: 0.5,
    //maxBounds: [[6.805686225891112, 52.223266707775876], [6.891775856018066, 52.264813883912355]],
    //minZoom: 14
});

// An atempt at making mousepointer change apearance on clickle map item.
map.on('mouseenter', 'photos', function(e) {map.getCanvas().style.cursor = 'pointer';});
map.on('mouseleave', 'photos', function() {map.getCanvas().style.cursor = '';});


map.on('load', function() {

    map.addSource('Scotland-Data', {
        "type": "geojson",
        "data": "https://daanvr.github.io/Schotland/Scotrip-FotoDataFile-RichOnly-Live.geojson"
    });


//     map.addLayer({
//         "id": "photos",
//         "type": "line",
//         "source": "Scotland-Data",
//         "source-layer": "movesactivity",
//         "layout": {
//             "icon-image": "attraction-15",
//             "icon-padding": 2,
//             "icon-size": 10,
//             "icon-allow-overlap":true
//         }
//     }, 'country-label-lg'); // Place polygon under these labels.

// movesactivity

    map.addLayer({
        "id": "photos",
        "type": "symbol",
        "source": "Scotland-Data",
        "layout": {
            "icon-image": "attraction-15",
            "icon-padding": 2,
            "icon-size": 1,
            "icon-allow-overlap":true
        }
    }, 'country-label-lg'); // Place polygon under these labels.

console.log("werkt");

});
//this makes map features clickable and puts the data in theinfo box
map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, {});
    if (!features.length) {return;}
    var feature = features[0];
    
// If the newly clicked item has defined information, eg is a map element manualy added, display new info elso do nothing
    if (feature.properties.type == undefined) {
        document.getElementById('infobox_name').innerHTML = ("Tonny's reis door Schotland");
        document.getElementById('infobox_info').innerHTML = ("Dit is een interactive kaart van Tonny's reis door Schotland, in April van 2018, ten eren van haar 60ste verjaardag. Deze reis is gefinancierd door familie &amp vrienden als een cadeau voor deze heugelijke mijlpaal.")
        document.getElementById('infobox_img').setAttribute('src', "https://static1.squarespace.com/static/5846811b5016e18b4f9999a2/t/58481cc5e58c6289807c1619/1481121486133/?format=400w");
        document.getElementById('Photo-Big').setAttribute('src', "https://static1.squarespace.com/static/5846811b5016e18b4f9999a2/t/58481cc5e58c6289807c1619/1481121486133/?format=600w");
    }

    // if foto is clicked
    else if (feature.properties.type == "Foto") {
        document.getElementById('infobox_name').innerHTML = (feature.properties.FileName);
        if (feature.properties.URLsmall != undefined) {document.getElementById('infobox_img').setAttribute('src', feature.properties.URLsmall); };
        document.getElementById('Photo-Big').setAttribute('src', feature.properties.URL);
        if (feature.properties.CreateTime != undefined) {document.getElementById('infobox_info').innerHTML = ("Time: " + feature.properties.CreateTime + "<br>" + "Date: " + feature.properties.CreateDate);
        } else {
          document.getElementById('infobox_info').innerHTML = ""; 
        }

    // if POI is clicked
    } else if (feature.properties.type == "POI") {
        document.getElementById('infobox_name').innerHTML = (feature.properties.name);
        if (feature.properties.URLsmall != undefined) {document.getElementById('infobox_img').setAttribute('src', feature.properties.URLsmall); };
        if (feature.properties.info != undefined) {document.getElementById('infobox_info').innerHTML = (feature.properties.info); };
    }
});






// Add an event listener for the links in the sidebar listing
document.getElementById("btn-next").addEventListener('click', function(e) {
  // map.flyTo({
  //       center: [-4.337799, 57.157900],
  //       zoom: 7,
  //       pitch: 0,
  //       bearing: 0,
  //       speed: 0.8, // make the flying slow
  //       curve: 1.5, // change the speed at which it zooms out
  //   });
console.log("Voila!")
});

// Attempt at loading all map photo features. Unsuccesfull.
// var feature;
// var i;
// for (i = 0; i < 10000; i++) { 
//     console.log(feature);
// }
// map.on('mousemove', 'scotrip-fotodatafile-longlatonly', function(e) {
//     var feature = e.features[0];
// });

//pointer changes (not working)
map.addControl(new mapboxgl.NavigationControl());
// map.on('load', function () {
//     // Change the cursor to a pointer when the mouse is over the places layer.
//     map.on('mouseenter', 'pois', function () {
//         map.getCanvas().style.cursor = 'pointer';
//     });
//     // Change it back to a pointer when it leaves.
//     map.on('mouseleave', 'pois', function () {
//         map.getCanvas().style.cursor = '';
//     });
// });

//creates Filters used by time selection to only keep data from the relevant year
$(document).ready(function() {
//    console.log("ready!");
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
//         map.setFilter('buildingslayer', [ "all", ['<=', 'start_date', year], ['>=', 'end_date', year]]);            //Buildings timeline
//         map.setFilter('buildingslayer_name', [ "all", ['<=', 'start_date', year], ['>=', 'end_date', year]]);            //Buildings timeline
//         map.setFilter('buildingslayer_shadow', [ "all", ['<=', 'start_date', year], ['>=', 'end_date', year]]);       //Buildings shadow timeline
//         map.setFilter('waterlayer', [ "all", ['<=', 'start_date', year], ['>=', 'end_date', year]]);                //Water timeline
//         map.setFilter('waysdataset', [ "all", ['<=', 'start_date', year], ['>=', 'end_date', year]]);               //Roads timeline
//         map.setFilter('waysdataset_shadow', [ "all", ['<=', 'start_date', year], ['>=', 'end_date', year]]);          //Roads timeline
//         map.setFilter('pois', [ "all", ['<=', 'start_date', year], ['>=', 'end_date', year]]);                      //Roads timeline
//         map.setFilter('sports', [ "all", ['<=', 'start_date', year], ['>=', 'end_date', year]]);                      //Roads timeline
//         map.setFilter('sports_name', [ "all", ['<=', 'start_date', year], ['>=', 'end_date', year]]);                      //Roads timeline
//         map.setFilter('forestcampus', [ "all", ['<=', 'start_date', year], ['>=', 'end_date', year]]);                      //Roads timeline
//         map.setFilter('photos', [ "any", ['==', 'date', year], ['==', 'date', yearplus1], ['==', 'date', yearminus1], ['==', 'date', yearplus2], ['==', 'date', yearminus2]]);                      //photo_pois timeline
        
//         // Set the label in the top middle to correct content based on time selection
//         document.getElementById('yearlable').textContent = year;
//         if (year == 1960) {
//           document.getElementById('eventlable').textContent = "1960: The Drienerlo estate";
//           $('#map-overlay-eventbox').show(); };
//         if (year == 1961) {
//           document.getElementById('eventlable').textContent = "1961: Official announcement of the THT";
//           $('#map-overlay-eventbox').show(); };
//         if (year == 1962) {
//           document.getElementById('eventlable').textContent = "1962: Start of the construction works";
//           $('#map-overlay-eventbox').show(); };
//         if (year == 1964) {
//           document.getElementById('eventlable').textContent = "1964: The first students arrive!";
//           $('#map-overlay-eventbox').show(); };
//         if (year == 1986) {
//           document.getElementById('eventlable').textContent = "1986: The THT becomes the University of Twente";
//           $('#map-overlay-eventbox').show(); };
//         if (year == 2002) {
//           document.getElementById('eventlable').textContent = "2002: Fire in the Cubicus destroying the east wing";
//           $('#map-overlay-eventbox').show(); };
//         if (year != 1986 && year != 1961 && year != 1962 && year != 1964 && year != 2002)  {
//           document.getElementById('eventlable').textContent = "";
//           $('#map-overlay-eventbox').hide(); };
//     }
    
//     //initiates map. select the first year and starts animation to zome to the starting position.
    map.on('load', function test() {
// Createing var that holds all photos and their info. potentially usfull to show next and previous




//Set filter to first year of the year
//         filterBy("" + 2002 + "");
//         document.getElementById('slider').addEventListener('input', function(e) {
//             var year = "" + parseInt(e.target.value, 10) + "";
//             filterBy(year);
//         });
    //     map.flyTo({
    //     center: [-4.337799, 57.157900],
    //     zoom: 7,
    //     pitch: 0,
    //     bearing: 0,
    //     speed: 0.8, // make the flying slow
    //     curve: 1.5, // change the speed at which it zooms out
    // });

    });
});
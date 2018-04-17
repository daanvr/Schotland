
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

//this makes map features clickable and puts the data in theinfo box
map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, {});
    if (!features.length) {return;}
    var feature = features[0];
    
// If the newly clicked item has defined information, eg is a map element manualy added, display new info elso do nothing
    if (feature.properties.type == undefined) {
    }

    // if foto is clicked
    else if (feature.properties.type == "Foto") {
        document.getElementById('infobox_name').innerHTML = (feature.properties.name);
        if (feature.properties.img != undefined) {document.getElementById('infobox_img').setAttribute('src', feature.properties.img); };
        if (feature.properties.info != undefined) {document.getElementById('infobox_info').innerHTML = (feature.properties.info);
        } else {
          document.getElementById('infobox_info').innerHTML = ""; 
        }

    // if POI is clicked
    } else if (feature.properties.type == "POI") {
        document.getElementById('infobox_name').innerHTML = (feature.properties.name);
        if (feature.properties.img != undefined) {document.getElementById('infobox_img').setAttribute('src', feature.properties.img); };
        if (feature.properties.info != undefined) {document.getElementById('infobox_info').innerHTML = (feature.properties.info); };
    }
});

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
//     console.log("ready!");
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
//         //Set filter to first year of the year
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
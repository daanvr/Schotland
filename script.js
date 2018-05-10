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

//Filter function
function filterBy(SliderValue){
    //get range slider valure from HTML
    var slider = document.getElementById("slider-start").value;
    var date  //Initalise date var

    //translates the range slider steps to dates 
    if (slider == 1) {date = "2018-04-06"}
    else if (slider == 2) {date = "2018-04-07"}
    else if (slider == 3) {date = "2018-04-08"}
    else if (slider == 4) {date = "2018-04-09"}
    else if (slider == 5) {date = "2018-04-10"}
    else if (slider == 6) {date = "2018-04-11"}
    else if (slider == 7) {date = "2018-04-12"}
    else if (slider == 8) {date = "2018-04-13"}
    else if (slider == 9) {date = "2018-04-14"}
    else if (slider == 10) {date = "2018-04-15"}
    
    //Actual Filtering by date
    if (slider > 0) {map.setFilter('photos-selected', ["==", "CreateDate", date]);}
    else {map.setFilter('photos-selected', null);}
    
    //Filtering confimration in console
    console.log("Filtering:" + " " + date)
};



//when js is finished running
$(document).ready(function() {
    //confirm documetn is ready
    console.log("ready!");


    //make sure map is done loading, eg all the layers exist
    map.on("load", function initiatefilter() {
        //add event listener to HTML range slider
        document.getElementById('slider-start').addEventListener('input', function(e) {
            //code to be executed when event listener is triggerd
            var SliderValue = "" + parseInt(e.target.value, 10) + "" //create vare with range slider value
            filterBy(SliderValue);  //trigger Fiter function adn send varibale with it.
       });
    });
});









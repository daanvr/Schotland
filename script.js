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

//load geojson files
    map.addSource('Scotland-Foto', {
        "type": "geojson",
        "data": "https://daanvr.github.io/Schotland/Scotrip-FotoDataFile-RichOnly-Live.geojson"
    });
    map.addSource('Scotland-Routes', {
        "type": "geojson",
        "data": "https://daanvr.github.io/Schotland/Routes.geojson"
    });

    map.addLayer({
        "id": "photos",
        "type": "symbol",
        "source": "Scotland-Foto",
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

    map.addLayer({
        "id": "routes-today",
        "type": "line",
        "source": "Scotland-Routes",
        "layout": {
        
        },
        "paint": {
            "line-color": "#bbbbbb",
            "line-width": 3,
            "line-gap-width": 1

        }
    }, 'photos'); // Place polygon under this labels.

    map.addLayer({
        "id": "routes",
        "type": "line",
        "source": "Scotland-Routes",
        "layout": {
        
        },
        "paint": {
            "line-color": "#ffffff",
            "line-width": 2,
            "line-gap-width": 1
        }
    }, 'routes-today'); // Place polygon under this labels.



//changes cursor style when on clickable layer.
    map.on("mousemove", "photos", function(e) {map.getCanvas().style.cursor = 'pointer';});
    map.on('mouseleave', "photos", function() {map.getCanvas().style.cursor = '';});
});

//this makes map features clickable and puts the data in theinfo box
map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, {});
    if (!features.length) {return;}
    var feature = features[0];

//If clicked on a photo, display photo info 
    if (feature.properties.type == "Foto") {
        // document.getElementById('infobox_name').innerHTML = (feature.properties.FileName);
        if (feature.properties.URLsmall != undefined) {document.getElementById('infobox_img').setAttribute('src', feature.properties.URLsmall); };
        document.getElementById('Photo-Big').setAttribute('src', feature.properties.URL);
        // if (feature.properties.CreateTime != undefined) {document.getElementById('infobox_info').innerHTML = ("Time: " + feature.properties.CreateTime + "<br>" + "Date: " + feature.properties.CreateDate);
        // } else {
        //   document.getElementById('infobox_info').innerHTML = ""; 
        // }
    }

//If clicked on a random place on the map, display default info    
    else if (feature.properties.type == undefined) {
        // document.getElementById('infobox_name').innerHTML = ("Tonny's reis door Schotland");
        // document.getElementById('infobox_info').innerHTML = ("Dit is een interactive kaart van Tonny's reis door Schotland, in April van 2018, ten eren van haar 60ste verjaardag. Deze reis is gefinancierd door familie &amp vrienden als een cadeau voor deze heugelijke mijlpaal.")
        document.getElementById('infobox_img').setAttribute('src', "https://static1.squarespace.com/static/5846811b5016e18b4f9999a2/t/58481cc5e58c6289807c1619/1481121486133/?format=400w");
        document.getElementById('Photo-Big').setAttribute('src', "https://static1.squarespace.com/static/5846811b5016e18b4f9999a2/t/58481cc5e58c6289807c1619/1481121486133/?format=600w");
    }
});

// makes HTML button clickable, with js consequenses
// document.getElementById("btn-next").addEventListener('click', function(e) {
//     //put js consequenses here:
// });

//adds map controls to the map
map.addControl(new mapboxgl.NavigationControl());

//Filter function
function filterBy(SliderValue){
    //get range slider valure from HTML
    var slider = document.getElementById("slider-start").value;
    var datephotos  //Initalise date var
    var dateroutes  //Initalise dateroutes var
    var dateroutesfrom  //Initalise dateroutes var

    //translates the range slider steps to dates for photos routes and routesday before
         if (slider == 1) {datephotos = "2018-04-06"; dateroutes = "20180407"; dateroutesfrom = "20180406";}
    else if (slider == 2) {datephotos = "2018-04-07"; dateroutes = "20180408"; dateroutesfrom = "20180407";}
    else if (slider == 3) {datephotos = "2018-04-08"; dateroutes = "20180409"; dateroutesfrom = "20180408";}
    else if (slider == 4) {datephotos = "2018-04-09"; dateroutes = "20180410"; dateroutesfrom = "20180409";}
    else if (slider == 5) {datephotos = "2018-04-10"; dateroutes = "20180411"; dateroutesfrom = "20180410";}
    else if (slider == 6) {datephotos = "2018-04-11"; dateroutes = "20180412"; dateroutesfrom = "20180411";}
    else if (slider == 7) {datephotos = "2018-04-12"; dateroutes = "20180413"; dateroutesfrom = "20180412";}
    else if (slider == 8) {datephotos = "2018-04-13"; dateroutes = "20180414"; dateroutesfrom = "20180413";}
    else if (slider == 9) {datephotos = "2018-04-14"; dateroutes = "20180415"; dateroutesfrom = "20180414";}
    else if (slider == 10) {datephotos = "2018-04-15"; dateroutes = "20180416"; dateroutesfrom = "20180415";}
    
    //Actual Filtering by date
    if (slider > 0 && slider < 11) {
        map.setFilter('photos', ["==", "CreateDate", datephotos]);
        map.setFilter('routes', ["<=", "startTime", dateroutes]);
        map.setFilter('routes-today', ["all", ["<=", "startTime", dateroutes], [">=", "startTime", dateroutesfrom]]);
    }
    else {
        map.setFilter('photos', null);
        map.setFilter('routes', null);
        map.setFilter('routes-today', ["<=", "startTime", 1]);
    }
    
    //Filtering confimration in console
    console.log("Filtering:" + " " + datephotos) 
};



//when js is finished running
$(document).ready(function() {
    //confirm documetn is ready
    console.log("ready!");



    //make sure map is done loading, eg all the layers exist
    map.on("load", function initiatefilter() {
        //Initiate Filter
        filterBy("" + 0 + "");

        //add event listener to HTML range slider
        document.getElementById('slider-start').addEventListener('input', function(e) {
            //code to be executed when event listener is triggerd
            var SliderValue = "" + parseInt(e.target.value, 10) + "" //create vare with range slider value
            filterBy(SliderValue);  //trigger Fiter function adn send varibale with it.
       });
    });
});









//Mapbox initalisation
var photoDB;

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
        selectedphoto.nbr = feature.properties.nbr;
        // if (feature.properties.CreateTime != undefined) {document.getElementById('infobox_info').innerHTML = ("Time: " + feature.properties.CreateTime + "<br>" + "Date: " + feature.properties.CreateDate);
        // } else {
        //   document.getElementById('infobox_info').innerHTML = ""; 
        // }
        console.log(feature.properties.nbr);
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
document.getElementById("nextph").addEventListener('click', function(e) {
        selectedphoto.nbr = selectedphoto.nbr + 1;
        NewPhotos(selectedphoto.nbr);
//     //put js consequenses here:
});

//adds map controls to the map
map.addControl(new mapboxgl.NavigationControl());

//Filter function
function filterBy(SliderValue){
    //get range slider valure from HTML
    var slider = document.getElementById("slider-start").value;
    var datephotos  //Initalise date var
    var dateroutesto  //Initalise dateroutes var
    var dateroutesfrom  //Initalise dateroutes var
    var currentday

    //arrays of relevant valies compared to slider value. eg slider position 4 of datephotos = 2018-04-09 and position 4 of currentday = Maandag 
    datephotos =        ["",            "2018-04-06",   "2018-04-07",   "2018-04-08",   "2018-04-09",   "2018-04-10",   "2018-04-11",   "2018-04-12",   "2018-04-13",   "2018-04-14",   "2018-04-15", ""          ];
    dateroutesfrom =    ["",            "20180406",     "20180407",     "20180408",     "20180409",     "20180410",     "20180411",     "20180412",     "20180413",     "20180414",     "20180415",   ""          ];
    dateroutesto =      ["",            "20180407",     "20180408",     "20180409",     "20180410",     "20180411",     "20180412",     "20180413",     "20180414",     "20180415",     "20180416",   ""          ];
    currentday =        ["Alle dagen",  "Aankomst Dag", "Zaterdag",     "Zondag",       "Maandag",      "Dinsdag",      "Woensdag",     "Donderdag",    "Vrijdag",      "Zaterdag",     "Laaste dag", "Alle dagen"];

    //exectution of filter by date
    if (slider > 0 && slider < 11) {
        map.setFilter('photos', ["==", "CreateDate", datephotos[slider]]);
        map.setFilter('routes', ["<=", "startTime", dateroutesto[slider]]);
        map.setFilter('routes-today', ["all", ["<=", "startTime", dateroutesto[slider]], [">=", "startTime", dateroutesfrom[slider]]]);
    }
    else {
        map.setFilter('photos', null);
        map.setFilter('routes', null);
        map.setFilter('routes-today', ["<=", "startTime", 1]);
    }
    //set Day Lable to correct day 
    document.getElementById("daylable").textContent = currentday[slider];
    //Filtering confimration in console
    console.log("Filtering: " + currentday[slider]) 
};

//make sure map is done loading, eg all the layers exist
map.on("load", function initiatefilter() {
    //Initiate Filter
    filterBy("" + 0 + "");
    NewPhotos(61);
    //add event listener to HTML range slider
    document.getElementById('slider-start').addEventListener('input', function(e) {
        //code to be executed when event listener is triggerd
        var SliderValue = "" + parseInt(e.target.value, 10) + "" //create vare with range slider value
        filterBy(SliderValue);  //trigger Fiter function adn send varibale with it.
   });
});

//load json file as static databse
//coppy json data to the "photoDB" var
var photoDB;
var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", "https://daanvr.github.io/Schotland/photoDB.json", true);
xmlhttp.send();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) { photoDB = JSON.parse(this.responseText);}
    //console.log(photoDB);
    //document.getElementById("infobox_name").textContent = photoDB[1].FileName;
};

var prevphoto = {};
var selectedphoto = {};
var nextphoto = {};
function NewPhotos(newmainphotonbr){
    prevphoto = {nbr:newmainphotonbr - 1, URLsmall:"", URL:""};
    prevphoto.URLsmall = photoDB[prevphoto.nbr].URLsmall;
    prevphoto.URL = photoDB[prevphoto.nbr].URL;
    
    selectedphoto = {nbr:newmainphotonbr, URLsmall:"", URL:""};
    selectedphoto.URLsmall = photoDB[selectedphoto.nbr].URLsmall;
    selectedphoto.URL = photoDB[selectedphoto.nbr].URL;

    nextphoto     = {nbr:newmainphotonbr + 1, URLsmall:"", URL:""};
    nextphoto.URLsmall = photoDB[nextphoto.nbr].URLsmall;
    nextphoto.URL = photoDB[nextphoto.nbr].URL;

    writephotovars();

    //document.getElementById('ph1').setAttribute('src', prevphoto.URL);
    document.getElementById('infobox_img').setAttribute('src', selectedphoto.URL);
    //document.getElementById('ph3').setAttribute('src', nextphoto.URL);

};

function writephotovars(){
    console.log("new photos info:");
    console.log(prevphoto);
    console.log(selectedphoto);
    console.log(nextphoto);
    console.log(photoDB);
};



//Set global variables
var photoDB;

//load json file as static databse and stores the data in the "photoDB" js object
var photoDB;
var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", "https://daanvr.github.io/Schotland/photoDB.json", true);
xmlhttp.send();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) { photoDB = JSON.parse(this.responseText);}
};

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

//adds map controls to the map
map.addControl(new mapboxgl.NavigationControl());

//execute these startup functions when map is ready
map.on("load", function initiatefilter() {
    LoadGEOJsonSources();  //this loads the geojson sources, then loads the layser and then makes the mouse currsor change when hovering the "clickable" layers
    filterBy("" + 0 + "");  //Initiate Filter
    NewSelection(64);  //Initiates selected img
    LoadCarouselImgs();  //loads imgs in carousel
    SliderListener();  //Call function to set event lisner to html for the day range selector
});


//Make map features clickable
//& puts the data in theinfo box
map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, {});
    if (!features.length) {return;}
    var feature = features[0];

    //If clicked on a photo, display photo info 
    if (feature.properties.type == "Foto") {
        if (feature.properties.URLsmall != undefined) {document.getElementById('infobox_img').setAttribute('src', feature.properties.URLsmall); };
        document.getElementById('Photo-Big').setAttribute('src', feature.properties.URL);
        //set selected foto nbr to clicked photo nbr. for this to work the geojson data needst to be updated
        //NewSelection(feature.properties.nbr);
        searchphotoDB(feature.properties.FileName);
        console.log("name: " + feature.properties.FileName)
    }
});

//Function to filter map
function filterBy(SliderValue){
    var slider = document.getElementById("slider-start").value;  //get range slider valure from HTML
    var datephotos  //Initalise date var
    var dateroutesto  //Initalise dateroutes var
    var dateroutesfrom  //Initalise dateroutes var
    var currentday //Initatlise current day var, containing the naming of every day

    //arrays of relevant valies compared to slider value. eg slider position 4 of datephotos = 2018-04-09 and position 4 of currentday = Maandag 
    datephotos =        ["",            "2018-04-06",   "2018-04-07",   "2018-04-08",   "2018-04-09",   "2018-04-10",   "2018-04-11",   "2018-04-12",   "2018-04-13",   "2018-04-14",   "2018-04-15",   ""          ];
    dateroutesfrom =    ["",            "20180406",     "20180407",     "20180408",     "20180409",     "20180410",     "20180411",     "20180412",     "20180413",     "20180414",     "20180415",     ""          ];
    dateroutesto =      ["",            "20180407",     "20180408",     "20180409",     "20180410",     "20180411",     "20180412",     "20180413",     "20180414",     "20180415",     "20180416",     ""          ];
    currentday =        ["Hele reis",   "Aankomst Dag", "Zaterdag",     "Zondag",       "Maandag",      "Dinsdag",      "Woensdag",     "Donderdag",    "Vrijdag",      "Zaterdag",     "Laaste dag",   "Hele reis"];
    FistPhoto =         ["",            "",             "250",          "500",          "750",          "1000",         "1150",         "1400",         "1500",         "1800",         "1950",         ""];

    //exectution of filter by date
    if (slider > 0 && slider < 11) { 
        //Slider is used to filter map elleemnts 
        map.setFilter('photos', ["==", "CreateDate", datephotos[slider]]);
        map.setFilter('routes', ["<=", "startTime", dateroutesto[slider]]);
        map.setFilter('routes-shadow', ["<=", "startTime", dateroutesto[slider]]);
        map.setFilter('routes-today', ["all", ["<=", "startTime", dateroutesto[slider]], [">=", "startTime", dateroutesfrom[slider]]]);
    } else { 
        //Else slider is off
        map.setFilter('photos', null);
        map.setFilter('routes', null);
        map.setFilter('routes-shadow', null);
        map.setFilter('routes-today', ["<=", "startTime", 1]);
    }
  
    document.getElementById("daylable").textContent = currentday[slider];  //set Day Lable to correct day 
    console.log("Filtering: " + currentday[slider]); //Filtering confimration in console

};

//function used to set a new selection. it upadates the img in the top left, set slider day filter to 0 and logs selected img info
var prevphoto = {};
var selectedphoto = {};
var nextphoto = {};
var carouselphotos = {};
function NewSelection(newmainphotonbr){
    //set slider to all days
    var SliderValue = 0;
    document.getElementById('slider-start').value = SliderValue;
    filterBy(SliderValue);

    //load varibales from new selected photo to 
    selectedphoto = {nbr:newmainphotonbr, URLsmall:"", URL:""};
    selectedphoto.URLsmall = photoDB[selectedphoto.nbr].URLsmall;
    selectedphoto.URL = photoDB[selectedphoto.nbr].URL;
    selectedphoto.latitude = photoDB[selectedphoto.nbr].Latitude;
    selectedphoto.longitude = photoDB[selectedphoto.nbr].Longitude;

    //set variables from new selection to UI 
    document.getElementById('infobox_img').setAttribute('src', selectedphoto.URLsmall);
    document.getElementById('Photo-Big').setAttribute('src', selectedphoto.URL);

    //call function to write in consol the variable from new selection
    writephotovars();

    //this code was temporarly used to expiriment with other valuse than photos in carousel. This might be usefull in the future
        // var newdiv = document.createElement('div');
        // var position = i - newmainphotonbr;
        // newdiv.className = 'carousel-containter img' + position + ' carousel-info';
        // newdiv.Name = i;
        // newdiv.innerHTML = '<div class="carousel-info-text"><p>Woensdag</p></div>';
        // newdiv.idName = 'img' + position;
        // document.getElementById('main-carousel').appendChild(newdiv);
};

// function used to log the selected foto info to the consol
function writephotovars(){
    console.log("selected photo info:");
    console.log(selectedphoto);
};

// funciton to search the phtoo database for the picure corresponding to the clicked map icone corresponging to a specific img.
function searchphotoDB(searchquery){
    console.log("searching")
    for (i = 0; i < 2003; i++) {
        var a = photoDB[i].FileName;
        if (a == searchquery) {
            console.log(photoDB[i]);
            NewSelection(photoDB[i-2].nbr);
        }
    };
};

//loads all imgs in carousel
function LoadCarouselImgs(){
        var i;
    for (i = 0; i < 2003; i++) { 
        var newdiv = document.createElement('div');
        var position = i;
        newdiv.className = 'carousel-containter img' + position;
        newdiv.Name = i;
        newdiv.innerHTML = '<img class="carousel-img img' + position + '" onclick="NewSelection(' + i + ')"  name="' + i + '"src="' + photoDB[i].URLsmall + '">';
        newdiv.idName = 'img' + position;
        document.getElementById('main-carousel').appendChild(newdiv);
    };
}

//function to add event listener to HTML range slider to be used as a day selector
function SliderListener() {
    document.getElementById('slider-start').addEventListener('input', function(e) {
        //code to be executed when event listener is triggerd
        var SliderValue = "" + parseInt(e.target.value, 10) + "" //create vare with range slider value
        filterBy(SliderValue);  //trigger Fiter function adn send varibale with it.
   });
};

//Function to simplify Fly To functionalisty of Mapbox
function Fly(Long, Lat){
    map.flyTo({
        center: [Long, Lat],
        zoom: (10)
    });
};

HTMLbtnsClick();
function HTMLbtnsClick() {
// makes HTML button clickable, with js consequenses
    document.getElementById("nextph").addEventListener('click', function(e) {
        selectedphoto.nbr = selectedphoto.nbr + 1;
        NewSelection(selectedphoto.nbr);
    });

    document.getElementById("prevph").addEventListener('click', function(e) {
        selectedphoto.nbr = selectedphoto.nbr - 1;
        NewSelection(selectedphoto.nbr);
    });

    document.getElementById("locph").addEventListener('click', function(e) {
        Long = photoDB[selectedphoto.nbr].Longitude;
        Lat = photoDB[selectedphoto.nbr].Latitude;
        Fly(Long, Lat);
    });

    document.getElementById("bigph").addEventListener('click', function(e) {
        document.getElementById('Photo-Big-Background').style.display = 'inline';
    });
};

//Loading geojson sources for layers to display them
function LoadGEOJsonSources() {
    map.addSource('Scotland-Foto', {
        "type": "geojson",
        "data": "https://daanvr.github.io/Schotland/Scotrip-FotoDataFile-RichOnly-Live.geojson"
    });
    map.addSource('Scotland-Routes', {
        "type": "geojson",
        "data": "https://daanvr.github.io/Schotland/Routes.geojson"
    });

    DisplayGEOJsonLayers();  //Now that the sources are loaded, have the Layers loaded
};

//Displaying geojson data from the previously laoded sources
function DisplayGEOJsonLayers(){
    map.addLayer({ 
        //photos layer
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
        //selected rout section layer
        "id": "routes-today",
        "type": "line",
        "source": "Scotland-Routes",
        "layout": {
        },
        "paint": {
            "line-color": "#4285F4",
            "line-width": 6
        }
    }, 'photos'); // Place polygon under this labels.

    map.addLayer({
        //rout layer
        "id": "routes",
        "type": "line",
        "source": "Scotland-Routes",
        "layout": {
        },
        "paint": {
            "line-color": "rgba(120, 180, 244, 1)",
            "line-width": 4
        }
    }, 'routes-today'); // Place polygon under this labels.

    map.addLayer({
        //layer used to create lins(borders) arround rout
        "id": "routes-shadow",
        "type": "line",
        "source": "Scotland-Routes",
        "layout": {
        },
        "paint": {
            "line-color": "#4285F4",
            "line-width": 6
        }
    }, 'routes'); // Place polygon under this labels.

    ClickbleMapItemCursor(); //Now that the layers a loaded, have the mouse cursor change when hovering some of the layers
};

//making "clickble" layers on the map change the mouse cursor. This helps the user see an map item is clickble.
function ClickbleMapItemCursor(){
    //changes cursor style when hovering "clickable" layer.
    map.on("mousemove", "photos", function(e) {map.getCanvas().style.cursor = 'pointer';});
    map.on('mouseleave', "photos", function() {map.getCanvas().style.cursor = '';});

};













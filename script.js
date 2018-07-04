//Set global variables
var photoDB;
var selectedphoto;
var previouslyselectedphoto;
var vw = window.innerHeight;
var vh = window.innerWidth;
console.log(vw);
console.log(vh);

//load json file as static databse and stores the data in the "photoDB" js object
var photoDB;
var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", "https://daanvr.github.io/Schotland/db/photoDB.json", true);
xmlhttp.send();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) { photoDB = JSON.parse(this.responseText);}
};

//Mapbox initalisation
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFhbnZyIiwiYSI6ImNpdTJmczN3djAwMHEyeXBpNGVndWtuYXEifQ.GYZf7r9gTfQL3W-GpmmJ3A';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/daanvr/cjg2nbkj61twz2rruflshmfeo',
    center: [-4.337799, 56.907900],
    zoom: 6.5,
    bearing: 0,
    pitch: 0.5,
    attributionControl: false
});

//adds map controls to the map
map.addControl(new mapboxgl.NavigationControl());

//execute these startup functions when map is ready
map.on("load", function initiatefilter() {
    LoadGEOJsonSources();  //this loads the geojson sources, then loads the layser and then makes the mouse currsor change when hovering the "clickable" layers
    filterBy("" + 0 + "");  //Initiate Filter
    LoadCarouselImgs();  //loads imgs in carousel
    SliderListener();  //Call function to set event lisner to html for the day range selector
    NewSelection(1, 0);  //Initiates selected img
    //ImgHoverListener();
});

//Make map features clickable
//& puts the data in theinfo box
map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, {});
    if (!features.length) {return;}
    var feature = features[0];

    //If clicked on a photo, display photo info 
    if (feature.properties.type == "Foto") {
        //if (feature.properties.URLsmall != undefined) {document.getElementById('infobox_img').setAttribute('src', feature.properties.URLsmall); };
        //document.getElementById('Photo-Big').setAttribute('src', feature.properties.URL);
        //set selected foto nbr to clicked photo nbr. for this to work the geojson data needst to be updated
        //NewSelection(feature.properties.nbr);
        searchphotoDB(feature.properties.FileName);
        //console.log("name: " + feature.properties.FileName)
    } else {
        document.getElementById('map-overlay-infobox').style.visibility = 'hidden';
        NewSelection(undefined, 0);
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
    //console.log("Filtering: " + currentday[slider]); //Filtering confimration in console

    map.flyTo({
        center: [-4.337799, 56.907900],
        zoom: 6.5,
        bearing: 0,
        pitch: 0.5,
    });
};

//function used to set a new selection. it upadates the img in the top left, set slider day filter to 0 and logs selected img info
function NewSelection(newmainphotonbr, movecarousel){
    if (newmainphotonbr != undefined) {
        //set slider to all days
        var SliderValue = 0;
        document.getElementById('slider-start').value = SliderValue;
        filterBy(SliderValue);

        //copie varibles from previously selected phototo new var
        previouslyselectedphoto = selectedphoto

        //load varibales from new selected photo to
        selectedphoto = {nbr:newmainphotonbr, imgurls:"", imgurlb:""};
        selectedphoto.htmlid = "img" + selectedphoto.nbr;
        selectedphoto.imgid = "imgID" + selectedphoto.nbr;
        selectedphoto.DOM = document.getElementById(selectedphoto.htmlid);
        selectedphoto.imgDOM = document.getElementById(selectedphoto.imgid);
        selectedphoto.imgurls = photoDB[selectedphoto.nbr].imgurls;
        selectedphoto.Imgurlb = photoDB[selectedphoto.nbr].Imgurlb;
        selectedphoto.latitude = photoDB[selectedphoto.nbr].GPSLatitude;
        selectedphoto.longitude = photoDB[selectedphoto.nbr].GPSLongitude;

        //set variables from new selection to UI 
        document.getElementById('infobox_img').setAttribute('src', selectedphoto.imgurls);
        document.getElementById('Photo-Big').setAttribute('src', selectedphoto.Imgurlb);
        document.getElementById('map-overlay-infobox').style.visibility = 'visible';

        writephotovars();  //call function to write in consol the variable from new selection

        //remove previously applyed CSS fo select photo
        if (previouslyselectedphoto != undefined) {
            previouslyselectedphoto.imgDOM.style.visibility = 'visible';
            if (document.getElementById('imginfo') != undefined) {
                document.getElementById('imginfo').remove();
            }
            var oldactivedivclassimgcontainer = [].slice.apply(document.getElementsByClassName("active"));
            for (var i = 0; i < oldactivedivclassimgcontainer.length; i++) {
                oldactivedivclassimgcontainer[i].className = oldactivedivclassimgcontainer[i].className.replace(/ *\b active\b/g, "");
            }       
        }

        //make selected photo pop out of the carousel ussing CSS
        selectedphoto.DOM.className += " active";
        selectedphoto.imgDOM.style.visibility = 'hidden';

        //Scroll to correct posittion (new version, works well in Chrome less wel in Safary)
        selectedphoto.DOM.scrollIntoView({behavior: "smooth"});

                        //Scroll to correct posittion (Old version)
                        // if (movecarousel == 1) {
                        // console.log(movecarousel);        
                        //     document.getElementById('main-carousel').scrollLeft = selectedphoto.DOM.offsetLeft - 400;
                        // }

        //load img info
        var datephotos =        ["",            "20180406",   "20180407",   "20180408",   "20180409",   "20180410",   "20180411",   "20180412",   "20180413",   "20180414",   "20180415",   ""          ];
        var currentday =        ["Hele reis",   "Aankomst Dag", "Zaterdag",     "Zondag",       "Maandag",      "Dinsdag",      "Woensdag",     "Donderdag",    "Vrijdag",      "Zaterdag",     "Laaste dag",   "Hele reis"];
        var newdiv = document.createElement('div');
        var position = i;
        var date = photoDB[newmainphotonbr].Date;
        var time = photoDB[newmainphotonbr].Time;
        for (var i = 0; i < datephotos.length; i++) {
            if (date == datephotos[i]) {
                date = currentday[i]
            }
        }

        newdiv.className = 'imginfo';
        newdiv.innerHTML = '<p>' + date +  '</p><p>' + time + '</p>';
        newdiv.setAttribute("id", "imginfo");
        selectedphoto.DOM.appendChild(newdiv);


        NewSelectedMapLocation(selectedphoto.longitude, selectedphoto.latitude);

        //this code was temporarly used to expiriment with other valuse than photos in carousel. This might be usefull in the future
            // var newdiv = document.createElement('div');
            // var position = i - newmainphotonbr;
            // newdiv.className = 'carousel-containter img' + position + ' carousel-info';
            // newdiv.Name = i;
            // newdiv.innerHTML = '<div class="carousel-info-text"><p>Woensdag</p></div>';
            // newdiv.idName = 'img' + position;
            // document.getElementById('main-carousel').appendChild(newdiv);
    
    } else {
        //remove previously applyed CSS fo select photo
        if (selectedphoto != undefined) {
            selectedphoto.imgDOM.style.visibility = 'visible';
            if (document.getElementById('imginfo') != undefined) {
                document.getElementById('imginfo').remove();
            }
            var oldactivedivclassimgcontainer = [].slice.apply(document.getElementsByClassName("active"));
            for (var i = 0; i < oldactivedivclassimgcontainer.length; i++) {
                oldactivedivclassimgcontainer[i].className = oldactivedivclassimgcontainer[i].className.replace(/ *\b active\b/g, "");
            }       
        }
    }    
};

// function used to log the selected foto info to the consol
function writephotovars(){
    console.log("selected photo info:");
    console.log(selectedphoto);
};

// funciton to search the phtoo database for the picure corresponding to the clicked map icone corresponging to a specific img.
function searchphotoDB(searchquery){
    //console.log("searching")
    for (i = 0; i < 2003; i++) {
        var a = photoDB[i].FileName;
        if (a == searchquery) {
            //console.log(photoDB[i].FileName);
            NewSelection(photoDB[i-2].nbr, 1);
        }
    };
};

//loads all imgs in carousel
function LoadCarouselImgs(){
    for ( var i = 0, phs = photoDB.length; i < phs; i++) { 
        var newdiv = document.createElement('div');
        var position = i;
        newdiv.className = 'carousel-containter img' + position;
        newdiv.Name = i;
        newdiv.innerHTML = '<img class="carousel-img img' + position + '" onclick="NewSelection(' + i + ', 0)"  id="imgID' + i + '"src="' + photoDB[i].imgurls + '">';
        idname = "img" + position;
        newdiv.setAttribute("id", idname);
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
        NewSelection(selectedphoto.nbr, 0);
    });

    document.getElementById("prevph").addEventListener('click', function(e) {
        selectedphoto.nbr = selectedphoto.nbr - 1;
        NewSelection(selectedphoto.nbr, 0);
    });

    document.getElementById("nextphbig").addEventListener('click', function(e) {
        selectedphoto.nbr = selectedphoto.nbr + 1;
        NewSelection(selectedphoto.nbr, 0);
    });

    document.getElementById("prevphbig").addEventListener('click', function(e) {
        selectedphoto.nbr = selectedphoto.nbr - 1;
        NewSelection(selectedphoto.nbr, 0);
    });

    document.getElementById("locph").addEventListener('click', function(e) {
        Long = photoDB[selectedphoto.nbr].GPSLongitude;
        Lat = photoDB[selectedphoto.nbr].GPSLatitude;
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
        "data": "https://daanvr.github.io/Schotland/geojson/Scotrip-FotoDataFile-RichOnly-Live.geojson"
    });
    map.addSource('Scotland-Routes', {
        "type": "geojson",
        "data": "https://daanvr.github.io/Schotland/geojson/Routes.geojson"
    });

    var data = JSON.parse('{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[-5.096936,57.149319]},"properties":{"FileName":"IMG_8571","type":"Foto","FileTypeExtension":"jpg","SourceFile":"/Users/daan/Downloads/Schotlandexpiriment/IMG_8571.JPG","CreateDate":"2018-04-13","CreateTime":"15:15:34","Make":"Apple","Model":"iPhoneSE","ImageSize":"16382x3914","Duration":"","Altitude":"276","URL":"https://farm1.staticflickr.com/823/26804084787_f45be76bc3_o.jpg","URLsmall":"https://farm1.staticflickr.com/823/26804084787_939dd60ebc.jpg"}}]}');
    map.addSource('SelectedMapLocationSource', {
        type: "geojson",
        data: data,
    });

    AddMapIcon(); // add img to be used as icon for layer
};

//Displaying geojson data from the previously laoded sources
function DisplayGEOJsonLayers(){
    map.addLayer({ 
        //photos layer
        "id": "photos",
        "type": "symbol",
        "source": "Scotland-Foto",
        "layout": {
            "icon-image": "CustomPhoto",
            "icon-size": 1,
            "icon-offset": [0, -17],
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
    }, 'housenum-label'); // Place polygon under this labels.

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

        map.addLayer({
        //rout layer
        "id": "walked",
        "type": "line",
        "source": "Scotland-Routes",
        "filter": ["==", "activities", "walking"],
        "layout": {
        },
        "paint": {
            "line-color": "rgba(80, 200, 50, 1)",
            "line-width": 4
        }
    }, 'routes-today'); // Place polygon under this labels.

    map.addLayer({
        //layer used to create lins(borders) arround rout
        "id": "walked-shadow",
        "type": "line",
        "source": "Scotland-Routes",
        "filter": ["==", "activities", "walking"],
        "layout": {
        },
        "paint": {
            "line-color": "#4285F4",
            "line-width": 6
        }
    }, 'walked'); // Place polygon under this labels.

    map.addLayer({
        "id": "SelectedMapLocationLayer",
        "type": "symbol",
        "source": "SelectedMapLocationSource",
        "layout": {
            "icon-image": "CustomPhotoSelected",
            "icon-size": 1,
            "icon-offset": [0, -17],
            "icon-padding": 0,
            "icon-allow-overlap":true
        },
        "paint": {
            "icon-opacity": 1
        }
    }, 'country-label-lg');
    ClickbleMapItemCursor(); //Now that the layers a loaded, have the mouse cursor change when hovering some of the layers
    NewSelectedMapLocation();

};

//making "clickble" layers on the map change the mouse cursor. This helps the user see an map item is clickble.
function ClickbleMapItemCursor(){
    //changes cursor style when hovering "clickable" layer.
    map.on("mousemove", "photos", function(e) {map.getCanvas().style.cursor = 'pointer';});
    map.on('mouseleave', "photos", function() {map.getCanvas().style.cursor = '';});

};


function AddMapIcon() {
    map.loadImage('https://daanvr.github.io/Schotland/img/photo.png', function(error, image) {
        if (error) throw error;
        map.addImage('CustomPhoto', image);
    });

    map.loadImage('https://daanvr.github.io/Schotland/img/photo-selected.png', function(error, image) {
        if (error) throw error;
        map.addImage('CustomPhotoSelected', image);
    });

    DisplayGEOJsonLayers();  //Now that the sources are loaded, have the Layers loaded
};


function NewSelectedMapLocation(Long, Lat) {
    var data = JSON.parse('{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[-5.096936,57.149319]},"properties":{"FileName":"IMG_8571","type":"Foto","FileTypeExtension":"jpg","SourceFile":"/Users/daan/Downloads/Schotlandexpiriment/IMG_8571.JPG","CreateDate":"2018-04-13","CreateTime":"15:15:34","Make":"Apple","Model":"iPhoneSE","ImageSize":"16382x3914","Duration":"","Altitude":"276","URL":"https://farm1.staticflickr.com/823/26804084787_f45be76bc3_o.jpg","URLsmall":"https://farm1.staticflickr.com/823/26804084787_939dd60ebc.jpg"}}]}');
    var coordinates = data.features[0].geometry.coordinates;
    data.features[0].geometry.coordinates = [Long, Lat];
    map.getSource('SelectedMapLocationSource').setData(data)
    console.log("NewSelectedMapLocation");
};

function ImgHoverListener() {
    var i;
    for (i = 0; i < 2003; i++) { 
        var ID = "img" + i;
        Long = photoDB[i].GPSLongitude;
        Lat = photoDB[i].GPSLatitude;
        LongLat = Long + ", " + Lat
        document.getElementById(ID).setAttribute('onmouseover', "NewSelectedMapLocation(" + LongLat + ")");
    };
};









$body = $("body");

var properties = {
    currentURL: '',
    previousURL: '',
    savedURL: '',
    userLanguage: 'en',
    resetOnLoad: true,
    popPages: ['contact', 'view', 'legend'],
    loadHash: '',
    loadHashID: '',
}

//Map Initial Variables
var map;
var mapData = {
    drawnItemsLayer: '',
    inputMarker: '',
    suggestionsURL: 'config/comments.php/suggestions/',
    commentsURL: 'config/comments.php/comments/',
    suggestions: {},
    features: {},
    lineStringLayer: {},
    pointsLayer: {},
    ls: {},
    geoJSON: {}
};

$(document).on({
    ajaxStart: function() {
        $body.addClass("loading");
    },
    ajaxStop: function() {
        $body.removeClass("loading");
    },
    ajaxError: function() {
        $body.removeClass('loading');
    }
});

//Load
$(function() {

    $.ajaxSetup({
        // Disable caching of AJAX responses
        cache: false
    });

    var lang = getUrlParameter('lang');
    if (lang == 'en'){
        properties.userLanguage = lang;
        createCookie('lang', lang, 100);
    }

    function hashGrab() {
        var hash = window.location.hash.substring(1).split('/')[1];
        loadPage(hash);
    }

    // Bind an event to window.onhashchange that, when the hash changes, gets the
    // hash and adds the class "selected" to any matching nav link.
    $(window).on('hashchange', function() {
        if (properties.currentURL){
            hashGrab();
        }
    })
    //initial Load
    $(window).load(function() {
        if (properties.resetOnLoad === true){
            properties.loadHash = window.location.hash.substring(1).split('/')[1];
            properties.loadHashID = window.location.hash.substring(2).split('/')[1];
            window.location.href = "#/";
        }
        hashGrab();
    });

    //Load Map
    map = L.map("map", {
        zoomControl: true,
        attributionControl: false,
        minZoom: 0
    }).setView([ 32.372723, -86.316771 ], 15);

    map.zoomControl.setPosition('bottomright');
    L.tileLayer('https://api.mapbox.com/styles/v1/altaplanning/ciw83c2da000t2qqqp5tvx08g/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWx0YXBsYW5uaW5nIiwiYSI6InhqNzQwRW8ifQ.mlA6eN3JguZL_UkEV9WlMA', {}).addTo(map);

    //Set Main Layers
    mapData.selectLayer = L.featureGroup().addTo(map);
    mapData.geoJSON.cityBounds = new L.GeoJSON.AJAX(["data/bounds.geojson"],{
        clickable: false,
        style: {
            color: '#c2dc77',
            weight: 2,
            fillColor: "#1f2552",
            opacity: 0,
            fillOpacity: 0,
            className: "city-bounds"
        }
    })

    mapData.lineStringLayer = L.featureGroup().addTo(map);
    mapData.pointsLayer = new L.MarkerClusterGroup({
        iconCreateFunction: function(cluster) {
            return L.divIcon({
                name: cluster.getChildCount(),
                cluster: true,
                iconUrl: "img/marker-cluster.png?v=2",
                iconSize: new L.Point(50, 50),
                iconAnchor: new L.Point(25, 25)
            });
        },
        showCoverageOnHover: false
    }).addTo(map);
    mapData.drawnItemsLayer = L.featureGroup().addTo(map);

    mapData.geoJSON.cityBounds.on('data:loaded', function() {
      mapData.geoJSON.cityBounds.addTo(map);
      map.fitBounds(mapData.geoJSON.cityBounds.getBounds());
    }.bind(this));

    //Set Icons

    L.DivIcon = L.Icon.extend({
        options: {
            iconUrl: "img/marker.png?v=2",
            shadowUrl: "img/marker-shadow.png?v=2",
            iconSize: [ 40, 51 ],
            shadowSize: [ 40, 6 ],
            cluster: false,
            iconAnchor: [ 20, 51 ],
            shadowAnchor: [ 20, 0 ],
            popupAnchor: [ 0, -55 ],
            imageIcon: "",
            name: "",
            className: "points-icons"
        },
        createIcon: function() {
            var div = document.createElement("div");
            var marker = this._createImg(this.options["iconUrl"]);
            var numdiv = document.createElement("div");
            numdiv.innerHTML = this.options["name"] || "";
            if (this.options["cluster"]) {
                numdiv.setAttribute("class", "ttRoute-map-cluster");
            }
            div.appendChild(marker);
            div.appendChild(numdiv);
            this._setIconStyles(div, "icon");
            return div;
        }
    });

    mapData.inputMarker = L.icon({
        iconUrl: "img/input-marker.png?v=2",
        shadowUrl: "img/input-marker-shadow.png?v=2",
        iconSize: [ 80, 97 ],
        iconAnchor: [ 40, 97 ],
        shadowSize: [ 88, 67 ],
        shadowAnchor: [ 21, 67 ],
        className: "input-marker"
    });


    //Form Validator
    webshims.setOptions('forms', {
        lazyCustomMessages: true,
        iVal: {
            handleBubble: 'hide', // defaults: true. true (bubble and focus first invalid element) | false (no focus and no bubble) | 'hide' (no bubble, but focus first invalid element)
            fx: 'fade', //defaults 'slide' or 'fade'
            sel: '.ws-validate', // simple selector for the form element, setting this to false, will remove this feature
            fieldWrapper: ':not(span, label, em, strong, b, i, mark, p)'
        }
    });
    webshims.polyfill('forms');
    webshim.activeLang(properties.userLanguage); //set locale to en


});


//Main Controllers

$( ".control-user-input" ).click(function() {
  var hide = $(this).hasClass('removed');
  if (hide){
    $(this).text('Hide All Comments');
    $.each(mapData.features, function(index, value) {
        if (this instanceof L.Marker) {
            mapData.pointsLayer.addLayer(this);
        } else if (this instanceof L.Path) {
            mapData.lineStringLayer.addLayer(this);
        }
    });

  }
  else{
    $(this).text('Show All Comments');
    mapData.pointsLayer.clearLayers();
    mapData.lineStringLayer.clearLayers();
  }
  $(this).toggleClass('removed');
});

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1].replace('/', '');
        }
    }
};

function createCookie(cname,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = cname+"="+value+expires+"; path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function loadPage(hash) {

    $('#content-root').removeClass('noswipe');
    
    if ($.inArray(properties.currentURL, properties.popPages) == -1){
        properties.previousURL = properties.currentURL;
    }

    if (hash == '' || hash == undefined) {
        hash = 'home';
    }

    $("#content-root").load("templates/" + properties.userLanguage + "/" + hash + ".html", function(responseText, textStatus, req) {
        if (textStatus == "error") {
            properties.currentURL = '404';
            $("#content-root").load("templates/" + properties.userLanguage + "/404.html", function() {});
        } else {
            properties.currentURL = hash;
            var handler = hash.replace(/-/, '_') + '_handler';
            if (window[handler]){
                var handler = window[handler];
                
                //Change Page Title
                document.title = handler.properties.title;
                //Grab events
                handler.events();
            }

            //Global onLoad Functions For Pages
            $('.content-arrow').click(function(event) {
                $('#content-root').toggleClass('swipe');
                if ($('#content-root').hasClass('swipe') == true){
                    $('html, body').animate({ 
                       scrollTop: 0}, 
                       800, 
                       "swing"
                    );
                }
                else {
                    console.log($('.content-root').offset().top)
                    $('html, body').animate({ 
                       scrollTop: $('.content-root').offset().top}, 
                       800, 
                       "swing"
                    );
                }
                return false;
            });
        }
    });

}
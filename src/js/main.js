$body = $("body");

var properties = {
    currentURL: '',
    userLanguage: getCookie('lang') || 'en'
}

//Map Initial Variables
var map;
var mapData = {
    suggestionsURL: '/config/comments.php/suggestions/',
    suggestions: {},
    features: {}
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
        hashGrab();
    })
    //initial Load
    $(window).load(function() {
        hashGrab();
    });

    //Load Map
    map = L.map("map", {
        zoomControl: true,
        attributionControl: false,
        minZoom: 10
    }).setView([ 47.676736, -117.342302 ], 12);

    map.zoomControl.setPosition('bottomright');
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

    //Set Main Layers
    mapData.lineStringLayer = L.featureGroup().addTo(map);
    mapData.pointsLayer = new L.MarkerClusterGroup({
        iconCreateFunction: function(cluster) {
            return L.divIcon({
                name: cluster.getChildCount(),
                cluster: true,
                iconUrl: "img/marker-cluster.png",
                iconSize: new L.Point(50, 50),
                iconAnchor: new L.Point(25, 25)
            });
        },
        showCoverageOnHover: false
    }).addTo(map);
    mapData.drawnItemsLayer = L.featureGroup().addTo(map);

    //Set Icons

    L.DivIcon = L.Icon.extend({
        options: {
            iconUrl: "img/marker.png",
            iconSize: [ 24, 24 ],
            cluster: false,
            iconAnchor: [ 12, 12 ],
            popupAnchor: [ 0, -15 ],
            imageIcon: "",
            name: "",
            className: "leaflet-div"
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

    var inputMarker = L.icon({
        iconUrl: "img/input-marker.png",
        shadowUrl: "img/input-marker-shadow.png",
        iconSize: [ 47, 93 ],
        iconAnchor: [ 5, 93 ],
        shadowSize: [ 64, 40 ],
        shadowAnchor: [ 0, 42 ]
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

    if (hash == '' || hash == undefined) {
        hash = 'home';
    }

    $("#content-root").load("templates/" + properties.userLanguage + "/" + hash + ".html", function(responseText, textStatus, req) {
        if (textStatus == "error") {
            properties.currentURL = '';
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
        }
    });

}
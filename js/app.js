// If Google Map alerts its failure to load
var Alert = function() {
    alert('Failed to load!!');
};

var map;
var marker;
var myInfoWindow;
var markers = [];

var myplaces = [{
    title: "LuLu Mall",
    location: {
        lat: 10.027054,
        lng: 76.308079
    },
    img: 'img/lulu.png',
}, {
    title: 'Hill Palace',
    location: {
        lat: 9.952639,
        lng: 76.363914
    },
    img: 'img/hillpalace.png',
}, {
    title: 'Mattancherry Palace',
    location: {
        lat: 9.958275,
        lng: 76.259349
    },
    img: 'img/mattancherypalace.png',
}, {
    title: 'Paradesi Synagogue',
    location: {
        lat: 9.9575,
        lng: 76.2594
    },
    img: 'img/jewishsynagogue.png',
}, {
    title: 'Indo-Portuguese Museum',
    location: {
        lat: 9.965779,
        lng: 76.242115
    },
    img: 'img/indoportuguesemuseum.png',
}, {
    title: 'Marine Drive,Kochi',
    location: {
        lat: 9.98258,
        lng: 76.275427
    },
    img: 'img/marinedrive.png',
}, {
    title: 'Mangalavanam Bird Sanctuary',
    location: {
        lat: 9.9892,
        lng: 76.2735
    },
    img: 'img/birdsanct.png',
}, {
    title: 'Sree Poornathrayeesa Temple',
    location: {
     lat: 9.945009,
        lng: 76.342226
    },
    img: 'img/poornathrayeeshatemple.png',
}, {
    title: 'Chottanikkara Temple',
    location: {
        lat: 9.933126,
        lng: 76.391356
    }, // latitude and longitude
    img: 'img/chottanikkara.png',
}, {
    title: 'Thrikkakara Temple',
    location: {
        lat: 10.034357,
        lng: 76.328703
    },
    img: 'img/thrikkakara.png',
}, {
    title: 'Ernakulam Shiva Temple',
    location: {
        lat: 9.969106,
        lng: 76.288631
    },
    img: 'img/ErnakulamShivaTemple.png',
}, {
    title: 'Thamaramkulangara Sree Dharma Sastha Temple',
    location: {
        lat: 9.948683,
        lng: 76.346362
    },
    img: 'img/shasthatemple.png',
}];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 9.9816358,
            lng: 76.2998842
        },
        zoom: 10,
    });
    myInfoWindow = new google.maps.InfoWindow();
    getmymarkers();
}

//Initiating the markers and calling the infowindow to open on them.Also fixing the boundary.
function getmymarkers() {
    var bounds = new google.maps.LatLngBounds();
    // The following group uses the myplaces array to create an array of markers on initialize.
    for (var i = 0; i < myplaces.length; i++) {
        // Get the position from the myplaces array.
        var position = myplaces[i].location;
        var title = myplaces[i].title;
        var img = myplaces[i].img;
        // Create a marker per location, and put into markers array.
        marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            img: img,
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, myInfoWindow);
        });
        bounds.extend(markers[i].position);
        myplaces[i].marker = marker;
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
}

//populate infowindow when the marker is clicked and only open on the clicked marker
function populateInfoWindow(marker, infowindow) {
    //See if the infowindow is not opened already on this marker.
    if (infowindow.marker != marker) {
        infowindow.setContent('<div>' + marker.title + '</div><br>' + '<img src="' + marker.img + '" alt="Image of ' + marker.title + '"><br>' + '<div id="wikipedia-links"></div>');
        infowindow.marker = marker;
        infowindow.open(map, marker);
        marker.setAnimation(google.maps.Animation.BOUNCE);//applying bounce animation when marker is clicked toopen infowindow
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;//clear marker property on closing infowindow
            marker.setAnimation(null);//stopping bounce animation on closing infowindow
        });
    }

    // load wikipedia data and append to the infowindow
    var $mylink = $('#wikipedia-links');
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function() {
        $mylink.text("Failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        //jsonp:"callback",
        success: function(response) {
            var wikiList = response[1];
            for (var i = 0; i < wikiList.length; i++) {
                wikiStr = wikiList[i];
                var url = 'http://en.wikipedia.org/wiki/' + wikiStr;
                $mylink.append('<li><a href=" ' + url + ' ">' + wikiStr + '</a></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }
    });
};

//Knockout binding
var MyAppsViewModel = function(){
    var self = this;
    self.myplaces = ko.observableArray(myplaces);
    self.title = ko.observable('');
    this.setMarker = function(){
        populateInfoWindow(this.marker,myInfoWindow);
    };

//Method1
    // self.filterlist = ko.computed(function(){
    //     var filter = self.title().toLowerCase();
    //     myInfoWindow.close();
    //     ko.utils.arrayForEach(self.myplaces(), function(i) {
    //     i.isActive(false);
    // });
    //         if (!filter) {
    //         ko.utils.arrayForEach(self.myplaces(), function(i) {
    //             i.marker.setVisible(true);
    //         });
    //         return self.myplaces();
    //     } else {
    //         return ko.utils.arrayFilter(self.myplaces(), function(i) {
    //             if (i.name.toLowerCase().indexOf(filter) !== -1) {
    //                 i.marker.setVisible(true);
    //                 return true;
    //             } else {
    //                 i.marker.setVisible(false);
    //                 return false;
    //             }
    //         });
    //     }
    // }, self);


//Method2
//     MyAppsViewModel.filteredItems = ko.computed(function() {
//     var filter = this.filter().toLowerCase();
//     if (!filter) {
//         return this.myplaces();
//     } else {
//         return ko.utils.arrayFilter(this.myplaces(), function(myplaces) {
//             return ko.utils.stringStartsWith(myplaces.title().toLowerCase(), filter);
//         });
//     }
// }, MyAppsViewModel);

};

ko.applyBindings(new MyAppsViewModel());
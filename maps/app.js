let map;
//  Google maps search
 $("#search").on("click", function(event) {
    // Clear map 
    deleteMarkers();

    // Gets nearby places using the zip code the user inputted
    var zipCode = $("#zipCode").val();
    getNearbyPlaces({}, zipCode);
})


// Initialize and add the map
function initMap() {
    console.log("initMap()");
    if (google.maps) {
        console.log("1) Google maps has been loaded");
    } 

    if (typeof google === 'object' && typeof google.maps === 'object') {
        console.log("2) Google maps has been loaded");
    }

    bounds = new google.maps.LatLngBounds();
    infoWindow = new google.maps.InfoWindow();
    currentInfoWindow = infoWindow;
    infoPane = document.getElementById('panel');
    
    // The location of San Diego
   pos = {
        lat: 32.7157, 
        lng: -117.1611 };
    // The map, centered at San Diego
    map = new google.maps.Map(
        document.getElementById('map'), {
        zoom: 14,
        center: pos
    });
    // The marker, positioned at San Diego
    marker = new google.maps.Marker({ position: pos, map: map });

    bounds.extend(pos);
    // infoWindow.setPosition(pos);
    // infoWindow.setContent('Location found.');
    console.log("Should be opening map: " + map);
    infoWindow.open(map);
    getNearbyPlaces(pos, "restaurants");

}

function getNearbyPlaces(position, query) {
    var request = {
        location: position,
        radius: '1000',
        query: query,
        type: ['']
    };
    console.log("google.maps: " + JSON.stringify(google.maps));
    service = new google.maps.places.PlacesService(map);
    
    service.textSearch(request, nearbyCallback);

}
function nearbyCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        createMarkers(results);
    }
}
function createMarkers(places) {
    places.forEach(place => {
        map.setCenter(place.geometry.location);
        let marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', () => {
            let request = {
                placeId: place.place_id,
                fields: ['name', 'formatted_address', 'geometry', 'rating', 'website', 'photos']
            };
            service.getDetails(request, (placeResult, status) => {
                console.log("status in createMarkers: " + status);
                console.log("placeResult in createMarkers: " + placeResult);
                showDetails(placeResult, marker, status)
            });
        });
        bounds.extend(place.geometry.location);
    });
    map.fitBounds(bounds);
}
function showDetails(placeResult, marker, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        let placeInfowindow = new google.maps.InfoWindow();
        let rating = "None";
        if (placeResult.rating) rating = placeResult.rating;
        placeInfowindow.setContent('<div><strong>' + placeResult.name +
            '</strong><br>' + 'Rating: ' + rating + '</div>');
        placeInfowindow.open(marker.map, marker);
        currentInfoWindow.close();
        currentInfoWindow = placeInfowindow;
        showPanel(placeResult);
    } else {
        console.log('showDetails failed: ' + status);
    }
}
function showPanel(placeResult) {
    if (infoPane.classList.contains("open")) {
        infoPane.classList.remove("open");
    }
    while (infoPane.lastChild) {
        infoPane.removeChild(infoPane.lastChild);
    }
    if (placeResult.photos) {
        let firstPhoto = placeResult.photos[0];
        let photo = document.createElement('img');
        photo.classList.add('hero');
        photo.src = firstPhoto.getUrl();
        infoPane.appendChild(photo);
    }
    let name = document.createElement('h1');
    name.classList.add('place');
    name.textContent = placeResult.name;
    infoPane.appendChild(name);
    if (placeResult.rating) {
        let rating = document.createElement('p');
        rating.classList.add('details');
        rating.textContent = `Rating: ${placeResult.rating} \u272e`;
        infoPane.appendChild(rating);
    }
    let address = document.createElement('p');
    address.classList.add('details');
    address.textContent = placeResult.formatted_address;
    infoPane.appendChild(address);
    if (placeResult.website) {
        let websitePara = document.createElement('p');
        let websiteLink = document.createElement('a');
        let websiteUrl = document.createTextNode(placeResult.website);
        websiteLink.appendChild(websiteUrl);
        websiteLink.title = placeResult.website;
        websiteLink.href = placeResult.website;
        websitePara.appendChild(websiteLink);
        infoPane.appendChild(websitePara);
    }
    infoPane.classList.add("open");
}


function deleteMarkers() {
    TODO 
    for (var i = 0; i < markers.length; i++) {
       markers[i].setMap(null);
    }
}

initMap();


//search by zip code
//search by user location
//search by restaurants in DB

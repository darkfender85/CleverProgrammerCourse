let map;
let home_coordinates = { lat: 45.87778544969813, lng: 11.955440112312989 };
let los_angeles = { lat: 34.06648564239142, lng: -118.24419624706255 };
let markers;
let infowindow;
let directionsService;
let  directionsRenderer;
const baseApiUrl = "http://localhost:3000/api";
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: los_angeles, //home_coordinates,
    zoom: 8,
  });
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  
  directionsRenderer.setMap(map);
  document.getElementById("header").style.left = 0;
  setTimeout(() => {
    document.querySelector(".wrapper-content-listing").style.opacity = 1;
  }, 2000);
  //addInitialMarker()
  infowindow = new google.maps.InfoWindow();
  getStores();
}

let initalMarkerInterval;
const addInitialMarker = () => {
  if (!map) {
    initalMarkerInterval = setInterval(() => {
      addInitialMarker();
    }, 1000);
  } else {
    let markerPosition = { lat: 34.06338, lng: -118.35808 };

    let marker = createMarker(markerPosition);

    if (initalMarkerInterval) clearInterval(initalMarkerInterval);
  }
};

const onInputEnter = (e) => {
    if(e.key == 'Enter') getStores();
}

const getStores = () => {
  let zipAddress = document.getElementById("zipAddress").value;
  if (!zipAddress) return;
  fetch(`${baseApiUrl}/stores?zipCode=${zipAddress}`)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    })
    .then((data) => {
      console.log(data);
      let stores = data.stores;
      let coordinates = data.coordinates;
      if(stores.length>0){
        clearAllMarkers();
        searchLocationsNear(stores,coordinates);
        setStoresList(stores);
        setOnClickListeners();
      }
      else{
        clearAllMarkers();
        noStoresFound(coordinates);
      }
    });
};

const searchLocationsNear = (stores,initialCoordinates) => {
  let bounds = new google.maps.LatLngBounds();
  bounds.extend( new google.maps.LatLng(initialCoordinates[1],initialCoordinates[0]));
  markers = [];
  stores.forEach((store, index) => {
    let coordinates = store.location.coordinates,
      latLng = new google.maps.LatLng(coordinates[1], coordinates[0]),
      name = store.storeName,
      address = store.addressLines[0];
    bounds.extend(latLng);
    let marker = createMarker(latLng, name, address, index);
    addWindowInfoToMarker(marker, store, latLng);
    markers.push(marker);
  });
  map.fitBounds(bounds);
};

const addWindowInfoToMarker = (marker, store, position) => {
  marker.addListener("click", () => {
    infowindow.setContent(`
        <div class="window-store-info-wrapper">
            <div class="store-info-title">${store.storeName}</div>
            <div class="store-info-open-status">${store.openStatusText}</div>
            <div class="store-info-address" onclick="getDirections(${store.location.coordinates})">${store.addressLines[0]}</div>
            <a class="store-info-phone" href="tel:${store.phoneNumber}"><span>${store.phoneNumber}</span></a>
        </div>`);
    infowindow.setPosition(position);
    infowindow.setOptions({
      pixelOffset: new google.maps.Size(0, -45),
      minWidth: 250,
    });
    infowindow.open(map);
  });
};

const getDirections = (lng,lat) => {
  let origin = { lat: 34.06338, lng: -118.35808 };
  let destination = {lng, lat};
  console.log(destination);

  var request = {
    origin: origin,
    destination: destination,
    travelMode: 'DRIVING'
  };
  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      directionsRenderer.setDirections(result);
    }
  });
}

const createMarker = (position, name, address, storeNumber) => {
  return new google.maps.Marker({
    position: position,
    map: map,
    label: `${storeNumber + 1}`,
  });
};

const setStoresList = (list) => {
  let storesListEl = document.querySelector(".stores-list");

  storesListEl.innerHTML = list
    .map(
      (store, index) => `
    <div class="store-container">
      <div class="list-item">
        <div class="store-name">${store.storeName}</div>
        <div class="store-address-line-one">${store.addressLines[0]}</div>
        <div class="store-address-line-two">${store.addressLines[1]}</div>
        <div class="store-phone-number">${store.phoneNumber}</div>
        <div class="store-index">${index + 1}</div>
      </div>
    </div>`
    )
    .join("");
};

const setOnClickListeners = () => {
  let storeElements = document.querySelectorAll(".store-container");

  storeElements.forEach((element, index) => {
    element.addEventListener("click", () =>
      google.maps.event.trigger(markers[index], "click")
    );
  });
};

const clearAllMarkers = () => {
  if (Array.isArray(markers)) markers.forEach((marker) => marker.setMap(null));
  if (infowindow) infowindow.close();
};


 const noStoresFound = (coordinates) => {
    const html = `<div class="no-stores-found">No Stores Found</div>`;
    let bounds = new google.maps.LatLngBounds();
  bounds.extend( new google.maps.LatLng(coordinates[1],coordinates[0]));
  map.fitBounds(bounds);

  document.querySelector(".stores-list").innerHTML = html;

  }
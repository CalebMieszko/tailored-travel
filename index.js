/* 

What events will your application need?
- <select> element (details here: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)
- Do we need any event handling for map interactions? I don't think so... but good to keep in mind.

What APIs will you need and in what order?
- Geolocation API
- Leaflet
- Foursquare API (five nearest locations on the map)

How will you obtain the user's location?
- Geolocation API - we'll request it from the user

How will you add the user's location to the map?
- We'll pass the right values from our Geolocation request to the map function we create
    - We'll grab the coordinates and pass those in as a argument for our function

How will you get the selected location from the user?
- Using event listener on the <select> element in our HTML
    - Researching input events to see if they would work, or should I use change or onchange? 
    https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event

How will you add that information to the map?
- This requires tapping in to the Foursquare API - I've got some research to do!

*/



// get user location                                                         
async function getCoords(){
    // set geolocation options
    const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
    };
    pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
    return [pos.coords.latitude, pos.coords.longitude]
}                   

// get the tiles
const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
})

// query Foursquare API for locations the user selects
async function placeSearch(selection, coords) {
    try {
        const searchParams = new URLSearchParams({
          query: selection,
          ll: coords,
          open_now: 'true',
          sort: 'DISTANCE'
        });
        const results = await fetch(
          `https://api.foursquare.com/v3/places/search?${searchParams}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: 'fsq3VdkyX8R8j/VCAEqNrnYWw7YcdSyv9G8JWIbAlwleyp4=',
            }
          }
        );
        const data = await results.json();
        return data;
    } catch (err) {
        console.error(err);
    }
}

// generate markers for each location we pass in
async function createMarkers(locations, map) {
    locations.forEach(location => {
        let position = [location.geocodes.main.latitude, location.geocodes.main.longitude]
        let marker = L.marker(position)
        marker.addTo(map).bindPopup(`${location.name} ${location.location.address}`).openPopup();
    }); 
}

// on load, use the user's location to generate the map and listen for location selections
window.onload = async () => {
    const coords = await getCoords()
    const strCoords = `${coords[0]},${coords[1]}`
    let map = L.map('map').setView(coords, 15);
    tiles.addTo(map);
    userMarker = L.marker(coords)
    userMarker.addTo(map).bindPopup('Your location').openPopup();
    // query business type from user when drop down choice is made
    const selectElement = document.querySelector('#location-select')
    selectElement.addEventListener('input', async (event)=> {
        const selection = event.target.value
        console.log(selection, strCoords)  
        let result = await placeSearch(selection, strCoords)
        let locations = result.results
        console.log(locations)
        createMarkers(locations, map)
    })
}
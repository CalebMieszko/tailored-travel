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

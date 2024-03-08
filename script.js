/*--------------------------------------------------------------------
GGR472 Lab 3 - Ahmad Ashraf
--------------------------------------------------------------------*/

// access token
mapboxgl.accessToken = 'pk.eyJ1IjoiYWhtYWRhc2hyYWYxNTQiLCJhIjoiY2xyaTYzNXlsMDM0eDJpcnhtY3lnb2QzdCJ9.PUhrzYu0LU7a6_Up5_Q-eA';

//initialize map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v12', // Mapbox Outdoors style
    center: [-105, 58],
    zoom: 3,
    maxBounds: [
        [-180, 30], // Southwest
        [-25, 84]  // Northeast
    ],
});

/*--------------------------------------------------------------------
ADDING MAPBOX CONTROLS AS ELEMENTS ON MAP
--------------------------------------------------------------------*/
//add zoom and rotation controls 
map.addControl(new mapboxgl.NavigationControl());

//add fullscreen option to the map
map.addControl(new mapboxgl.FullscreenControl());

//create geocoder variable, only show United States results
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries: "ca",
    //place: "Toronto"
});

//position geocoder on page
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


/*--------------------------------------------------------------------
ADD Toronto Neighbourhood DATA AS CHOROPLETH MAP ON MAP LOAD
Use get expression to categorise data based on air pollition values
--------------------------------------------------------------------*/
//Add data source and draw initial visiualization of layer
map.on('load', () => {
    map.addSource('crime-data', {
        //adding nyc sat data json file
        type: 'geojson',
        data: 'https://github.com/ahmadashraf1/GG472-Lab3/blob/main/NYCdata.json',
        'generateId': true //Create a unique ID for each feature
    });
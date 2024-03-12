/*--------------------------------------------------------------------
GGR472 Lab 3 - Ahmad Ashraf
--------------------------------------------------------------------*/

// access token
mapboxgl.accessToken = 'pk.eyJ1IjoiYWhtYWRhc2hyYWYxNTQiLCJhIjoiY2xyaTYzNXlsMDM0eDJpcnhtY3lnb2QzdCJ9.PUhrzYu0LU7a6_Up5_Q-eA';

// initializing map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/navigation-night-v1',
    center: [-79.335115, 43.729266],
    zoom: 10,
});


/*--------------------------------------------------------------------
ADDING MAPBOX CONTROLS AS ELEMENTS ON MAP
--------------------------------------------------------------------*/
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());

//creating geocoder variable
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries: "ca",
    place: "Toronto"
});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


//Adding crime data source
map.on('load', () => {
    map.addSource('crime-data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/ahmadashraf1/GG472-Lab3/main/neighbourhood-crime-rates.geojson',
        'generateId': true //Create a unique ID for each feature
    });

    map.addLayer({
        'id': 'neighbourhood-fill',
        'type': 'fill',
        'source': 'crime-data',
        'paint': {
            'fill-color': [
                'step', // STEP expression produces stepped results based on value pairs
                ['get', 'ASSAULT_2023'], // GET expression retrieves property value from 'ASSAULT_2023' data field
                '#fee5d9', // Colour assigned to any values < first step
                100, '#fcbba1', // Colours assigned to values >= each step
                200, '#fc9272',
                300, '#fb6a4a',
                400, '#de2d26',
                500, '#a50f15'
            ],
            'fill-opacity': 0.7,
            'fill-outline-color': 'black'
        },
    });
});


// Adding a Legend
const legendlabels = [
    '0-100',
    '100-200',
    '200-300',
    '300-400',
    '400-500',
    '>500'
];

const legendcolours = [
    '#fee5d9',
    '#fcbba1',
    '#fc9272',
    '#fb6a4a',
    '#de2d26',
    '#a50f15'

];

//Declare legend variable using legend div tag
const legend = document.getElementById('legend');

//For each layer create a block to put the colour and label in
legendlabels.forEach((label, i) => {
    const color = legendcolours[i];

    const item = document.createElement('div'); //each layer gets a 'row' - this isn't in the legend yet, we do this later
    const key = document.createElement('span'); //add a 'key' to the row. A key will be the color circle

    key.className = 'legend-key'; //the key will take on the shape and style properties defined in css
    key.style.backgroundColor = color; // the background color is retreived from teh layers array

    const value = document.createElement('span'); //add a value variable to the 'row' in the legend
    value.innerHTML = `${label}`; //give the value variable text based on the label

    item.appendChild(key); //add the key (color cirlce) to the legend row
    item.appendChild(value); //add the value to the legend row

    legend.appendChild(item); //add row to the legend
});


//adding event listener for full screen
document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [-79.3832, 43.6932],
        zoom: 10,
        essential: true
    });
});

//change display of legend layers based on check box
let legendcheck = document.getElementById('legendcheck');

legendcheck.addEventListener('click', () => {
    if (legendcheck.checked) {
        legendcheck.checked = true;
        legend.style.display = 'block';
    }
    else {
        legend.style.display = "none";
        legendcheck.checked = false;
    }
});

//  adding popup
map.on('click', 'neighbourhood-fill', (e) => {
    const name = e.features[0].properties.AREA_NAME;
    const level = e.features[0].properties.ASSAULT_2023;

    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML("<h5>" + name + "</h5>" + "Count of assaults for 2023: " + level)
        .addTo(map);
});

// Change the cursor to a pointer when hovering over the fill layer
map.on('mouseenter', 'neighbourhood-fill', function () {
    map.getCanvas().style.cursor = 'pointer';
});

// Change the cursor back to the default when no longer hovering over the fill layer
map.on('mouseleave', 'neighbourhood-fill', function () {
    map.getCanvas().style.cursor = '';
});

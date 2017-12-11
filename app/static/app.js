var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 54.7, lng:-1.57},
    zoom: 13,
    scaleControl: true,
});

$.getJSON('/static/map-style.json', function(style) {
    map.setOptions({styles: style});
});

$.getJSON('/static/centers.json', function(centers) {
    undex.globals = {
        map: undex.Map(map, centers),
        ui:  undex.UI(),
    };
});

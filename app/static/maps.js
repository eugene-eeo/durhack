undex.Map = function(map, centers) {
    var centerMarkers = {};
    var circleMarkers = {};
    var solutionMarkers = [];

    function show(id) {
        if (!centerMarkers[id]) {
            centerMarkers[id] = centers[id].map(center => {
                var m = createMarker(center);
                m.setMap(map);
                return m;
            });
        }
        centerMarkers[id].forEach(marker => marker.setMap(map));
        (circleMarkers[id] || []).forEach(marker => marker.setMap(map));
    }

    function hide(id) {
        (centerMarkers[id] || []).forEach(marker => marker.setMap(null));
        (circleMarkers[id] || []).forEach(marker => marker.setMap(null));
    }

    function createMarker(center) {
        return new google.maps.Marker({
            position: center.geometry.location,
            icon: 'http://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png',
        });
    }

    function createCircle(center) {
    }

    function plotConstraint(id, radius) {
        show(id);
        // if we've plotted the circles before then just change the radius
        if (circleMarkers[id] !== undefined) {
            circleMarkers[id].forEach(c => c.setRadius(radius));
            return;
        }
        circleMarkers[id] = centers[id].map(center => {
            return new google.maps.Circle({
                center: center.geometry.location,
                strokeColor: '#99bbff',
                strokeOpacity: 0.50,
                strokeWeight: 2,
                fillColor: '#99bbff',
                fillOpacity: 0.05,
                radius: radius,
                map: map,
            });
        });
    }

    function plotSolutions(solutions) {
        solutionMarkers = solutions.map((sol, i) => {
            var marker = new google.maps.Marker({
                position: {lat: sol.loc[0], lng: sol.loc[1]},
                map: map,
            });
            var info_window = new google.maps.InfoWindow({
                content: "<p>" + sol.raw.display_name + "</p>",
            });
            marker.addListener('click', function() {
                info_window.open(map, marker);
                centerAtSolution(i);
            });
            return marker;
        });
    }

    function removeSolutions() {
        solutionMarkers.forEach(marker => marker.setMap(null));
        solutionMarkers = [];
    }

    function centerAtSolution(i) {
        map.setCenter({
            lat: solutionMarkers[i].position.lat(),
            lng: solutionMarkers[i].position.lng(),
        });
        map.setZoom(18);
    }

    return {
        show:             show,
        hide:             hide,
        plotConstraint:   plotConstraint,
        plotSolutions:    plotSolutions,
        removeSolutions:  removeSolutions,
        centerAtSolution: centerAtSolution,
    };
};

/**
 * Created by john on 27/11/16.
 */
RouteMap = function () {

    var directionsService ='';
    var directionsDisplay ='';
    var geocoder = '';
    var map ='';

    var initMap = function() {
        directionsService  = new google.maps.DirectionsService;
        directionsDisplay = new google.maps.DirectionsRenderer();
        geocoder = new google.maps.Geocoder();

        map = new google.maps.Map(document.getElementById('RouteMap'), {
            zoom: 5,
            center: {lat: 20.5937, lng: 78.9629}
        });

        directionsDisplay.setMap(map);
        initHandler();
    };

    initHandler = function () {
        $('.location').focus(function () {
            $location_input = $(this);
            var options = {
                componentRestrictions: {
                    //country: 'ca'
                }
            };
            autocomplete = new google.maps.places.Autocomplete($location_input.get(0), options);
            autocomplete.addListener('place_changed', fillInAddress);
        });
    };

    var fillInAddress = function(result) {
        var result = autocomplete.getPlace();
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };

    var calculateAndDisplayRoute = function(directionsService, directionsDisplay) {
        var waypts = []; var destination = '';

        $('.route').each(function () {
            if($(this).val() != '') {
                waypts.push({
                    location: $(this).val(),
                    stopover: true
                });
            }
        })

        if(document.getElementById('end').value != '') {
            destination = document.getElementById('end').value;
        }
        else {
            OriginLocation = document.getElementById('start').value
            setOriginLocation(OriginLocation);
            return '';
        }
        ResetMap();

        directionsService.route({
            origin: document.getElementById('start').value,
            destination: destination,
            waypoints: waypts,
            optimizeWaypoints: true,
            provideRouteAlternatives: false,
            travelMode: 'DRIVING'
        }, function(response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
                var route = response.routes[0];
                for (var i = 0; i < route.legs.length; i++) {
                    makeMarker( route.legs[i].start_location, route.legs[i].start_address+' '+route.legs[i].distance.text+' ('+route.legs[i].duration.text+')');                              
                }
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    function makeMarker( position, title ) {
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            title:title
        });

        var infowindow = new google.maps.InfoWindow({
            content: '<div>'+title+'</div>'
        });
        infowindow.open(map, marker);
    }

    $('.addMore').click(function () {
        var inputBox;
        var TotalRoute = $('.RouteInput').find('label').length;
        inputBox = "<div class=\"form-group\"><label> Route "+(TotalRoute+3)+" </label> <input type=\"text\" class=\"form-control location route\"><button type=\"button\" class=\"btn del-btn btn-xs btn-danger\" onclick=\'delRoute(this)\'>delete</button></div>";
        $('.RouteInput').append(inputBox);
        initHandler();
    });

    delRoute = function (target) {
        $(target).parent().remove();
        var flag = 0;
        $('.RouteInput').find('label').each(function(e){
            $(this).text('Route '+(e+3))
            flag = 1;
        });
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };

    setOriginLocation = function (address,status) {
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                //places a marker on every location
                marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location                    
                });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    };

    ResetMap = function (){
        map = new google.maps.Map(document.getElementById('RouteMap'), {
            zoom: 5,
            center: {lat: 20.5937, lng: 78.9629}
        });
        directionsDisplay.setMap(map);
    }

    return{
        init: function () {
            initMap();
        }
    }
}();
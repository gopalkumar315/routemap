/**
 * Created by john on 27/11/16.
 */
RouteMap = function () {

    var directionsService ='';
    var directionsDisplay ='';
    var map ='';

    var icons = {
        start: new google.maps.MarkerImage(
            // URL
            'start.png',
            // (width,height)
            new google.maps.Size( 44, 32 ),
            // The origin point (x,y)
            new google.maps.Point( 0, 0 ),
            // The anchor point (x,y)
            new google.maps.Point( 22, 32 )
        ),
        end: new google.maps.MarkerImage(
            // URL
            'end.png',
            // (width,height)
            new google.maps.Size( 44, 32 ),
            // The origin point (x,y)
            new google.maps.Point( 0, 0 ),
            // The anchor point (x,y)
            new google.maps.Point( 22, 32 )
        )
    };

    var map ='';
    var initMap = function() {
        directionsService  = new google.maps.DirectionsService;
        directionsDisplay = new google.maps.DirectionsRenderer();

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
            destination = document.getElementById('start').value;
        }

        directionsService.route({
            origin: document.getElementById('start').value,
            destination: destination,
            waypoints: waypts,
            optimizeWaypoints: true,
            provideRouteAlternatives: false,
            travelMode: 'DRIVING'
        }, function(response, status) {
            console.log(response);
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
                var route = response.routes[0];

                for (var i = 0; i < route.legs.length; i++) {
                    if(route.legs[i].distance.text == '1 m') {
                        makeMarker( route.legs[i].start_location, icons.start, route.legs[i].start_address);
                    } else {
                        makeMarker( route.legs[i].start_location, icons.start, route.legs[i].start_address+' '+route.legs[i].distance.text);
                    }
                }

            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    function makeMarker( position, icon, title ) {
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

    return{
        init: function () {
            initMap();
        }
    }
}();
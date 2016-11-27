/**
 * Created by john on 27/11/16.
 */
RouteMap = function () {

    var directionsService ='';
    var directionsDisplay ='';

    var initMap = function() {
        directionsService  = new google.maps.DirectionsService;
        directionsDisplay = new google.maps.DirectionsRenderer;
        var map = new google.maps.Map(document.getElementById('RouteMap'), {
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
            travelMode: 'DRIVING'
        }, function(response, status) {
            console.log(response);
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
                console.log(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
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
var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">Los Angeles</h1>'+
            '<div id="bodyContent">'+
            '<p><b>Los Angeles</b>, a city </p>'+
            '</div>'+
            '</div>';
     var map, infoWindow;
     var markers = [];

      function initMap() {
          map = new google.maps.Map(document.getElementById('map'), {zoom: 11});
        infowindow = new google.maps.InfoWindow({
             // content: contentString
          });
          var geocoder = new google.maps.Geocoder;
        //Geocd User's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            infoWindow.setPosition(pos);
            infoWindow.setContent('Your Current Location.');
            //Mark, Click event and infor windown
            var user_marker = new google.maps.Marker({
              map: map,
              position: pos
            });
            markers.push(user_marker);
            //Information window
            marker.addListener('click', function () {
              infowindow.open(map, user_marker);
            });
            //infoWindow.open(map);
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // If Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }

         geocoder.geocode({'address': 'Los Angeles'}, function (results, status) {
          if (status === 'OK') {
            map.setCenter(results[0].geometry.location);

            //Mark, Click event and infor windown
            var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
            });
            markers.push(marker);
            //Information window
            marker.addListener('click', function () {
              infowindow.open(map, marker);
            });
          } else {
            window.alert('Geocode was not successful for the following reason: ' +
                    status);
          }
        });
        //Gecode the city by enter the name or zipcode, address
          document.getElementById('submit').addEventListener('click', function() {
          geocodeAddress(geocoder, map);
        })
          cityboundary();
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }

      // Adds a marker to the map and push to the array.

      //Markers show and remove
      // Sets the map on all markers in the array.
      function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }
      // Removes the markers from the map, but keeps them in the array.
      function clearMarkers() {
        setMapOnAll(null);
      }
      // Shows any markers currently in the array.
      function showMarkers() {
        setMapOnAll(map);
      }
      // Deletes all markers in the array by removing references to them.
      function deleteMarkers() {
        clearMarkers();
        markers = [];
      }


      //Search and Geocode location, set a marker
      function geocodeAddress(geocoder, resultsMap) {
        var address = document.getElementById('address').value;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
              map: resultsMap,
              position: results[0].geometry.location
            });
            // Adds a marker to the map and push to the array.
            markers.push(marker);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }

      //Import city boundary geojson data
      function cityboundary(){
           infoWindow = new google.maps.InfoWindow;
           map.data.loadGeoJson('gz_2010_us_050_00_500k.json');
           //Style setting
           map.data.setStyle(function(feature) {
               var color = 'gray';
               if (feature.getProperty('isColorful')) {
                   color = feature.getProperty('color');
                }
               return /** @type {!google.maps.Data.StyleOptions} */({
                fillColor: color,
                strokeColor: color,
                strokeWeight: 1.2,
                    fillOpacity:0.3,
                  });
               return {icon:feature.getProperty('icon')};
           });

            // When the user clicks, set 'isColorful', changing the color of the letters.
            map.data.addListener('click', function(event) {
                map.data.overrideStyle(event.feature, {fillColor: '#3399FF',fillOpacity:0.3, strokeOpacity:0.7, strokeWeight: 3.5});

            //show an infowindow on click
				infoWindow.setContent('<div style="line-height:1.35;overflow:hidden;white-space:nowrap;"> County: '+
											event.feature.getProperty("NAME")  +"<br/>Novel Coronavirus Cases: " + event.feature.getProperty("value") + "</div>");
				var anchor = new google.maps.MVCObject();
				anchor.set("position",event.latLng);
				infoWindow.open(map,anchor);
            });
            map.data.addListener('mousedown', function(event) {
                map.data.revertStyle();
            });
      }
      //Google sign in
      function onSignIn(googleUser) {
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
      }

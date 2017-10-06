 var config = {
    apiKey: "AIzaSyBdRes2snb0kg27ahUhZSCF6t9Q2Pke_0c",
    authDomain: "flight-app-a6688.firebaseapp.com",
    databaseURL: "https://flight-app-a6688.firebaseio.com",
    projectId: "flight-app-a6688",
    storageBucket: "",
    messagingSenderId: "861898449579"
  };
  firebase.initializeApp(config);

 var flightNum = 0;
 var startingAdd = "";

 var placeSearch, autocomplete;
      var componentForm = {
        street_number: "short_name",
        route: "long_name",
        locality: "long_name",
        administrative_area_level_1: "short_name",
        country: "long_name",
        postal_code: "short_name"
      };

      function initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
            {types: ['geocode']});

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', fillInAddress);
      }

      function fillInAddress() {
        // Get the place details from the autocomplete object.
        var place = autocomplete.getPlace();

        for (var component in componentForm) {
          document.getElementById(component).value = '';
          document.getElementById(component).disabled = false;
        }

        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0];
          if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
          }
        }
      }
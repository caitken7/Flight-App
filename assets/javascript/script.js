 var config = {
   apiKey: "AIzaSyBdRes2snb0kg27ahUhZSCF6t9Q2Pke_0c",
   authDomain: "flight-app-a6688.firebaseapp.com",
   databaseURL: "https://flight-app-a6688.firebaseio.com",
   projectId: "flight-app-a6688",
   storageBucket: "flight-app-a6688.appspot.com",
   messagingSenderId: "861898449579"
 };

 firebase.initializeApp(config);

 var database = firebase.database();

var driveTime;
var timeDrive;


function initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete(
          /** @type {!HTMLInputElement} */(document.getElementById("autocomplete")),
          {types: ["geocode"]});

        autocompleteAirport = new google.maps.places.Autocomplete((document.getElementById("autocompleteAirport")),{types: ["geocode"]});

        $('form').keypress(function(e) { 
          return e.keyCode != 13;
        });
      }

      function start() {
          

        var tsaPre = $('input[name = tsa]:checked').val();

        var address = $("#autocomplete").val()

        var addressAirport = $("#autocompleteAirport").val()

         if (address === "home") {         

            database.ref().on("child_added", function(childSnapshot, prevChildKey) {

             address = childSnapshot.val().Home;

            $("#fadeUp1").append(address);
            })
            };       


         database.ref().set({
          Home: address
        });




        console.log(address)

        console.log(addressAirport)

        var originalURL = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + address + "&destinations=" + addressAirport + "&key=AIzaSyDJ8bLvg2ZxQyBBFZaVSXZV7g5NJ_r3hGE"

        var distanceQueryURL = "https://cors-anywhere.herokuapp.com/" + originalURL

        $.ajax({
          url: distanceQueryURL,
          method: "GET",
          dataType: "json",
          headers: {
            "x-requested-with": "xhr"
          }
        }).done(function(response) {
			
		  //show and scroll to output
		  $("#panel-output").show();
		  $.scrollTo($('#panel-output'), 1000);
		  $(".pajaro").hide();

          timeDrive = (response.rows[0].elements[0].duration.text)

           driveTime = parseInt(timeDrive)

          console.log(driveTime)

          $("#timeResults").text("Drive Time: " + timeDrive)

          if (response.destination_addresses == "O'Hare International Airport (ORD), 10000 W O'Hare Ave, Chicago, IL 60666, USA") {
            var newAirport = "ORD"
          }

          if (response.destination_addresses == "Chicago Midway International Airport (MDW), 5700 S Cicero Ave, Chicago, IL 60638, USA") {
            var newAirport = "MDW"
          }

          $("#mapResults").html('<iframe src="https://www.google.com/maps/embed/v1/directions?origin=' + response.origin_addresses + '&destination=' + response.destination_addresses  + '&key=AIzaSyDOvWis17heiQrS87gQ9a6PSGmxCaxun5Q"></iframe>')

          if (newAirport === "ORD" && tsaPre === "No") {

           apLink = "https://apps.tsa.dhs.gov/MyTSAWebService/GetTSOWaitTimes.ashx?ap=ORD&output=json";

           airport();
         }    

         else if (newAirport === "ORD" && tsaPre ===  "Yes") {

           apLink = "https://apps.tsa.dhs.gov/MyTSAWebService/GetTSOWaitTimes.ashx?ap=ORD&output=json";

           tsaPRE();
         }

         else if (newAirport === "MDW" && tsaPre === "No") {

          apLink = "https://apps.tsa.dhs.gov/MyTSAWebService/GetTSOWaitTimes.ashx?ap=MDW&output=json";

          airport();
        }   


        else if (newAirport === "MDW" && tsaPre === "Yes") {

          apLink = "https://apps.tsa.dhs.gov/MyTSAWebService/GetTSOWaitTimes.ashx?ap=MDW&output=json";

          tsaPRE();

        }

        else {

        };
      });
    }

      function airport() {

       var originalURL = apLink;
       var queryURL = "https://cors-anywhere.herokuapp.com/" + originalURL

       $.ajax({
        url: queryURL,
        method: "GET",
        dataType: "json",
      // this headers section is necessary for CORS-anywhere
      headers: {
        "x-requested-with": "xhr" 
      }
    }).done(function(response) {
      console.log('CORS anywhere response', response);
      var waitTime = response.WaitTimes[0].WaitTime;


      var totalTSA;

      if (waitTime == 1) {
        totalTSA = 0;
      }

      else if (waitTime == 2) {
        totalTSA = 10;
      }

      else if (waitTime == 3) {
       totalTSA = 20;
     }
     else if (waitTime == 4){
       totalTSA = 30;
     }
     else if (waitTime == 5){
      totalTSA = 45;  
    }
    else if (waitTime == 6) {
      totalTSA = 60;
    }
    else if (waitTime == 7) {
      totalTSA = 90;
    }
    else if (waitTime == 8) {
      totalTSA = 120;
    }

    var totalTSATime = parseInt(totalTSA)

    var totalCalculatedTime = (totalTSATime + driveTime)

    console.log(totalCalculatedTime)

    console.log(driveTime)

    var tsaPer = (totalTSATime / totalCalculatedTime) * 100;
    $("#tsaProgress").css("width", tsaPer +  "%")
    var drivePer = (driveTime / totalCalculatedTime)  * 100;
    $("#driveProgress").css("width", drivePer + "%")

    $("#waitTime").html("Wait Time: " + totalTSA +  " mins");
    $("#totalTime").html("Total Time: " + totalCalculatedTime +  " mins");
  }).fail(function(jqXHR, textStatus) { 
    //console.error(textStatus)

  }); 

};

function tsaPRE() {

 var originalURL = apLink;
 var queryURL = "https://cors-anywhere.herokuapp.com/" + originalURL

 $.ajax({
  url: queryURL,
  method: "GET",
  dataType: "json",
      // this headers section is necessary for CORS-anywhere
      headers: {
        "x-requested-with": "xhr" 
      }
    }).done(function(response) {
            //console.log('CORS anywhere response for PRE', response);
            var waitTime = response.WaitTimes[3].WaitTime;

            var totalTSA;

            if (waitTime == 1) {
              totalTSA = 0;
            }
            else if (waitTime == 2) {
              totalTSA = 10;
            }

            else if (waitTime == 3) {
             totalTSA = 20;
           }
           else if (waitTime == 4){
             totalTSA = 30;
           }
           else if (waitTime == 5){
            totalTSA = 45;  
          }
          else if (waitTime == 6) {
            totalTSA = 60;
          }
          else if (waitTime == 7) {
            totalTSA = 90;
          }
          else if (waitTime == 8) {
            totalTSA = 120;
          }

          var totalTSATime = parseInt(totalTSA)

          var totalCalculatedTime = totalTSA + driveTime

          var tsaPer = (totalTSATime / totalCalculatedTime) * 100;
          var drivePer = (driveTime / totalCalculatedTime)  * 100;

          var tsaPer = (totalTSATime / totalCalculatedTime) * 100;
          $("#tsaProgress").css("width", tsaPer +  "%")
          var drivePer = (driveTime / totalCalculatedTime)  * 100;
          $("#driveProgress").css("width", drivePer + "%")

          $("#waitTime").html("Wait Time: " + totalTSA +  " mins");
          $("#totalTime").html("Total Time: " + totalCalculatedTime +  " mins");

        }).fail(function(jqXHR, textStatus) { 
            //console.error(textStatus)

          });          
      };

      $("#home").on("click", function(){
        event.preventDefault();

        database.ref().on("value", function(snapshot){
          console.log(snapshot.val().Home);

          $("#autocomplete").val(snapshot.val().Home);

        });

      });

      $("#run-search").on("click", function(){
		$(".pajaro").show();
        start();

      })



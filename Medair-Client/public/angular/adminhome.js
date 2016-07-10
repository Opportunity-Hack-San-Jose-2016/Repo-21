var app = angular.module('medairApp', []);
app.controller('adminCntrl', function($scope, $http){

	$scope.allVolunteersSection = true;
	$scope.mainDashboardSection = false;


	$scope.getAllRefugeesRequests = function() {
			$http({
				method : "POST",
				url : "/getAllRefugeesRequests"
			
			}).success(function(data) {
				$scope.newRequests = data.newRequests;
				$scope.inProgressRequests = data.inProgressRequests;
				$scope.completedRequested = data.completedRequested;
				$scope.locations = data.locations;
				
				var temp = [{lat: 33.93911, long: 67.709953, msg: "Hey I need help"},
				            {lat: -4.038333, long: 21.758664, msg: "Hey I need help"},
				            {lat: -1.831239, long: -78.183406, msg: "Hey I need help"},
				            {lat: -18.766947, long: 46.869107, msg: "Hey I need help"},
				            {lat: 33.223191, long: 43.679291, msg: "Hey I need help"},
				            {lat: 30.585164, long: 36.238414, msg: "Hey I need help"},
				            {lat: 33.854721, long: 35.862285, msg: "Hey I need help"},
				            {lat: 34.802075, long: 38.996815, msg: "Hey I need help"},
				            {lat: 28.394857, long: 84.124008, msg: "Hey I need help"},
				            {lat: 12.862807, long: 30.217636, msg: "Hey I need help"},
				            {lat: 5.152149, long: 46.199616, msg: "Hey I need help"}];
				
				//Google Maps
				var myCenter=new google.maps.LatLng(5.152149,46.199616);

		        function initialize()
		        {
		        var mapProp = {
		          center:myCenter,
		          zoom:3,
		          mapTypeId:google.maps.MapTypeId.ROADMAP
		          };

		        var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);

		        for(var i = 0; i < temp.length; i++){
		        	 var marker=new google.maps.Marker({
				          position:new google.maps.LatLng(temp[i].lat, temp[i].long),
				          });

				        marker.setMap(map);

				        var infowindow = new google.maps.InfoWindow({
				          content:"I need help!"
				          });

				        infowindow.open(map,marker);
				        }
		        }
		       

		        google.maps.event.addDomListener(window, 'load', initialize);
				
				
				
			}).error(function(error) {
				$scope.message = "Some error occurred!";
			});
	};

	$scope.getAllVolunteers = function(){
		$http({
			method : "POST",
			url : "/getAllVolunteers"

		}).success(function(data) {
			$scope.allVolunteers = data.result;
			$scope.allVolunteersSection = false;
			$scope.mainDashboardSection = true;

		}).error(function(error) {
			$scope.message = "Some error occurred!";
		});
	};
});

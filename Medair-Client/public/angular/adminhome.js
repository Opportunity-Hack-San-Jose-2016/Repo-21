var app = angular.module('medairApp', []);
app.controller('adminCntrl', function($scope, $http){
	$scope.getAllRefugeesRequests = function() {
			$http({
				method : "POST",
				url : "/getAllRefugeesRequests"
			
			}).success(function(data) {
				$scope.newRequests = data.newRequests;
				$scope.inProgressRequests = data.inProgressRequests;
				$scope.completedRequested = data.completedRequested;
				$scope.locations = data.locations;
				
				
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

		        var marker=new google.maps.Marker({
		          position:myCenter,
		          });

		        marker.setMap(map);

		        var infowindow = new google.maps.InfoWindow({
		          content:"I need help!"
		          });

		        infowindow.open(map,marker);
		        }

		        google.maps.event.addDomListener(window, 'load', initialize);
				
				
				
			}).error(function(error) {
				$scope.message = "Some error occurred!";
			});
	};
});

var app = angular.module('votingApp', []);
var socket = io.connect();

var bg1 = document.getElementById('background-stats-1');
var bg2 = document.getElementById('background-stats-2');

app.controller('statsCtrl', function($scope){
  // Initialize percentage values for multiple voting pairs
  $scope.catsPercent = 50;
  $scope.dogsPercent = 50;
  $scope.mountainsPercent = 50;
  $scope.beachesPercent = 50;
  // Initialize total votes
  $scope.totalVotes = 0;

  var updateScores = function(){
    socket.on('scores', function (json) {
       data = JSON.parse(json);
       var cats = parseInt(data.cats || 0);
       var dogs = parseInt(data.dogs || 0);
       var mountains = parseInt(data.mountains || 0);
       var beaches = parseInt(data.beaches || 0);

       // Get percentages for each pair
       var catDogPercentages = getPercentages(cats, dogs);
       var mountainBeachPercentages = getPercentages(mountains, beaches);

       // Update background widths for visual representation
       bg1.style.width = catDogPercentages.a + "%"; // For Cats
       bg2.style.width = catDogPercentages.b + "%"; // For Dogs

       // Update the scope variables
       $scope.$apply(function () {
         $scope.catsPercent = catDogPercentages.a;
         $scope.dogsPercent = catDogPercentages.b;
         $scope.mountainsPercent = mountainBeachPercentages.a;
         $scope.beachesPercent = mountainBeachPercentages.b;
         // Total votes for all pairs
         $scope.totalVotes = cats + dogs + mountains + beaches;
       });
    });
  };

  var init = function(){
    document.body.style.opacity = 1;
    updateScores();
  };

  socket.on('message', function(data){
    init();
  });
});

// Function to calculate percentages
function getPercentages(a, b) {
  var result = {};

  if (a + b > 0) {
    result.a = Math.round(a / (a + b) * 100);
    result.b = 100 - result.a;
  } else {
    result.a = result.b = 50;
  }

  return result;
}

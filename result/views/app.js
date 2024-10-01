var app = angular.module('catsvsdogs', []);
var socket = io.connect();

// Getting elements for Cats vs Dogs
var bg1 = document.getElementById('background-stats-1');
var bg2 = document.getElementById('background-stats-2');

// Getting elements for Mountains vs Beaches
var bg3 = document.getElementById('background-stats-3');
var bg4 = document.getElementById('background-stats-4');

app.controller('statsCtrl', function ($scope) {
  // Initialize percentage values
  $scope.aPercent = 50; // Cats
  $scope.bPercent = 50; // Dogs
  $scope.cPercent = 50; // Mountains
  $scope.dPercent = 50; // Beaches

  var updateScores = function () {
    socket.on('scores', function (json) {
      data = JSON.parse(json);

      // Votes for Cats vs Dogs
      var a = parseInt(data.a || 0); // Cats
      var b = parseInt(data.b || 0); // Dogs

      // Votes for Mountains vs Beaches
      var c = parseInt(data.c || 0); // Mountains
      var d = parseInt(data.d || 0); // Beaches

      // Calculate percentages for Cats vs Dogs
      var percentagesCD = getPercentages(a, b);
      bg1.style.width = percentagesCD.a + "%";
      bg2.style.width = percentagesCD.b + "%";

      // Calculate percentages for Mountains vs Beaches
      var percentagesMB = getPercentages(c, d);
      bg3.style.width = percentagesMB.a + "%";
      bg4.style.width = percentagesMB.b + "%";

      // Apply updated values to the scope
      $scope.$apply(function () {
        // Cats vs Dogs
        $scope.aPercent = percentagesCD.a;
        $scope.bPercent = percentagesCD.b;
        $scope.totalCatsDogs = a + b;

        // Mountains vs Beaches
        $scope.cPercent = percentagesMB.a;
        $scope.dPercent = percentagesMB.b;
        $scope.totalMountainsBeaches = c + d;
      });
    });
  };

  var init = function () {
    document.body.style.opacity = 1;
    updateScores();
  };

  socket.on('message', function (data) {
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

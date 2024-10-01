var app = angular.module('votesApp', []);
var socket = io.connect();

app.controller('resultsCtrl', function($scope) {
  $scope.votingPairs = [];  // Array to hold multiple voting pairs

  var updateScores = function() {
    socket.on('scores', function(json) {
      var data = JSON.parse(json);
      // Sample data structure to keep track of multiple voting pairs
      // You can modify this based on your backend response format
      $scope.votingPairs = [
        {
          optionA: "Beaches",
          optionB: "Mountains",
          votesA: parseInt(data.beaches || 0),
          votesB: parseInt(data.mountains || 0),
        },
        {
          optionA: "Fiction",
          optionB: "Non-Fiction",
          votesA: parseInt(data.fiction || 0),
          votesB: parseInt(data.nonFiction || 0),
        }
        // Add more pairs as needed
      ];

      // Calculate percentages and total votes for each pair
      $scope.votingPairs.forEach(function(pair) {
        var totalVotes = pair.votesA + pair.votesB;
        pair.total = totalVotes;
        pair.percentA = totalVotes > 0 ? Math.round(pair.votesA / totalVotes * 100) : 50;
        pair.percentB = totalVotes > 0 ? Math.round(pair.votesB / totalVotes * 100) : 50;
      });
      
      $scope.$apply();  // Update the scope
    });
  };

  var init = function() {
    document.body.style.opacity = 1;
    updateScores();
  };
  
  socket.on('message', function(data) {
    init();
  });
});

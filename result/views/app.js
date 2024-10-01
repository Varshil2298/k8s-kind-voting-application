// app.js
var app = angular.module('votesApp', []);

// Controller for handling voting results
app.controller('resultsCtrl', ['$scope', function($scope) {
    // Example voting data - replace this with your actual voting data
    $scope.votingPairs = [
        {
            optionA: 'CATS',
            optionB: 'DOGS',
            percentA: 50.0, // Percentage of votes for option A
            percentB: 50.0, // Percentage of votes for option B
            total: 0 // Total votes for this pair
        },
        {
            optionA: 'BEACHES',
            optionB: 'MOUNTAINS',
            percentA: 70.0, // Percentage of votes for option A
            percentB: 30.0, // Percentage of votes for option B
            total: 10 // Total votes for this pair
        },
        {
            optionA: 'FICTION',
            optionB: 'NON-FICTION',
            percentA: 40.0,
            percentB: 60.0,
            total: 5
        },
        // Add more pairs as needed
    ];

    // Optionally, you can fetch voting data from a server using $http or WebSocket
    // For example, to get voting results from a server:
    /*
    $http.get('/api/voting-results').then(function(response) {
        $scope.votingPairs = response.data;
    });
    */
}]);

// app.js
angular.module('catsvsdogs', [])
.controller('statsCtrl', ['$scope', function($scope) {
    // Example data structure for votes
    $scope.votingPairs = [
        {
            optionA: 'CATS',
            optionB: 'DOGS',
            total: 100,
            votesA: 50,
            votesB: 50
        },
        {
            optionA: 'BEACHES',
            optionB: 'MOUNTAINS',
            total: 100,
            votesA: 70,
            votesB: 30
        },
        {
            optionA: 'FICTION',
            optionB: 'NON-FICTION',
            total: 100,
            votesA: 40,
            votesB: 60
        }
    ];

    // Function to calculate percentages
    $scope.calculatePercentages = function(pair) {
        pair.aPercent = (pair.votesA / pair.total) * 100 || 0;
        pair.bPercent = (pair.votesB / pair.total) * 100 || 0;
    };

    // Loop through each voting pair to calculate percentages
    $scope.votingPairs.forEach(function(pair) {
        $scope.calculatePercentages(pair);
    });

    // Calculate total votes across all pairs
    $scope.total = $scope.votingPairs.reduce((acc, pair) => acc + pair.total, 0);
    
    // Assigning values for Cats vs. Dogs specifically for the result section
    const catsDogsPair = $scope.votingPairs[0];
    $scope.aPercent = (catsDogsPair.votesA / catsDogsPair.total) * 100 || 0;
    $scope.bPercent = (catsDogsPair.votesB / catsDogsPair.total) * 100 || 0;
}]);

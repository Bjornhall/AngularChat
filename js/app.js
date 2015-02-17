var app = angular.module("AngChat", []);

angular.module("AngChat").controller("HomeController",
    function($scope){
        $scope.message = "Hello World";
});
angular.module('AngChat').controller('LoginController',
    ['$scope', '$location', '$rootScope', '$routeParams', 'socket',
    function($scope, $location, $rootScope, $routeParams, socket) {

    $rootScope.showRoomList = false;
    $rootScope.inRoom = false;
    $scope.errorMessage = '';
    $scope.nickname = '';

        $scope.login = function() {
            if($scope.nickname === '') {
                $scope.errorMessage = 'Please choose a nickname!';
            } else {
                socket.emit ('adduser', $scope.nickname, function(available) {
                    if(available){
                        $location.path('/rooms/' + $scope.nickname);
                        $rootScope.showRoomList = true;
                    } else {
                        $scope.errorMessage = 'This nick is taken!';
                    }
            });
        }
    };
}]);
var AngChatClient = angular.module('AngChat', ['ngRoute']);

AngChatClient.config(
    function($routeProvider) {
        $routeProvider
            .when('/login', {templateUrl: 'Views/login.html', controller: 'LoginController'})
            .when('/rooms/:user/', { templateUrl: 'Views/rooms.html', controller: 'RoomsController' })
            .when('/room/:user/:room/', { templateUrl: 'Views/room.html', controller: 'RoomController' })
            .otherwise({
                redirectTo: '/login'
            });
    }
);

angular.module('AngChat').controller('LoginController',
    ['$scope', '$location', '$rootScope', '$routeParams', 'socket',
    function($scope, $location, $rootScope, $routeParams, socket) {

    $scope.errorMessage = '';
    $scope.nickname = '';

        $scope.login = function() {
            if($scope.nickname === '') {
                $scope.errorMessage = 'Please choose a nickname!';
            } else {
                socket.emit ('adduser', $scope.nickname, function(available) {
                    if(available){
                        $location.path('/rooms/' + $scope.nickname);
                    } else {
                        $scope.errorMessage = 'This nick is taken!';
                    }
            });
        }
    };
}]);

angular.module('AngChat').controller('RoomsController',
    function($scope, $location, $rootScope, $routeParams, socket){
            $scope.rooms = ['Default Room'];
            $scope.currentUser = $routeParams.user;
    }
);

angular.module('AngChat').controller('RoomController',

    function($scope, $location, $rootScope, $routeParams, socket){
        $scope.currentRoom = $routeParams.room;
        $scope.currentUser = $routeParams.user;
        $scope.currentUsers = [];
        $scope.errorMessage = '';

        socket.on('updateusers', function (roomName, users, ops) {
            // TODO: Check if the roomName equals the current room !
            $scope.currentUsers = users;
        });

        socket.emit('joinroom', $scope.currentRoom, function (success, reason) {
            if (!success)
            {
                $scope.errorMessage = reason;
            }
        });
    }
);
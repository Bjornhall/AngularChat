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

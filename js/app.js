var AngChatClient = angular.module('AngChat', ['ngRoute']);

AngChatClient.config(
    function($routeProvider) {
        $routeProvider
            .when('/login', {templateUrl: 'views/login.html', controller: 'LoginController'})
            .when('/rooms/:user/', { templateUrl: 'views/rooms.html', controller: 'RoomsController' })
            .when('/room/:user/:room/', { templateUrl: 'views/room.html', controller: 'RoomController' })
            .otherwise({
                redirectTo: '/login'
            });
    }
);

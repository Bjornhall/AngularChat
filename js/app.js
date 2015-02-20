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

    $rootScope.showRoomList = false;
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

angular.module('AngChat').controller('RoomsController',
    function($scope, $location, $rootScope, $routeParams, socket) {
            $scope.currentUser = $routeParams.user;
            $scope.rooms = [];

            socket.emit('rooms');
            socket.on('roomlist', function(roomlist) {

                for(var room in roomlist) {

                    if ($scope.rooms.length === 0) {
                        $scope.rooms.push(room);
                    } else if ($scope.rooms.length > 0) {
                        for(var i = 0; i < $scope.rooms.length; i += 1) {
                            if($scope.rooms[i] !== room && undefined !== room) {
                                //console.log('if (' + $scope.rooms[i] + ' !== ' + room + ')');
                                $scope.rooms.push(room);
                            }
                        }
                    }
                }
                
                //$scope.rooms = result;
                //$scope.rooms = tempRooms;
                //console.log(tempRooms);
                console.log($scope.rooms);
            });

            $scope.joinroom = function(roomName) {

                if(roomName === undefined) {
                    // creating new room...
                    //$scope.rooms
                } else {
                    socket.emit('joinroom', roomName, function(allowed, reason) {
                        if(allowed) {
                            $location.path('/room/' + $routeParams.user + '/' + roomName);
                        } else {
                            $scope.errorMessage = 'error message'; // TODO: error message
                        }
                    });
                }
            }
    }
);

angular.module('AngChat').controller('RoomController',

    function($scope, $location, $rootScope, $routeParams, socket){
        $scope.currentRoom = $routeParams.room;
        $scope.currentUser = $routeParams.user;
        $scope.currentUsers = [];
        $scope.errorMessage = '';
        $scope.messages = [];
        $scope.message = '';

        socket.on('updateusers', function (roomName, users, ops) {
            console.log(users);
            // TODO: Check if the roomName equals the current room !
            $scope.currentUsers = users;
        });

        socket.on('updatechat', function(roomName, messages) {
            
            //console.log(roomName);
            console.log(messages);
            //console.log(roomName);
            //console.log(messages);
        });

        $scope.sendmsg = function() {

            var sendmessage = {roomName: $scope.currentRoom, msg: $scope.message};
            socket.emit('sendmsg', sendmessage);
        }

        /*socket.emit('joinroom', $scope.currentRoom, function (success, reason) {
            console.log("joinroom");
            if (!success)
            {
                $scope.errorMessage = reason;
            }
        });*/
    }
);


angular.module('AngChat').controller('RoomsController',
    function($scope, $location, $rootScope, $routeParams, socket) {
            $rootScope.showRoomList = true;
            $scope.currentUser = $routeParams.user;
            $scope.rooms = [];

            socket.emit('rooms');
            socket.on('roomlist', function(roomlist) {
                console.log(roomlist);
                for(var room in roomlist) {

                    if ($scope.rooms.length === 0 && undefined !== room) {

                        $scope.rooms.push(room);

                    } else if ($scope.rooms.length > 0) {

                        for(var i = 0; i < $scope.rooms.length; i += 1) {

                            if($scope.rooms[i] !== room && undefined !== room) {

                                $scope.rooms.push(room);
                            }
                        }
                    }
                }
                
            });

            $scope.joinroom = function(roomName) {

                if(roomName === undefined) {



                    // creating new room...
                } else {
                    socket.emit('joinroom', {room: roomName}, function(allowed, reason) {
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
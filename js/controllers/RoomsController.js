angular.module('AngChat').controller('RoomsController',
    function($scope, $location, $rootScope, $routeParams, socket) {
            $rootScope.showRoomList = true;
            $scope.roomName = '';
            $scope.currentUser = $routeParams.user;
            //$scope.room = $routeParams.room;
            $scope.rooms = [];

            socket.emit('rooms');
            socket.on('roomlist', function(roomlist) {
                for(var room in roomlist) {

                    if(!exists(room)) {
                        $scope.rooms.push(room);
                    }
                }
            });

            exists = function(roomName) {
                for(var i = 0; i < $scope.rooms.length; i++) {
                    if($scope.rooms[i] === roomName) {
                        return true;
                    }
                }

                return false;
            }

            $scope.createRoom = function() {
                $location.path('/room/' + $scope.currentUser + '/' + $scope.roomName);
            }

/*            $scope.joinRoom = function(roomName) {

                if(roomName === undefined) {

                    // TODO: þarf þetta ?
                } else {
                    socket.emit('joinroom', {room: roomName}, function(allowed, reason) {
                        if(allowed) {
                            $rootScope.inRoom = true;
                            $location.path('/room/' + $routeParams.user + '/' + roomName);
                        } else {
                            $scope.errorMessage = 'error message'; // TODO: error message
                        }
                    });
                }
            }

            $scope.partRoom = function() {
                $rootScope.inRoom = false;
                socket.emit('partroom', $routeParams.room);
                $location.path('/rooms/' + $routeParams.user);
            }*/
    }
);
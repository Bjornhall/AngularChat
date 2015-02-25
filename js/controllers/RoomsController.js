angular.module('AngChat').controller('RoomsController',
    function($scope, $location, $rootScope, $routeParams, socket) {
            $rootScope.showRoomList = true;
            $rootScope.isPassword = false;
            $rootScope.roomPassword = '';
            $scope.roomName = '';
            $scope.currentUser = $routeParams.user;
            //$scope.room = $routeParams.room;
            $scope.rooms = [];
            $scope.errorMessage = '';
            $scope.askPassword = false;
            $scope.password = '';
            $scope.accessRoom = '';

            socket.emit('rooms');
            socket.on('roomlist', function(roomlist) {
                for(var room in roomlist) {

                    if(!exists(room)) {
                        $scope.rooms.push(room);
                    }
                }

                console.log($scope.rooms);
            });

            $scope.joinRoom = function (roomName, roomPassword) {
                $rootScope.roomPassword = roomPassword;
                
                socket.emit('joinroom', { room: roomName, pass: roomPassword, insideRoom: false }, function (success, reason) {
                    if (success) {
                        $isPassword = false;
                        $location.path('/room/' + $scope.currentUser + '/' + roomName);
                    } else {
                        console.log(reason);
                        if (reason === 'banned') {
                            $scope.errorMessage = "You've been banned from " + roomName;
                        } else if (reason === 'wrong password') {
                            $scope.isPassword = true;
                            $scope.accessRoom = roomName;
                            //alert('room is locked with a password');
                        }
                    }
                });
            };

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
    }
);
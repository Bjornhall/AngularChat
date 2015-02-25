angular.module('AngChat').controller('RoomsController',
    ['$scope', '$location', '$rootScope', '$routeParams', 'socket',
    function($scope, $location, $rootScope, $routeParams, socket) {
            $rootScope.showRoomList = true;
            $rootScope.isPassword = false;
            $rootScope.roomPassword = '';
            $scope.roomName = '';
            $scope.currentUser = $routeParams.user;
            //$scope.room = $routeParams.room;
            $scope.rooms = [];
            $scope.errorMessage = '';
            //$scope.askPassword = false;
            //$scope.password = '';
            $scope.accessRoom = '';

            socket.emit('rooms');
            socket.on('roomlist', function(roomlist) {
                for(var room in roomlist) {

                    if(!exists(room)) {
                        $scope.rooms.push(room);
                    }
                }
            });

            $scope.joinRoom = function (roomName, roomPassword) {
                var roomObj = {
                    room: roomName,
                    insideRoom: false
                };

                if ($rootScope.isPassword) {
                    roomObj.pass = roomPassword;
                    $rootScope.roomPassword = roomPassword;
                }

                console.log(roomObj);
                console.log($rootScope.isPassword);

                socket.emit('joinroom', roomObj, function (success, reason) {
                    if (success) {
                        $scope.isPassword = false;
                        $location.path('/room/' + $scope.currentUser + '/' + roomName);
                    } else {
                        console.log(reason);
                        if (reason === 'banned') {
                            $scope.errorMessage = "You've been banned from " + roomName;
                        } else if (reason === 'wrong password') {
                            $rootScope.isPassword = true;
                            $scope.accessRoom = roomName;
                            //alert('room is locked with a password');
                        }
                    }
                });
            };

            function exists (roomName) {
                for(var i = 0; i < $scope.rooms.length; i++) {
                    if($scope.rooms[i] === roomName) {
                        return true;
                    }
                }

                return false;
            }

            $scope.createRoom = function() {
                $location.path('/room/' + $scope.currentUser + '/' + $scope.roomName);
            };
}]);
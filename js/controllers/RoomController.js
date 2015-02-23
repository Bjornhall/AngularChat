angular.module('AngChat').controller('RoomController',

    function($scope, $location, $rootScope, $routeParams, socket){
        $scope.currentRoom = $routeParams.room;
        $scope.currentUser = $routeParams.user;
        $scope.currentUsers = [];
        $scope.currentOps = [];
        $scope.errorMessage = '';
        $scope.messages = [];
        $scope.message = '';
        $scope.isOp = false;

        socket.emit('joinroom', { room: $scope.currentRoom }, function (success, reason) {
            if (!success)
            {
                $scope.errorMessage = reason;
            } else {
                $rootScope.inRoom = true;
            }
        });

        socket.on('updateusers', function (roomName, users, ops) {
            // TODO: Check if the roomName equals the current room !
            if(roomName === $scope.currentRoom) {
                $scope.currentUsers = users;
                $scope.currentOps = ops;
            }

            console.log($scope.currentUsers);
            console.log($scope.currentOps);
        });

        socket.on('updatechat', function(roomName, messages) {
            if(roomName === $scope.currentRoom) {
                $scope.messages = messages;
            }
        });

        $scope.sendmsg = function() {
            var sendmessage = {roomName: $scope.currentRoom, msg: $scope.message};
            socket.emit('sendmsg', sendmessage);
            $scope.message = '';
        }

        $scope.partroom = function() {
                $rootScope.inRoom = false; // TODO: þarf ekki...

                if(hasop($scope.currentUser) && $scope.currentUsers.length > 0) {
                    $scope.currentOps.push($scope.currentUsers.shift());
                    $scope.isOp = false;
                }

                socket.emit('partroom', $routeParams.room);
                $location.path('/rooms/' + $routeParams.user);
        }

        hasop = function(username) {
            for(var i = 0; i < $scope.currentOps.length; i++) {
                if($scope.currentOps[i] === username) {
                    return true;
                }
            }

            return false;
        }
    }
);
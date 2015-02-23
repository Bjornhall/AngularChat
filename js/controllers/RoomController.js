angular.module('AngChat').controller('RoomController',

    function($scope, $location, $rootScope, $routeParams, socket){
        $scope.currentRoom = $routeParams.room;
        $scope.currentUser = $routeParams.user;
        $scope.currentUsers = [];
        $scope.errorMessage = '';
        $scope.messages = [];
        $scope.message = '';

        socket.emit('joinroom', { room: $scope.currentRoom }, function (success, reason) {
            console.log("joinroom");
            if (!success)
            {
                $scope.errorMessage = reason;
            } else {
                $rootScope.inRoom = true;
            }
        });

        socket.on('updateusers', function (roomName, users, ops) {
            // TODO: Check if the roomName equals the current room !
            $scope.currentUsers = users;
        });

        socket.on('updatechat', function(roomName, messages) {

            $scope.messages = messages;
        });

        $scope.sendmsg = function() {
            var sendmessage = {roomName: $scope.currentRoom, msg: $scope.message};
            socket.emit('sendmsg', sendmessage);
            $scope.message = '';
        }

        $scope.partroom = function() {
                $rootScope.inRoom = false;
                socket.emit('partroom', $routeParams.room);
                $location.path('/rooms/' + $routeParams.user);
        }
    }
);
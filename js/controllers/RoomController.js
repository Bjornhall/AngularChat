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
            console.log('updatechat');
            console.log(roomName);
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
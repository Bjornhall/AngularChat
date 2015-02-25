angular.module('AngChat').controller('RoomController',
    ['$scope', '$location', '$rootScope', '$routeParams', 'socket',
    function($scope, $location, $rootScope, $routeParams, socket){
        $scope.currentRoom = $routeParams.room;
        $scope.currentUser = $routeParams.user;
        $scope.currentUsers = [];
        $scope.currentOps = [];
        $scope.errorMessage = '';
        $scope.messages = [];
        $scope.message = '';
        $scope.isOp = false;
        $scope.showP = false;
        $scope.pMessage = '';
        $scope.pMessages = [];
        $scope.pUser = '';
        $scope.pw1 = '';
        $scope.pw2 = '';
        var isOpen = false;

        $rootScope.inRoom = true;

        var roomObj = {
            room: $scope.currentRoom,
            insideRoom: true
        };

        if ($rootScope.isPassword) {
            roomObj.pass = $rootScope.roomPassword;
        }

        socket.emit('joinroom', roomObj, function (success, reason) {
            if (!success) {
                console.log(reason);
                // TODO: anything?
            } else {
                $rootScope.roomPassword = '';
                $rootScope.isPassword = false;
                $rootScope.inRoom = true;
            }
        });

        socket.on('updateusers', function (roomName, users, ops) {
            // TODO: Check if the roomName equals the current room !
            if(roomName === $scope.currentRoom) {
                $scope.currentUsers = users;
                $scope.currentOps = ops;

                if($scope.currentOps[$scope.currentUser] !== undefined) {
                    $scope.isOp = true;
                }
            }

            console.log($scope.currentUsers);
            console.log($scope.currentOps);
        });

        socket.on('updatechat', function (roomName, messages) {
            if(roomName === $scope.currentRoom) {
                $scope.messages = messages;
            }
        });

        socket.on('kicked', function (roomName, kickedUser, kickingUser) {
            if($scope.currentUser === kickedUser && $scope.currentRoom === roomName) {

                // TODO: henda upp einhverju pop-up og segja að honum hafi verið sparkað..?
                $rootScope.inRoom = false;
                $location.path('/rooms/' + $scope.currentUser);
            }
        });

        socket.on('banned', function (roomName, bannedUser, banningUser) {
            if ($scope.currentUser === bannedUser && $scope.currentRoom === roomName) {

                // TODO: henda upp einhverju pop-up og segja að hann hafi verið bannaður..?
                $rootScope.inRoom = false;
                $location.path('/rooms/' + $scope.currentUser);
            }
        });

        socket.on('opped', function (roomName, oppedUser, oppingUser) {
            if ($scope.currentUser === oppedUser && $scope.currentRoom === roomName) {
                $scope.isOp = true;
            }
            // TODO: do stuff...
        });

        socket.on('deopped', function (roomName, deoppedUser, deoppingUser) {
            if ($scope.currentUser === deoppedUser && $scope.currentRoom === roomName) {
                $scope.isOp = false;
            }
            // TODO: do stuff...
        });

        $scope.sendmsg = function () {
            //var sendmessage = {roomName: $scope.currentRoom, msg: $scope.message};
            socket.emit('sendmsg', {roomName: $scope.currentRoom, msg: $scope.message} /*sendmessage*/);
            $scope.message = '';
        };


        $scope.showPmessage = function (user) {
            console.log("Shown the Private shizzle" + " --> " + user);
            if (!isOpen) {
                toggleSidebar();
                isOpen = true;
            }
            $scope.pUser = user;
            $scope.showP = true;
            console.log("Another log: " + $scope.pUser);
        };

        $scope.sendPrivateMessage = function () {
            var sendMessageP = {nick: $scope.pUser, message: $scope.pMessage};
            console.log("this is the private message :" + sendMessageP.nick + " and " + sendMessageP.message);

            $scope.pMessages.push(sendMessageP);

            socket.emit('privatemsg', sendMessageP);
            $scope.pMessage = '';
        };

        socket.on('recv_privatemsg', function (nick, message) {
            var pMessage = {from: nick, to: $scope.currentUser, msg: message};
            $scope.pMessages.push(pMessage);
            //alert(message);
            console.log("This is the private message from server: " + pMessage);

            if (!isOpen) {
                toggleSidebar();
                isOpen = true;
            }
        });

        $scope.closePrivateMsgSidebar = function () {
            toggleSidebar();
            isOpen = false;
        };

        $scope.partroom = function () {
            $rootScope.inRoom = false;

            if($scope.currentOps[$scope.currentUser] !== undefined && Object.keys($scope.currentOps).length === 1) {

                for(var first in $scope.currentUsers) {

                    socket.emit('op', {user: $scope.currentUsers[first], room: $scope.currentRoom}, function(success) {
                        if(success) {
                            // TODO: ??
                        }
                    });

                    break;
                }

                $scope.isOp = false;
            }

            socket.emit('partroom', $routeParams.room);
            $location.path('/rooms/' + $scope.currentUser);
        };

        $scope.kick = function (kickUser) {
            socket.emit('kick', {user: kickUser, room: $scope.currentRoom}, function (success) {
                if(success) {
                    // TODO: höndla success
                } else {
                    // TODO: höndla!!!
                }
            });
        };

        $scope.ban = function (banUser) {
            socket.emit('ban', {user: banUser, room: $scope.currentRoom}, function (success) {
                if(success) {
                    // TODO: höndla success.. pop-up jafnvel: "þú bannaðir þennan aumingja.."
                } else {
                    // TODO: höndla!!!
                }
            });
        };

        $scope.op = function (opUser) {
            socket.emit('op', {user: opUser, room: $scope.currentRoom}, function (success) {
                if (success) {
                    // TODO: höndla?
                } else {
                    // TODO: höndla!!!
                }
            });
        };

        $scope.deop = function (deopUser) {
            socket.emit('deop', {user: deopUser, room: $scope.currentRoom}, function (success) {
                if (success) {
                    // TODO: höndla?
                } else {
                    // TODO: höndla!!!
                }
            });
        };

        $scope.pw = function () {
            // if user is op && pw1 === pw2 && length > 6
            if ($scope.currentOps[$scope.currentUser] !== undefined && $scope.pw1 === $scope.pw2 && $scope.pw1.length >= 6) {
                socket.emit('setpassword', {room: $scope.currentRoom, password: $scope.pw1}, function (success) {
                    if (success) {
                        $rootScope.isPassword = true;
                        // TODO: eitthvað..
                    } else {
                        $scope.errorMessage = 'Oops.. something went wrong. Not able to set password.';
                        // TODO: eitthvað....
                    }
                });
            }
        };

        $scope.rmpw = function () {
            if ($scope.currentOps[$scope.currentUser] !== undefined) {
                socket.emit('removepassword', {room: $scope.currentRoom}, function (success) {
                    if (success) {
                        $rootScope.isPassword = false;
                        // TODO:...
                    } else {
                        $scope.errorMessage = 'Dang it! Looks like we still have a password!';
                        // TODO:...
                    }
                });
            }
        };

        var toggleSidebar = function () {

            var special = ['reveal', 'top', 'boring', 'perspective', 'extra-pop'];

            console.log("clicked on user Sidebar Demo");
            var transitionClass = 'linear';

            if ($.inArray(transitionClass, special) > -1) {
                $('body').removeClass();
                $('body').addClass(transitionClass);
            } else {
                $('body').removeClass();
                $('#site-canvas').removeClass();
                $('#site-canvas').addClass(transitionClass);
            }

            $('#site-wrapper').toggleClass('show-nav');

            return false;
        };
}]);

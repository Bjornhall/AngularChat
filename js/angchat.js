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


angular.module('AngChat').controller('LoginController',
    ['$scope', '$location', '$rootScope', '$routeParams', 'socket',
    function ($scope, $location, $rootScope, $routeParams, socket) {

    $rootScope.showRoomList = false;
    $rootScope.inRoom = false;
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
                        $scope.errorMessage = 'Unfortunately this nick is taken!. Please choose another nickname';
                    }
            });
        }
    };
}]);

angular.module('AngChat').controller('RoomController',
    ['$scope', '$location', '$rootScope', '$routeParams', 'socket',
    function ($scope, $location, $rootScope, $routeParams, socket){
        $scope.currentRoom = $routeParams.room;
        $scope.currentUser = $routeParams.user;
        $scope.currentUsers = [];
        $scope.currentOps = [];
        $scope.errorMessage = '';
        $scope.successMessage = '';
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
                // Do stuff
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
        });

        socket.on('updatechat', function (roomName, messages) {
            if(roomName === $scope.currentRoom) {
                $scope.messages = messages;
            }
        });

        socket.on('kicked', function (roomName, kickedUser, kickingUser) {
            if($scope.currentUser === kickedUser && $scope.currentRoom === roomName) {

                $rootScope.roomErrorMessage = 'You got kicked!';
                $rootScope.roomErrorMessage = 'You got banned from that room!';
                $rootScope.inRoom = false;
                $location.path('/rooms/' + $scope.currentUser);
            }
        });

        socket.on('banned', function (roomName, bannedUser, banningUser) {
            if ($scope.currentUser === bannedUser && $scope.currentRoom === roomName) {
                $rootScope.roomErrorMessage = 'You got banned from that room!';
                setTimeout(function(){ $rootScope.roomErrorMessage = ''; }, 3000);
                $rootScope.inRoom = false;
                $location.path('/rooms/' + $scope.currentUser);
            }
        });

        socket.on('opped', function (roomName, oppedUser, oppingUser) {
            if ($scope.currentUser === oppedUser && $scope.currentRoom === roomName) {
                $scope.isOp = true;
                $scope.successMessage = 'You got opped by ' + oppingUser;
                setTimeout(function(){ $scope.successMessage = ''; }, 3000);
            } else {
                //$scope.errorMessage = oppingUser + ' tried to make you op but something failed!';
                setTimeout(function(){ $scope.errorMessage = ''; }, 3000);
            }
        });

        socket.on('deopped', function (roomName, deoppedUser, deoppingUser) {
            if ($scope.currentUser === deoppedUser && $scope.currentRoom === roomName) {
                $scope.isOp = false;
                $scope.errorMessage = deoppingUser + ' took away your op rights!';
                setTimeout(function(){ $scope.errorMessage = ''; }, 3000);
            } else {
                //$scope.errorMessage = deoppingUser + ' tried to take away your op rights but failed!';
                setTimeout(function(){ $scope.errorMessage = ''; }, 3000);
            }
        });

        $scope.sendmsg = function () {
            socket.emit('sendmsg', {roomName: $scope.currentRoom, msg: $scope.message});
            $scope.message = '';
        };


        $scope.showPmessage = function (user) {
            if (!isOpen) {
                toggleSidebar();
                isOpen = true;
            }
            $scope.pUser = user;
            $scope.showP = true;
        };

        $scope.sendPrivateMessage = function () {
            var sendMessageP = {nick: $scope.pUser, message: $scope.pMessage};
            socket.emit('privatemsg', sendMessageP);
            $scope.pMessage = '';
        };

        socket.on('recv_privatemsg', function (nick, message) {
            var pMessage = {from: nick, to: $scope.currentUser, msg: message};
            $scope.pMessages.push(pMessage);
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
                    $scope.successMessage = 'You just kicked ' + kickUser + ' out of this room!';
                    setTimeout(function(){ $scope.successMessage = ''; }, 3000);
                } else {
                    $scope.errorMessage = 'For some reason you were not able to kick ' + kickUser + ' out!';
                    setTimeout(function(){ $scope.errorMessage = ''; }, 3000);
                }
            });
        };

        $scope.ban = function (banUser) {
            socket.emit('ban', {user: banUser, room: $scope.currentRoom}, function (success) {
                if(success) {
                    $scope.successMessage = 'You just banned ' + banUser + ' from this room!';
                    setTimeout(function(){ $scope.successMessage = ''; }, 3000);
                } else {
                    $scope.errorMessage = 'For some reason you were not able to ban ' + banUser + ' from this room!';
                    setTimeout(function(){ $scope.errorMessage = ''; }, 3000);
                }
            });
        };

        $scope.op = function (opUser) {
            socket.emit('op', {user: opUser, room: $scope.currentRoom}, function (success) {
                if (success) {
                    $scope.successMessage = 'You just opped ' + opUser;
                    setTimeout(function(){ $scope.successMessage = ''; }, 3000);
                } else {
                    $scope.errorMessage = 'For some reason you could not give op to ' + opUser;
                    setTimeout(function(){ $scope.errorMessage = ''; }, 3000);
                }
            });
        };

        $scope.deop = function (deopUser) {
            if ($scope.currentUser !== deopUser) {
                socket.emit('deop', {user: deopUser, room: $scope.currentRoom}, function (success) {
                    if (success) {
                        $scope.successMessage = 'You just de-opped ' + deopUser;
                        setTimeout(function(){ $scope.successMessage = ''; }, 3000);
                    } else {
                        $scope.errorMessage = 'For some reason you could not de-op ' + deopUser;
                        setTimeout(function(){ $scope.errorMessage = ''; }, 3000);
                    }
                });
            } else {
                $scope.errorMessage = 'Please do not try to de-op yourself!';
            }
        };

        $scope.pw = function () {
            // if user is op && pw1 === pw2 && length > 6
            if ($scope.currentOps[$scope.currentUser] !== undefined && $scope.pw1 === $scope.pw2 && $scope.pw1.length >= 6) {
                socket.emit('setpassword', {room: $scope.currentRoom, password: $scope.pw1}, function (success) {
                    if (success) {
                        $rootScope.isPassword = true;
                        $scope.show_password_form = false;
                        // TODO: eitthvað..
                        $scope.successMessage = 'A new password has been set for this room!';
                        setTimeout(function(){ $scope.successMessage = ''; }, 3000);
                    } else {
                        $scope.errorMessage = 'Oops.. something went wrong. Not able to set password.';
                        setTimeout(function(){ $scope.errorMessage = ''; }, 3000);
                    }
                });
            }
        };

        $scope.rmpw = function () {
            if ($scope.currentOps[$scope.currentUser] !== undefined) {
                socket.emit('removepassword', {room: $scope.currentRoom}, function (success) {
                    if (success) {
                        $rootScope.isPassword = false;
                        $scope.successMessage = 'Password removed!';
                        setTimeout(function(){ $scope.successMessage = ''; }, 3000);
                    } else {
                        $scope.errorMessage = 'Dang it! Looks like we still have a password!';
                        setTimeout(function(){ $scope.errorMessage = ''; }, 3000);
                    }
                });
            }
        };

        $scope.show_password = function() {
            $scope.show_password_form = true;
        };

        var toggleSidebar = function () {

            var special = ['reveal', 'top', 'boring', 'perspective', 'extra-pop'];
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


angular.module('AngChat').controller('RoomsController',
    ['$scope', '$location', '$rootScope', '$routeParams', 'socket',
    function ($scope, $location, $rootScope, $routeParams, socket) {
            $rootScope.showRoomList = true;
            $rootScope.isPassword = false;
            $rootScope.roomPassword = '';
            $rootScope.roomErrorMessage = '';
            $scope.roomName = '';
            $scope.currentUser = $routeParams.user;
            //$scope.room = $routeParams.room;
            $scope.rooms = [];
            $scope.errorMessage = '';
            //$scope.askPassword = false;
            //$scope.password = '';
            $scope.accessRoom = '';

            $rootScope.inRoom = false;

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

                socket.emit('joinroom', roomObj, function (success, reason) {
                    if (success) {
                        $scope.isPassword = false;
                        $location.path('/room/' + $scope.currentUser + '/' + roomName);
                    } else {
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


$( document ).ready(function() {
    console.log("document ready");
    $(function() {

      var special = ['reveal', 'top', 'boring', 'perspective', 'extra-pop'];

      // Toggle Nav on Click
      $('#test_id').click(function() {

        console.log("clicked on user Sidebar Demo");
        var transitionClass = $(this).data('transition');

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

      });

    });
});
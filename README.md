############################################################################
# Chat program in AngularJS
  This chat client is written using AngularJS & Socket.IO.
  The server is written in Node.js.
 
  Reykjavik University 2015 by Bjorn Halldor Helgason(bjornh13), Gunnar Marteinsson(gunnarmar13), Jokull I Elisabetarson(jokulle11).
############################################################################

############################################################################
# What you need to have installed on your machine:
############################################################################

  Install Bower
  Install bootstrap ($ bower install bootstrap)
  Install animate ($ bower install animate.css)
  Install angular ($ bower install angular)
  Install Node (http://nodejs.org/)
  Install Grunt ($ npm install -g grunt)
  Install Python 2.7 (to run server)

############################################################################
# How to run:
############################################################################

1. In the root folder type: $ c:/Python27/Python.exe -m SimpleHTTPServer 8000
2. Then type: node chatserver.js
5. Go to your browser and type in http://localhost:8000/ as your URL.

############################################################################
# How it works:
############################################################################

  In this chat client users can choose a unique nickname.
  Users can create their own chatrooms but default chatroom is the lobby.
  When users send messages 
  Once user creates a chatroom he/she becomes op of the room which has 
  priveledges to kick/ban other users out of that particular chatroom.
  Users can send private messages between other users in the same chatroom by
  clicking the name of the user in the user list.

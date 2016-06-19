"use strict";
$(document).ready(function () {
    $("#checkmateModal").modal({ show: false });
    var socket = io();
    
    // create new objects to pass to a new gameLogic object
    var chessBoard = new ChessBoard(document.getElementById('game'));
    var boardLayout = new BoardLayout(); // layout of the chess pieces
    var player = new Player();
    
    // objects are 'passed by reference' so game object will always know the state of the board
    var game = new GameLogic(player, boardLayout, chessBoard);

    var url;
    
    // this object will be used whenever there is a need to draw something on the canvas
    var render = new Render(boardLayout);
	
    // parts of the dom of which we can update the content
    var modalBody = document.getElementById('serverMessages');
    var gameLog = document.getElementById('gameLog');
    var status = document.getElementById('status');
    var gameOverMessage = document.getElementById('gameOverMessage');

    var roomID = "";
    var nickname = "";
    
    // these are only used for visual move history currently
    var files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    var ranks = [8, 7, 6, 5, 4, 3, 2, 1];
    
    // if invalid clicks move will reset
    function resetMove() {
        chessBoard.validFirstClick = false; // set to false or prev square will remain yellow
        render.drawPreviousSquare(chessBoard);
        render.drawSquare(chessBoard);
        game.endMove(); // using this to end move and 'reset' everything
    }
    
    // change the status so the players know whose move it is
    function updateMoveStatus() {
        if (player.colourPieces === "white" && player.turn === true) {
            status.innerHTML = "White to play";
        }
    }
    
    // updates the move history on the front end
    function updateMoveHistory(colourPieces, piece, prevX, prevY, x, y) {
        gameLog.innerHTML += colourPieces + " " + piece + " from " + files[prevX] + "" + ranks[prevY] +
        " to " + files[x] + "" + ranks[y] + "</br>";
    }
    
    // on connecting to the server, the server will send back a new game message
    socket.on('new game', function (data) {
        // server decides whos turn and what colour pieces
        player.turn = data.turn;
        player.colourPieces = data.colour;
        if (player.colourPieces === "black") {
            // black pieces will be reversed, so reverse the ranks (numbers on the sides of the board)
            ranks.reverse();
        }
        // store this so the client knows what 'room' to send the move to
        roomID = data.room;
        nickname = data.nickname;
        game.oppenentPiece(); // set colour of oppenent pieces
        url = data.url;
        // this could have been drawn previously? 
        render.drawBoard(chessBoard);


        if (player.colourPieces === "black") {
            // reverse the pieceLayout array so that player sees pieces at the bottom
            boardLayout.pieceLayout.reverse();
            render.drawPieces(chessBoard);
            render.printCoords(chessBoard, player.colourPieces);
        } else { // white pieces, leave the array as it is
            render.drawPieces(chessBoard);
            render.printCoords(chessBoard, player.colourPieces);
        }

        $('#greetingModal').modal('show');
        modalBody.innerHTML += "Hello Player " + data.player + ", here is your nickname: <b>" + nickname + "</b></br>";
        modalBody.innerHTML += "You are playing as <b>" + data.colour + "</b></br>";

        if (player.colourPieces === "white") {
            modalBody.innerHTML += "Send this URL to a friend: <b>" + data.shareURL + "</b></br>";
            document.getElementById('waitingForPlayer').innerHTML = "Waiting for oppenent to connect....";
        }

        document.getElementById('nickname').innerHTML = "<b>" + data.nickname + "</b>";
    });
    
    // waiting for an oppenent to connect to our game as player one
    socket.on('black connected', function (data) {
        document.getElementById('waitingForPlayer').innerHTML = "<b>Player 2 Connected</b><br>";
        document.getElementById('waitingForPlayer').innerHTML += "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Play</button>";
        document.getElementById('oppenentNickname').innerHTML = "<b>" + data.nickname + "</b>";
        player.turn = true;
        // send oppenent our nickname
        socket.emit('white nickname', {
            room: roomID,
            nickname: nickname
        });
    });
    
    // player 2 gets white's nickname
    socket.on('white nickname', function (data) {
        document.getElementById('oppenentNickname').innerHTML = "<b>" + data.nickname + "</b>";
        document.getElementById('waitingForPlayer').innerHTML = "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Play</button>";
    });
    
    // player went to a game that's already started
    socket.on('game full', function (data) {
        $('.modal').modal('show');
        render.drawBoard(chessBoard);
        modalBody.innerHTML += "Sorry, game has commenced <br>";
        modalBody.innerHTML += "Set up a new game: <a href =\"" + data.url + "\">" + data.url + "</a>";
    });
    
    // mousedown event
    chessBoard.canvas.addEventListener("mousedown", function (event) {
        // only do something with the click event if its the players turn
        if (player.turn === true) {
            chessBoard.squareClicked(event); // work out where the user clicked
            // only attempt move if a previous square has been clicked
            if (chessBoard.validFirstClick) {
                // has the player clicked on an empty square or on oppenents piece?
                if (chessBoard.checkSecondClick(boardLayout, player.colourPieces) && game.checkMove()) {
                    // now move the piece from prev square clicked to current square clicked in the data structure
                    game.movePiece();
                    chessBoard.validFirstClick = false; // set to false or prev square will remain yellow
                    player.turn = false;
                    render.drawPreviousSquare(chessBoard);  			// redraw previous selected square
                    render.drawSquare(chessBoard);			// draw current selected square
			
                    // send the move to the server
                    socket.emit('piece move', {
                        sqClickedX: chessBoard.squareClickedX,
                        sqClickedY: chessBoard.squareClickedY,
                        prevSqClickedX: chessBoard.prevSquareClickedX,
                        prevSqClickedY: chessBoard.prevSquareClickedY,
                        pieceToMove: render.selectedPiece,
                        move: boardLayout,
                        room: roomID
                    });
                    // updates the move history that the client sees
                    updateMoveHistory(player.colourPieces, render.selectedPiece.pieceType, chessBoard.prevSquareClickedX,
                        chessBoard.prevSquareClickedY, chessBoard.squareClickedX, chessBoard.squareClickedY);
                    // ensure newest move is always visible
                    gameLog.scrollTop = gameLog.scrollHeight;

                    game.incMoveCount();
                    game.endMove();
                    status.innerHTML = game.oppenentColour + " to move";


                } else { // not a valid second click
                    resetMove();
                }

            } else { // no valid first click yet
                // check for valid first click
                chessBoard.validClick(boardLayout, player.colourPieces);
                // only draw current selected square if no previous clicks (will just highlight square)
                if (chessBoard.validFirstClick) {
                    render.drawSquare(chessBoard, player.turn);
                } // else not valid, do NOTHING!
            }
        }
    }, false);
	
    // get piece clicked on mouse up so it can be used on next mouse down
    chessBoard.canvas.addEventListener("mouseup", function (event) {
        if (player.turn === true) {
            chessBoard.prevSquareClickedX = Math.ceil(chessBoard.canvasX / chessBoard.squareWidth) - 1; // -1 to count from 0
            chessBoard.prevSquareClickedY = Math.ceil(chessBoard.canvasY / chessBoard.squareHeight) - 1;
            render.getPieceClicked(boardLayout, chessBoard);
        }
    }, false);
	
    // listening for server to send oppenents move
    socket.on('piece move', function (data) {
        console.log("got move from server");
        /* Since player two has their board array reversed, everytime a player
        sends a piece move the Y coordinates need to be reversed to match
        that players pieceLayout array */
        var toY = -(data.sqClickedY - 7);
        var fromY = -(data.prevSqClickedY - 7)

        chessBoard.squareClickedX = data.sqClickedX;
        chessBoard.squareClickedY = toY;
        chessBoard.prevSquareClickedX = data.prevSqClickedX;
        chessBoard.prevSquareClickedY = fromY;

        game.y = toY;
        game.x = data.sqClickedX;
        game.prevY = fromY;
        game.prevX = data.prevSqClickedX;

        render.selectedPiece = data.pieceToMove;

        game.movePiece();

        render.drawPreviousSquare(chessBoard);
        render.drawSquare(chessBoard);

        status.innerHTML = player.colourPieces + " to move";
        // both players move history should always be in sync
        updateMoveHistory(game.oppenentColour, render.selectedPiece.pieceType, data.prevSqClickedX, fromY, data.sqClickedX, toY);     
        // ensure newest move is always visible
        gameLog.scrollTop = gameLog.scrollHeight;
        
        // are we in check?
        game.inCheck();
        if (game.check === true) {
            // we are in check, is it checkmate?
            game.inCheckMate();
            if (game.checkmate === true) {
                // if the modal doesn't load for any reason
                status.innerHTML += "<b><br>You are in CHECKMATE</b>";
                // open modal to let them know they lost!
                $("#checkmateModal").modal({ show: true });
                gameOverMessage.innerHTML += "Oppenent Won </br>";
                gameOverMessage.innerHTML += "Set up a new game: <a href =\"" + url + "\">" + url + "</a>";
                
                // Let the server know game over so other player will know
                socket.emit('checkmate', {
                    room: roomID
                });
            }
            // no checkmate, just let the player know they are in check
            else {
                status.innerHTML += "<b><br>You are in CHECK</b>";
            }
        }
        // run endMove again, ready for player to make move
        game.endMove();
        // players turn as long as its not checkmate
        if (!game.checkmate) {
            player.turn = true;
        }

    });

    socket.on('checkmate', function (data) {
        // since player is receiving this message they have won
        $("#checkmateModal").modal({ show: true });
        gameOverMessage.innerHTML += "Congratulations! You Win </br>";
        gameOverMessage.innerHTML += "Set up a new game: <a href =\"" + data.url + "\">" + data.url + "</a>";
    });
    
    // did make attempt at dealing with disconnections, this needs work in the future
    socket.on('player disconnected', function (data) {
        console.log("player left");
    });
}); 
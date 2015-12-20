"use strict";
$(document).ready(function () {

	function resetMove() {
		chessBoard.validFirstClick = false; // set to false or prev square will remain yellow
		render.drawPreviousSquare(chessBoard);
		render.drawSquare(chessBoard);
		game.endMove(); // using this to end move and 'reset' everything
	}

	var socket = io();
	var chessBoard = new ChessBoard(document.getElementById('game'));
	var boardLayout = new BoardLayout(); // layout of the chess pieces
	var render = new Render(boardLayout); // pass chessboard object to the renderer
	var player = new Player();
	
	// objects are 'passed by reference' so game object will always know the state of the board
	var game = new GameLogic(player, boardLayout, chessBoard);


	var modalBody = document.getElementById('serverMessages');
	var roomID = "";

	render.drawBoard(chessBoard); // this should only need drawing as required
	render.drawPieces(chessBoard);

	socket.on('new game', function (data) {
		$('.modal').modal('show');
		modalBody.innerHTML += "Hello Player " + data.player + ", here is your nickname: <b>" + data.nickname + "</b></br>";
		modalBody.innerHTML += "You are playing as <b>" + data.colour + "</b></br>";
		modalBody.innerHTML += "Send this URL to a friend: <b>" + data.shareURL + "</b></br>";
		
		// server decides whos turn and what colour pieces
		player.turn = data.turn;
		player.colourPieces = data.colour;
		roomID = data.room
		game.oppenentPiece(); // set colour of oppenent pieces
	});

	chessBoard.canvas.addEventListener("mousedown", function () {
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
					game.incMoveCount();
					game.endMove();

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
	
	//get piece clicked on mouse up so it can be used on next mouse click
	chessBoard.canvas.addEventListener("mouseup", function () {
		if (player.turn === true) {
			chessBoard.prevSquareClickedX = Math.ceil(chessBoard.canvasX / chessBoard.squareWidth) - 1; // -1 to count from 0
			chessBoard.prevSquareClickedY = Math.ceil(chessBoard.canvasY / chessBoard.squareHeight) - 1;
			render.getPieceClicked(boardLayout, chessBoard);
		}
	}, false);
	
	// listening for server to send oppenents move
	socket.on('piece move', function (data) {

		chessBoard.squareClickedX = data.sqClickedX;
		chessBoard.squareClickedY = data.sqClickedY;
		chessBoard.prevSquareClickedX = data.prevSqClickedX;
		chessBoard.prevSquareClickedY = data.prevSqClickedY;
		render.selectedPiece = data.pieceToMove;

		game.movePiece();
		render.drawPreviousSquare(chessBoard);  // redraw previous selected square
		render.drawSquare(chessBoard);
		console.log("got move from server");
		player.turn = true;
		game.endMove();
	});
}); 
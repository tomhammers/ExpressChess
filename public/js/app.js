$(document).ready(function () {
	
	// $(window).load(function(){
    //     $('.modal').modal('show');
    // });
	var socket = io();
	var chessBoard = new ChessBoard(document.getElementById('game'));
	var boardLayout = new BoardLayout(); // layout of the chess pieces
	var render = new Render(boardLayout); // pass chessboard object to the renderer
	var player = new Player();
	var modalBody = document.getElementById('serverMessages');

	socket.on('new game', function (data) {
		$('.modal').modal('show');
		modalBody.innerHTML += "Hello Player " + data.player + ", here is your nickname: <b>" + data.nickname + "</b></br>";
		modalBody.innerHTML += "You are playing as <b>" + data.colour + "</b></br>";
		modalBody.innerHTML += "Send this URL to a friend: <b>" + data.shareURL + "</b></br>";
		modalBody.innerHTML += data.room;
		console.log(data.room);
		socket.emit('join room', {room: data.room});
		player.turn = true;
	});

	render.drawBoard(chessBoard); // this should only need drawing as required
	render.drawPieces(chessBoard);

	chessBoard.canvas.addEventListener("mousedown", function () {
		if (player.turn === true) {
			chessBoard.squareClicked(event); // work out where the user clicked
			
			
			if (chessBoard.prevSquareClickedX > -1 && chessBoard.prevSquareClickedY > -1) {
				// now move the piece from prev square clicked to current square clicked in the data structure
				render.movePiece(boardLayout, chessBoard);
				player.turn = false;
				render.drawPreviousSquare(chessBoard);  			// redraw previous selected square
				render.drawSquare(chessBoard, player.turn);			// draw current selected square
		
				// send the move to the server
				socket.emit('piece move', {
					sqClickedX: chessBoard.squareClickedX,
					sqClickedY: chessBoard.squareClickedY,
					prevSqClickedX: chessBoard.prevSquareClickedX,
					prevSqClickedY: chessBoard.prevSquareClickedY,
					pieceToMove: render.selectedPiece,
					move: boardLayout
				});

				render.endMove(chessBoard);

			} else {
				// only draw current selected square if no previous clicks (will just highlight square)
				render.drawSquare(chessBoard, player.turn);
			}

		}
	}, false);
	
	
	// listening for server to send oppenents move
	socket.on('piece move', function (data) {

		chessBoard.squareClickedX = data.sqClickedX;
		chessBoard.squareClickedY = data.sqClickedY;
		chessBoard.prevSquareClickedX = data.prevSqClickedX;
		chessBoard.prevSquareClickedY = data.prevSqClickedY;
		render.selectedPiece = data.pieceToMove;
			
		// update boardlayout object
		// boardLayout = data.move;
		// render.drawBoard(chessBoard); // this should only need drawing as required
		// render.drawPieces(chessBoard);
			
		render.movePiece(boardLayout, chessBoard);
		//render.getPieceClicked(boardLayout, chessBoard);
		render.drawPreviousSquare(chessBoard);  // redraw previous selected square
		render.drawSquare(chessBoard);
		console.log("got move from server");
		player.turn = true;
		render.endMove(chessBoard);
		//render.drawPiece(chessBoard, chessBoard.squareClickedY, chessBoard.squareClickedX);
		//player.turn = true;
	});
		  
	//get piece clicked on mouse up so it can be used on next mouse click
	chessBoard.canvas.addEventListener("mouseup", function () {
		if (player.turn === true) {
			chessBoard.prevSquareClickedX = Math.ceil(chessBoard.canvasX / chessBoard.squareWidth) - 1; // -1 to count from 0
			chessBoard.prevSquareClickedY = Math.ceil(chessBoard.canvasY / chessBoard.squareHeight) - 1;
			render.getPieceClicked(boardLayout, chessBoard);
		}
	}, false);

}); 
$(document).ready(function () {
	var socket = io();
	var chessBoard = new ChessBoard(document.getElementById('game'));
	var boardLayout = new BoardLayout(); // layout of the chess pieces
	var render = new Render(boardLayout); // pass chessboard object to the renderer
	var player = new Player();



	render.drawBoard(chessBoard); // this should only need drawing as required
	render.drawPieces(chessBoard);

	// There are 2 events listening for mouse clicks, the one in the chessboard object works
	// out where on the chessboard the user clicked.........

	// This one redraws the squares, chess pieces need to be redrawn too,
	// otherwise the chess piece disappears visually
	chessBoard.canvas.addEventListener("mousedown", function () {
		if (player.turn === true) {
			// need to check prev square has been clicked before doing anything
			if (typeof chessBoard.prevSquareClickedX !== "undefined" && typeof chessBoard.prevSquareClickedY !== "undefined") {
				// now move the piece from prev square clicked to current square clicked in the data structure
				render.movePiece(boardLayout, chessBoard);
				render.drawPreviousSquare(chessBoard);  // redraw previous selected square
				render.drawSquare(chessBoard);			// draw current selected square
				console.log("hi");
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
				//player.turn = false;
			} else {
				// only draw current selected square if no previous clicks
				render.drawSquare(chessBoard);			
			}
			
		}
	}, false);
	
	
	// listening for server to send oppenents move
	socket.on('piece move', function(data){

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
			//render.endMove(chessBoard);
			//render.drawPiece(chessBoard, chessBoard.squareClickedY, chessBoard.squareClickedX);
			//player.turn = true;
  	});
		  
	//get piece clicked on mouse up so it can be used on next mouse click
	chessBoard.canvas.addEventListener("mouseup", function () {
		render.getPieceClicked(boardLayout, chessBoard);

	}, false);

}); 
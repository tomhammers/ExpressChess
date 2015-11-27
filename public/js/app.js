$(document).ready(function () {
	var socket = io();
	var chessBoard = new ChessBoard(document.getElementById('game'));
	var boardLayout = new BoardLayout(); // layout of the chess pieces
	var render = new Render(boardLayout); // pass chessboard object to the renderer


	render.drawBoard(chessBoard); // this should only need drawing as required
	render.drawPieces(chessBoard);

	// There are 2 events listening for mouse clicks, the one in the chessboard object works
	// out where on the chessboard the user clicked.........

	// This one redraws the squares, chess pieces need to be redrawn too,
	// otherwise the chess piece disappears!
	chessBoard.canvas.addEventListener("mousedown", function () {
		if (typeof chessBoard.prevSquareClickedX !== "undefined" && typeof chessBoard.prevSquareClickedY !== "undefined") {
			render.movePiece(boardLayout, chessBoard);
			// send the move to the server
			
			render.drawPreviousSquare(chessBoard);  // redraw previous selected square
			render.drawSquare(chessBoard);			// draw current selected square
			render.endMove(chessBoard);
		}
		socket.emit('piece move', {
				prevSqClickedX: chessBoard.prevSquareClickedX,
				prevSqClickedY: chessBoard.prevSquareClickedY,
				sqClickedX: chessBoard.squareClickedX, 
				sqClickedY: chessBoard.squareClickedY
			});
		
		render.drawSquare(chessBoard);			// draw current selected square
	}, false);
	
	// listening for server to send oppenents move
	socket.on('piece move', function(data){
   		 	console.log(data);
			chessBoard.squareClickedX = data.sqClickedX;	
			chessBoard.squareClickedY = data.sqClickedY;
			chessBoard.prevSquareClickedX = data.prevSqClickedX;	
			chessBoard.prevSquareClickedY = data.prevSqClickedY;
			
			
			render.movePiece(boardLayout, chessBoard);
			render.getPieceClicked(boardLayout, chessBoard);
			render.drawPreviousSquare(chessBoard);  // redraw previous selected square
			render.drawSquare(chessBoard);	
		
  	});
		  
	// get piece clicked on mouse up so it can be used on next mouse click
	chessBoard.canvas.addEventListener("mouseup", function () {
		render.getPieceClicked(boardLayout, chessBoard);

	}, false);

}); 
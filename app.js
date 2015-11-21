$(document).ready(function() {

	var chessBoard = new ChessBoard(document.getElementById('game'));
	var render = new Render(); // pass chessboard object to the renderer

	render.drawBoard(chessBoard); // this should only need drawing as required
	render.drawPieces(chessBoard);

	// There are 2 events listening for mouse clicks, the one in the chessboard object works
	// out where on the chessboard the user clicked.

	// This one redraws the board, chess pieces need to be redrawn too,
	// otherwise the chess piece disappears!
	chessBoard.canvas.addEventListener("mousedown", function() {
		render.drawPreviousSquare(chessBoard);  // redraw previous selected square
		render.drawSquare(chessBoard);			// draw current selected square
		}, false);



	
}); 
$(document).ready(function() {

	var chessBoard = new ChessBoard(document.getElementById('game'));
	var render = new Render(); // pass chessboard object to the renderer
	//setInterval(render.drawBoard(), 1); // Only need to render when a user makes a move
	render.drawBoard(chessBoard); // this should only need drawing as required
	render.drawPieces(chessBoard);

	// note there are 2 events listening for mouse clicks, the one in the chessboard works
	// out where on the chessboard the user clicked.
	// This one redraws the board, chess pieces need to be redrawn too,
	// otherwise the chess piece disappears!
	chessBoard.canvas.addEventListener("mousedown", function() {
		render.drawBoard(chessBoard);
		render.drawPieces(chessBoard);
		//render.drawSquare(chessBoard);
		}, false);
	// this perhaps could be done better? Instead of redrawing the whole board ->
	// just redraw the selected square - look into if I have time
	
}); 
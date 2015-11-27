$(document).ready(function() {
	var socket = io();
	var chessBoard = new ChessBoard(document.getElementById('game'));
	var boardLayout = new BoardLayout(); // layout of the chess pieces
	var render = new Render(boardLayout); // pass chessboard object to the renderer


	render.drawBoard(chessBoard); // this should only need drawing as required
	render.drawPieces(chessBoard);

	// There are 2 events listening for mouse clicks, the one in the chessboard object works
	// out where on the chessboard the user clicked.........

	// This one redraws the board, chess pieces need to be redrawn too,
	// otherwise the chess piece disappears!
	chessBoard.canvas.addEventListener("mousedown", function() {
		if (typeof chessBoard.prevSquareClickedX !== "undefined" && typeof chessBoard.prevSquareClickedY !== "undefined") {
			render.movePiece(boardLayout, chessBoard);
		}
		render.drawPreviousSquare(chessBoard);  // redraw previous selected square
		render.drawSquare(chessBoard);			// draw current selected square
		}, false);
	// get piece clicked on mouse up so it can be used on next mouse click
	chessBoard.canvas.addEventListener("mouseup", function() {
		render.getPieceClicked(boardLayout, chessBoard);
		
		}, false);
	
}); 
$(document).ready(function() {

	var chessBoard = new ChessBoard(document.getElementById('game'));
	var render = new Render(); // pass chessboard object to the renderer
	//setInterval(render.drawBoard(), 1); // Only need to render when a user makes a move
	render.drawBoard(chessBoard); // this should only need drawing as required
	render.drawPieces(chessBoard);
	
}); 
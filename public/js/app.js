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
		// need to check prev square has been clicked before doing anything
		if (typeof chessBoard.prevSquareClickedX !== "undefined" && typeof chessBoard.prevSquareClickedY !== "undefined") {
			render.movePiece(boardLayout, chessBoard);
			
			render.drawPreviousSquare(chessBoard);  // redraw previous selected square
			render.drawSquare(chessBoard);			// draw current selected square
			//render.endMove(chessBoard);
			
			// send the move to the server
			socket.emit('piece move', {
				sqClickedX: chessBoard.squareClickedX, 
				sqClickedY: chessBoard.squareClickedY,
				prevSqClickedX: chessBoard.prevSquareClickedX,
				prevSqClickedY: chessBoard.prevSquareClickedY
				
			});
		} else {
			// only draw current selected square if no previous clicks
			render.drawSquare(chessBoard);			
		}
	}, false);
	
	chessBoard.canvas.addEventListener("mouseup", function () {
		if (typeof chessBoard.prevSquareClickedX !== "undefined" && typeof chessBoard.prevSquareClickedY !== "undefined") {
			socket.emit('piece move', {
				sqClickedX: chessBoard.squareClickedX, 
				sqClickedY: chessBoard.squareClickedY,
				prevSqClickedX: chessBoard.prevSquareClickedX,
				prevSqClickedY: chessBoard.prevSquareClickedY
				
			});
		}
	}, false);
	
	// listening for server to send oppenents move
	socket.on('piece move', function(data){

   		 	console.log(data);
			chessBoard.squareClickedX = data.sqClickedX;	
			chessBoard.squareClickedY = data.sqClickedY;
			chessBoard.prevSquareClickedX = data.prevSqClickedX;	
			chessBoard.prevSquareClickedY = data.prevSqClickedY;
			console.log(chessBoard);
			
			render.movePiece(boardLayout, chessBoard);
			//render.getPieceClicked(boardLayout, chessBoard);
			render.drawPreviousSquare(chessBoard);  // redraw previous selected square
			render.drawSquare(chessBoard);	
		
  	});
		  
	// get piece clicked on mouse up so it can be used on next mouse click
	chessBoard.canvas.addEventListener("mouseup", function () {
		render.getPieceClicked(boardLayout, chessBoard);

	}, false);

}); 
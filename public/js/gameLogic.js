var GameLogic = function GameLogic(player, boardLayout, chessBoard) {
	this.player = player;
	this.boardLayout = boardLayout;
	this.chessBoard = chessBoard;
	this.oppenentColour = "";
	this.squareContainsPiece = false;
	
	this.pieceType = "";
}

// set the colour of the opponent, called when game is being set up
GameLogic.prototype.oppenentPiece = function () {
	if (this.player.colourPieces === "white") {
		this.oppenentColour = "black";
	} else { this.oppenentColour = "white"; }
}

// used in if statement after a valid 2nd click
// this should return true on valid click
GameLogic.prototype.checkMove = function () {
	// first lets find out what piecetype the use clicked
	this.pieceType = this.boardLayout.pieceLayout[this.chessBoard.prevSquareClickedY][this.chessBoard.prevSquareClickedX].pieceType;
	this.squareHasOppenentPiece();
	if (this.squareContainsPiece) {
		console.log("opp piece");

	}
	return true;
}

GameLogic.prototype.checkPawnMove = function () {
	return true;
}



// method to check if square has an oppenents piece
GameLogic.prototype.squareHasOppenentPiece = function () {
	// already checked click wasn't on own pieces
	if (this.boardLayout.pieceLayout[this.chessBoard.squareClickedY][this.chessBoard.squareClickedX] !== null) {
		if (this.boardLayout.pieceLayout[this.chessBoard.squareClickedY][this.chessBoard.squareClickedX].color === this.oppenentColour) {
			this.squareContainsPiece = true;
		}
	}
}


// only called if a valid move has taken place
GameLogic.prototype.movePiece = function () {
	// I had to temp store the piece obj to move in a variable, didn't need to do this for local moves
	// but do need to do it for websocket moves (oppenent moves), one fustrating/ time consuming bug!
	var tempObjPlaceHolder = this.boardLayout.pieceLayout[this.chessBoard.prevSquareClickedY][this.chessBoard.prevSquareClickedX];
	// set previous square clicked to null as square will now be empty
	this.boardLayout.pieceLayout[this.chessBoard.prevSquareClickedY][this.chessBoard.prevSquareClickedX] = null;
	// set current square clicked with piece from last square
	this.boardLayout.pieceLayout[this.chessBoard.squareClickedY][this.chessBoard.squareClickedX] = tempObjPlaceHolder;
	
	// add one to movecount
	// ................
}

// resets variables, used to reset move on unvalid clicks too
GameLogic.prototype.endMove = function () {
	this.chessBoard.prevSquareClickedX = -1;
	this.chessBoard.prevSquareClickedY = -1;
	this.chessBoard.squareClickedX = -1;
	this.chessBoard.squareClickedY = -1;
}



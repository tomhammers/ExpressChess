var GameLogic = function GameLogic(player, boardLayout, chessBoard) {
	this.player = player;
	this.boardLayout = boardLayout;
	this.chessBoard = chessBoard;
	this.oppenentColour = "";

	this.squareContainsPiece = false;
	this.pieceOnSquare;

	this.pieceType = "";
	this.prevSquare; // object that was on prev square clicked
	this.square;	// object thats on the current square clicked
	
	this.pieceMoved = false;

	this.validMove = false;
}

// set the colour of the opponent, called when game is being set up
GameLogic.prototype.oppenentPiece = function () {
	if (this.player.colourPieces === "white") {
		this.oppenentColour = "black";
	} else { this.oppenentColour = "white"; }
}

// used in if statement after a valid 2nd click
// this should return true if move is valid
GameLogic.prototype.checkMove = function () {
	// first assign variables
	this.prevSquare = this.boardLayout.pieceLayout[this.chessBoard.prevSquareClickedY][this.chessBoard.prevSquareClickedX];
	this.Square = this.boardLayout.pieceLayout[this.chessBoard.squareClickedY][this.chessBoard.squareClickedX];

	this.pieceType = this.prevSquare.pieceType;

	this.hasPieceMoved();
	// does the square clicked on have an oppenent piece?
	// don't need to do this here in real game?
	//this.squareHasPiece(this.chessBoard.squareClickedY, this.chessBoard.squareClickedX);

	if (this.squareContainsPiece) {
		console.log("opp piece");

	}

	switch (this.pieceType) {
		case "pawn":
			this.checkPawnMove();
			break;
		default:
			console.log("not sure what you picked up...");
	}

	return this.validMove;
}

GameLogic.prototype.checkPawnMove = function () {
	// function to check if pawn can move forward legally 
	function validPawnMoveForward(num) {
		// if click is 1 or 2 squares forward AND identical x co-ordinates of both clicks
		if (self.chessBoard.squareClickedY === self.chessBoard.prevSquareClickedY + num &&
			self.chessBoard.squareClickedX === self.chessBoard.prevSquareClickedX) {
			//this.validMove = true;
			//return true;
			var y = 0;
			if (num<0) { // white pieces
				y = self.chessBoard.prevSquareClickedY - self.chessBoard.squareClickedY;
			} else { // black pieces
				y = self.chessBoard.squareClickedY - self.chessBoard.prevSquareClickedY;
			}
			
			for(var i=0; i<y; i++) {
				if (num<0) {
					// white pawn, iterate back from square clicked to prevsquare clicked
					this.squareHasPiece(self.chessBoard.squareClickedY + i, self.chessBoard.squareClickedX);
				} else {
					// black pawn, iterate forward from square clicked to prevsquare clicked
					this.squareHasPiece(self.chessBoard.squareClickedY - i, self.chessBoard.squareClickedX);
				}	
			}
			
			if (!this.squareContainsPiece) {
				this.validMove = true;
			} else { // if a piece is blocking, invalid move
				this.validMove = false;
			}

		} // if statement	
	} // validPawnMoveForward()
	
	var validForwardSquares = [];
	if (this.player.colourPieces === "white") {
		validForwardSquares = [-1, -2];
	}
	if (this.player.colourPieces === "black") {
		validForwardSquares = [1, 2];
	}

	var self = this;

	if (this.pieceMoved) { // if pawn has moved before, can only move one square forward
		// call allows to set the context in the function of 'this'
		validPawnMoveForward.call(self, validForwardSquares[0]);
	}
	else { // pawn may move 2 squares forward
		validPawnMoveForward.call(self, validForwardSquares[0]);
		validPawnMoveForward.call(self, validForwardSquares[1]);
	}
}

// method to check if square has a piece
// already checked user hasn't clicked on own piece on second click
GameLogic.prototype.squareHasPiece = function (row, col) {
	// already checked click wasn't on own pieces
	if (this.boardLayout.pieceLayout[row][col] !== null) {
		this.squareContainsPiece = true;
	}
}

GameLogic.prototype.hasPieceMoved = function () {
	if (this.prevSquare.moveCount !== 0) {
		this.pieceMoved = true;
	}
}


// only called if a valid move has taken place
GameLogic.prototype.movePiece = function () {
	// add one to the move count
	this.boardLayout.pieceLayout[this.chessBoard.prevSquareClickedY][this.chessBoard.prevSquareClickedX].moveCount++;
	// store piece object in temp variable
	var tempObjPlaceHolder = this.boardLayout.pieceLayout[this.chessBoard.prevSquareClickedY][this.chessBoard.prevSquareClickedX];
	// now assign previous square to null
	this.boardLayout.pieceLayout[this.chessBoard.prevSquareClickedY][this.chessBoard.prevSquareClickedX] = null;
	// move temp object to the new square clicked
	this.boardLayout.pieceLayout[this.chessBoard.squareClickedY][this.chessBoard.squareClickedX] = tempObjPlaceHolder;
	

	this.validMove = false;
}

// resets variables, used to reset move on unvalid clicks too
GameLogic.prototype.endMove = function () {
	this.chessBoard.prevSquareClickedX = -1;
	this.chessBoard.prevSquareClickedY = -1;
	this.chessBoard.squareClickedX = -1;
	this.chessBoard.squareClickedY = -1;
	this.squareContainsPiece = false;
	this.pieceMoved = false;
}



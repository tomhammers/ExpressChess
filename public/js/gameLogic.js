var GameLogic = function GameLogic(player, boardLayout, chessBoard, render) {
	this.player = player;
	this.boardLayout = boardLayout;
	this.chessBoard = chessBoard;
	this.render = render;
	this.oppenentColour = "";
	this.oppenentPiece(); // sets this.oppenentColour
	
	// this.tempPieceHolder = this.boardLayout.pieceLayout[this.chessBoard.prevSquareClickedY][this.chessBoard.prevSquareClickedX];
	// this.prevTempPieceHolder = this.boardLayout.pieceLayout[this.chessBoard.squareClickedY][this.chessBoard.squareClickedX];

	this.squareContainsPiece = false;
	this.pieceOnSquare;

	this.pieceType = "";
	this.prevSquare; // object that was on prev square clicked
	this.square;	// object thats on the current square clicked
	this.y;
	this.x;
	this.prevY;
	this.prevX;
	// used to get king co-ordinates
	this.kingY;
	this.kingX;
	// is piece under attack
	//this.underAttack = false;

	this.pieceMoved = false;
	this.validMove = false;
	this.check = false; 		// are WE in check?
	this.checkmate = false;		// have we put oppenent in checkmate?
	this.beingAttacked = false;
	
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
	// first assign variables with data from attempted move to make future code more readable
	this.y = this.chessBoard.squareClickedY;
	this.x = this.chessBoard.squareClickedX;
	this.prevY = this.chessBoard.prevSquareClickedY;
	this.prevX = this.chessBoard.prevSquareClickedX;
	this.prevSquare = this.boardLayout.pieceLayout[this.chessBoard.prevSquareClickedY][this.chessBoard.prevSquareClickedX];
	this.Square = this.boardLayout.pieceLayout[this.chessBoard.squareClickedY][this.chessBoard.squareClickedX];
	this.pieceType = this.prevSquare.pieceType;
	// check if piece has moved previously
	this.hasPieceMoved();


	// call the correct method depending on which piece was selected by player
	switch (this.pieceType) {
		case "pawn":
			this.checkPawnMove();
			break;
		case "king":
			this.checkKingMove();
			break;
		default:
			console.log("not sure what you picked up...");
	}
	
	// will King be in check if move happens? last chance to change validMove to false;
	this.inCheck();

	return this.validMove;	

}

GameLogic.prototype.checkPawnMove = function () {
	
	// pawns can only move in one direction depending on the player
	var validForwardSquares = [];
	if (this.player.colourPieces === "white") {
		validForwardSquares = [-1, -2];
	}
	if (this.player.colourPieces === "black") {
		validForwardSquares = [1, 2];
	}

	var self = this;
	// checking for a valid capture
	validCapture.call(self, validForwardSquares[0]);
	// checking for valid move forward
	if (this.pieceMoved) { // if pawn has moved before, can only move one square forward
		// call allows to set the context in the function of 'this'
		validPawnMoveForward.call(self, validForwardSquares[0]); // 0=1
	}
	else { // pawn may move 1 or 2 squares forward
		validPawnMoveForward.call(self, validForwardSquares[0]); // 0=1
		validPawnMoveForward.call(self, validForwardSquares[1]); // 1=2
	}
	
	// function to check if pawn can move forward legally 
	function validPawnMoveForward(num) {
		// if click is 1 or 2 squares forward AND identical x co-ordinates of both clicks
		if (self.y === self.prevY + num && self.x === self.prevX) {
			// y = difference between squareclicked and prevSquare clicked
			var y = 0;
			if (num < 0) { // white pieces
				y = self.prevY - self.y; // 1st click - 2nd click
			} else { // black pieces
				y = self.y - self.prevY; // 2nd click - 1st click
			}
			// looping through squares checking for pieces blocking the way
			for (var i = 0; i < y; i++) {
				if (num < 0) {
					// white pawn, iterate back from square clicked to prevsquare clicked
					this.squareHasPiece(self.y + i, self.x);
				} else {
					// black pawn, iterate forward from square clicked to prevsquare clicked
					this.squareHasPiece(self.y - i, self.x);
				}
			}
			// if no pieces in the way, its a valid move
			if (!this.squareContainsPiece) {
				this.validMove = true;
			} else { // if a piece is blocking, invalid move
				this.validMove = false;
			}
		}

	} // validPawnMoveForward()
	
	function validCapture(num) {
		// if click was one row away from prevClick AND one column to the left OR one column to the right
		if (self.y === self.prevY + num && self.x === self.prevX + num || self.x === self.prevX - num) {
			// does the square clicked on contain a piece, remember click on own piece has already been checked
			this.squareHasPiece(self.y, self.x);
			// if square contains a piece its a valid move
			if (this.squareContainsPiece) {
				this.validMove = true;
			}
		}
	} // validCapture()
} // checkPawnMove()


GameLogic.prototype.checkKingMove = function () {
	var self = this;
	// click was on the same row, one row forward or one row backward?
	if (this.y === this.prevY) {
		// can only move left or right
		if (this.x === this.prevX - 1 || this.x === this.prevX + 1) {
			this.validMove = true;
		}
	}
	if (this.y === this.prevY + 1) {
		checkX.call(self);
	}
	if (this.y === this.prevY + -1) {
		checkX.call(self);
	}
	function checkX() {
		if (self.x === self.prevX - 1 || self.x === self.prevX || self.x === self.prevX + 1) {
			this.validMove = true;
		}

	}
}



// method to ensure own King is not in check before making move
GameLogic.prototype.findKing = function () {
	// find king of our colour in data structure
	for (var row = 0; row < 8; row++) {
		for (var col = 0; col < 8; col++) {
			if (this.boardLayout.pieceLayout[row][col] !== null) {
				if (this.boardLayout.pieceLayout[row][col].pieceType === "king" && this.boardLayout.pieceLayout[row][col].color === this.player.colourPieces) {
					this.kingY = row;
					this.kingX = col;
				} // if square contains King
			} // if square !== null
		}	// for col
	}	// for row
}

GameLogic.prototype.inCheck = function () {

	// temp make move so we can check
	this.movePiece();
	// where is our king?
	this.findKing();
	// King in check? 
	this.underAttack(this.kingY, this.kingX);
	// now put the game state back to how it was
	this.undoMove();
	// did beingAttacked bool get switched to true?
	if(this.beingAttacked) {
		// in that case we are in check, so can't make that move
		this.validMove = false;
	}
	// set to false ready for next check
	this.beingAttacked = false;
}

// have we put the oppenent in checkmate?? -> WINNER
GameLogic.prototype.inCheckMate = function () {

}
// is the y and x co-ordinate given in danger?
GameLogic.prototype.underAttack = function (y, x) {
	// for loops check 8 different directions
	var i, j;
	// how far do we need to check upwards? worry about queen, rooks and king
	for(i = y-1; i >= 0; i--) {
		this.squareHasPiece(i, x);
		if(this.squareContainsPiece) {
			console.log("checking up....");
			checkLines.call(this, i, x);
			// break as we are only concerned with the first piece in the way
			break; 
		}
	}
	// NE diagonal? Worry about bishop, queen, pawn, king
	for(i = y-1, j = x+1; i >= 0 && j <= 7; i--, j++) {
		//console.log("NE " + i + " " + j);	
	}
	// how far right? worry about queen, rooks and king
	for(i = x+1; i <= 7; i++) {
		//console.log("right "+ i);
		this.squareHasPiece(y, i);
		if(this.squareContainsPiece) {
			console.log("checking right....");
			checkLines.call(this, y, i);
			// break as we are only concerned with the first piece in the way
			break; 
		}
	}
	// SE diagonal? Worry about bishop, queen, pawn, king
	for(i = y+1, j = x+1; i <= 7 && j <= 7; i++, j++) {
		//console.log("SE " + i + " " + j);	
	}
	// how far downwards? worry about queen, rooks and king
	for(i = y+1; i <= 7; i++) {
		//console.log("down " + i);
		this.squareHasPiece(i, x);
		if(this.squareContainsPiece) {
			console.log("checking down....");
			checkLines.call(this, i, x);
			// break as we are only concerned with the first piece in the way
			break; 
		}
	}
	// SW diagonal? Worry about bishop, queen, pawn, king
	for(i = y+1, j = x-1; i <= 7 && j >= 0; i++, j--) {
		//console.log("SW " + i + " " + j);	
	}
	// how far left? worry about queen, rooks and king
	for(i = x-1; i >= 0; i--) {
		console.log("left " + i);
		this.squareHasPiece(y, i);
		if(this.squareContainsPiece) {
			console.log("checking left....");
			checkLines.call(this, y, i);
			// break as we are only concerned with the first piece in the way
			break; 
		}
	}
	// NW diagonal? Worry about bishop, queen, pawn, king
	for(i = y-1, j = x-1; i >= 0 && j >= 0; i--, j--) {
		//console.log("NW " + i + " " + j);	
	}
	// check for king on squares next to our king
	function checkLines(row, col) {
		console.log(this.pieceOnSquare);
		// only check further if the piece is the oppenents
		if(this.pieceOnSquare.color === this.oppenentColour) {
			if(this.pieceOnSquare.pieceType === "queen" || this.pieceOnSquare.pieceType === "rook") {
				console.log("in check");
				this.beingAttacked = true;		
			}
		}
	}
}

// method to check if square has a piece
// already checked user hasn't clicked on own piece on second click
GameLogic.prototype.squareHasPiece = function (row, col) {
	// already checked click wasn't on own pieces
	if (this.boardLayout.pieceLayout[row][col] !== null) {
		// found a piece
		this.squareContainsPiece = true;
		this.pieceOnSquare = this.boardLayout.pieceLayout[row][col];
	}
}

GameLogic.prototype.hasPieceMoved = function () {
	if (this.prevSquare.moveCount !== 0) {
		this.pieceMoved = true;
	}
}
/************************************************************************************/
// sometimes we will make the move temporalily to check potential game state before
// validating the move (check), use the existing movePiece method to do so then call
// undoMove after to return the game to how it was

// this will reset the move
GameLogic.prototype.undoMove = function () {
	this.boardLayout.pieceLayout[this.chessBoard.squareClickedY][this.chessBoard.squareClickedX] = this.oppPieceHolder;
	this.boardLayout.pieceLayout[this.chessBoard.prevSquareClickedY][this.chessBoard.prevSquareClickedX] = this.pieceHolder;
}

// this is called for final move and if the program needs to make a temp move to check potential state of board
GameLogic.prototype.movePiece = function () {
	// store piece objects, they may be needed in undoMove method
	this.pieceHolder = this.boardLayout.pieceLayout[this.chessBoard.prevSquareClickedY][this.chessBoard.prevSquareClickedX];
	this.oppPieceHolder = this.boardLayout.pieceLayout[this.chessBoard.squareClickedY][this.chessBoard.squareClickedX];
	// now assign previous square to null
	this.boardLayout.pieceLayout[this.chessBoard.prevSquareClickedY][this.chessBoard.prevSquareClickedX] = null;
	// move temp object to the new square clicked
	this.boardLayout.pieceLayout[this.chessBoard.squareClickedY][this.chessBoard.squareClickedX] = this.pieceHolder;
}

GameLogic.prototype.incMoveCount = function () {
	// add one to the move count
	this.boardLayout.pieceLayout[this.chessBoard.squareClickedY][this.chessBoard.squareClickedX].moveCount++;
	
	//this.square.moveCount++;
}

// resets variables, used to reset move on unvalid clicks too
GameLogic.prototype.endMove = function () {
	this.chessBoard.prevSquareClickedX = -1;
	this.chessBoard.prevSquareClickedY = -1;
	this.chessBoard.squareClickedX = -1;
	this.chessBoard.squareClickedY = -1;
	this.squareContainsPiece = false;
	this.pieceMoved = false;
	this.validMove = false;
}



"use strict";
var GameLogic = function GameLogic(player, boardLayout, chessBoard) {
    this.player = player;
    this.boardLayout = boardLayout;
    this.chessBoard = chessBoard;
    this.oppenentColour = "";
    this.oppenentPiece(); // sets this.oppenentColour
	
    this.squareContainsPiece = false;
    this.pieceOnSquare;

    this.pieceType = "";
    this.prevSquare; // object that was on prev square clicked
    this.square;	// object thats on the current square clicked
    // store mouse co-ordinates
    this.y;
    this.x;
    this.prevY;
    this.prevX;
    // used to get king co-ordinates
    this.kingY;
    this.kingX;

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
        case "queen":
            this.checkQueenMove();
            break;
        default:
            console.log("not sure what you picked up...");
    }
	
    // will King be in check if move happens? last chance to change validMove to false;
    this.inCheck();
    // if true move will be allowed, if false move will be reset in app.js
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
    // click was on the same row
    if (this.y === this.prevY) {
        // can only move left or right since click on self is not valid
        if (this.x === this.prevX - 1 || this.x === this.prevX + 1) {
            this.validMove = true;
        }
    }
    // click was one above
    if (this.y === this.prevY + 1) {
        checkX.call(self);
    }
    // click was one below
    if (this.y === this.prevY + -1) {
        checkX.call(self);
    }
    // checks x co-ordinate left to right
    function checkX() {
        if (self.x === self.prevX - 1 || self.x === self.prevX || self.x === self.prevX + 1) {
            this.validMove = true;
        }

    }
}

GameLogic.prototype.checkQueenMove = function() {
    
}

// find our own king
GameLogic.prototype.findKing = function () {
    // find king of our colour in data structure
    for (var row = 0; row < 8; row++) {
        for (var col = 0; col < 8; col++) {
            if (this.boardLayout.pieceLayout[row][col] !== null && this.boardLayout.pieceLayout[row][col].color === this.player.colourPieces) {
                if (this.boardLayout.pieceLayout[row][col].pieceType === "king") {
                    this.kingY = row;
                    this.kingX = col;
                    console.log("found king at " + row + " " + col);
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
    if (this.beingAttacked) {
        // in that case we are in check, so can't make that move
        this.validMove = false;
    }
    // set to false ready for next time
    this.beingAttacked = false;
}

// have we put the oppenent in checkmate?? -> WINNER
GameLogic.prototype.inCheckMate = function () {

}
// is the y and x co-ordinate given under attack from an enemy piece?
GameLogic.prototype.underAttack = function (y, x) {
    var i, j;
    // first check along the straight lines
    // how far do we need to check upwards? worry about queen, rooks and king
    for (i = y - 1; i >= 0; i--) {
        this.squareHasPiece(i, x);
        if (this.squareContainsPiece) {
            checkLines.call(this, i, x);
            this.squareContainsPiece = false // ready for next for loop	
            break; // break as we are only concerned with the first piece in the way
        }
    }
    // how far right? worry about queen, rooks and king
    for (i = x + 1; i <= 7; i++) {
        this.squareHasPiece(y, i);
        if (this.squareContainsPiece) {
            checkLines.call(this, y, i);
            this.squareContainsPiece = false // ready for next for loop	
            break; // break as we are only concerned with the first piece in the way
        }
    }
    // how far downwards? worry about queen, rooks and king
    for (i = y + 1; i <= 7; i++) {
        this.squareHasPiece(i, x);
        if (this.squareContainsPiece) {
            checkLines.call(this, i, x);
            this.squareContainsPiece = false // ready for next for loop	
            break; // break as we are only concerned with the first piece in the way
        }
    }
    // how far left? worry about queen, rooks and king
    for (i = x - 1; i >= 0; i--) {
        this.squareHasPiece(y, i);
        if (this.squareContainsPiece) {
            checkLines.call(this, y, i);
            this.squareContainsPiece = false // ready for next for loop	
            break; // break as we are only concerned with the first piece in the way
        }
    }
    // is the piece found threatening?
    function checkLines(row, col) {   
        // only check further if the piece is the oppenents
        if (this.pieceOnSquare.color === this.oppenentColour) {
            // is there a enemy queen or rook
            if (this.pieceOnSquare.pieceType === "queen" || this.pieceOnSquare.pieceType === "rook") {
                this.beingAttacked = true;
            }
            
            // is there an enemy king next to us?
            // checks one square directly UP, LEFT, RIGHT then DOWN - if any of these are true then beingAttacked = true = true
            if ((row === y - 1 && col === x) || (row === y && col === x - 1 || col === x + 1) || (row === y + 1 && col === x)) {
                if (this.pieceOnSquare.pieceType === "king") {
                    this.beingAttacked = true;
                }
            }
        }
    }
    /************************************************************************/
    // now check along the diagonals
    // NE diagonal? Worry about bishop, queen, pawn, king
    for (i = y - 1, j = x + 1; i >= 0 && j <= 7; i-- , j++) {
        this.squareHasPiece(i, j);
        if (this.squareContainsPiece) {
            checkDiagonals.call(this, i, j);
            this.squareContainsPiece = false // ready for next for loop	 
            break; // break as we are only concerned with the first piece in the way
        }
    }
    // SE diagonal? Worry about bishop, queen, pawn, king
    for (i = y + 1, j = x + 1; i <= 7 && j <= 7; i++ , j++) {
        this.squareHasPiece(i, j);
        if (this.squareContainsPiece) {
            checkDiagonals.call(this, i, j);
            this.squareContainsPiece = false // ready for next for loop	
            break; // break as we are only concerned with the first piece in the way
        }
    }
    // SW diagonal? Worry about bishop, queen, pawn, king
    for (i = y + 1, j = x - 1; i <= 7 && j >= 0; i++ , j--) {
        this.squareHasPiece(i, j);
        if (this.squareContainsPiece) {
            checkDiagonals.call(this, i, j);
            this.squareContainsPiece = false // ready for next for loop	
            break; // break as we are only concerned with the first piece in the way
        }
    }
    // NW diagonal? Worry about bishop, queen, pawn, king
    for (i = y - 1, j = x - 1; i >= 0 && j >= 0; i-- , j--) {
        this.squareHasPiece(i, j);
        if (this.squareContainsPiece) {
            checkDiagonals.call(this, i, j);
            this.squareContainsPiece = false // ready for next for loop	
            break; // break as we are only concerned with the first piece in the way
        }
    }
    function checkDiagonals(row, col) {
        // only check further if the piece is the oppenents
        if (this.pieceOnSquare.color === this.oppenentColour) {
            // pawns first
            var i = -1; // default checking for black pawns -1 on the y axis
            if (this.oppenentColour === "white") {
                i = 1; // or check +1 on the y axis
            }
            // row plus (+1 or -1) AND col -1 OR col + 1 - looking for pawn one square diagonally
            if (row === y + i && col === x - 1 || col === x + 1) {
                if (this.pieceOnSquare.pieceType === "pawn") {
                    this.beingAttacked = true;
                }
            }
            // is there a king next to us?
            // checks one square NW, NE, SW and SE
            if ((row === y - 1 && col === x - 1 || col === x + 1) || (row === y + 1 && col === x - 1 || col === x + 1)) {
                if (this.pieceOnSquare.pieceType === "king") {
                    this.beingAttacked = true;
                }
            }
            // is there an enemy queen or bishop?
            if (this.pieceOnSquare.pieceType === "queen" || this.pieceOnSquare.pieceType === "bishop") {
                this.beingAttacked = true;
            }
        } // else - first piece in the way was own colour, don't worry about it
    }
    
    /******************************************************************************* */
    // check for enemy knight
    // i'm sure there is a better way to do this, but my head is hurting too much right now
    this.squareHasPiece(y - 1, x - 2);
    this.checkForKnight();
    this.squareHasPiece(y - 2, x - 1);
    this.checkForKnight();
    this.squareHasPiece(y - 2, x + 1);
    this.checkForKnight();
    this.squareHasPiece(y - 1, x + 2);
    this.checkForKnight();

    this.squareHasPiece(y + 1, x + 2);
    this.checkForKnight();
    this.squareHasPiece(y + 2, x + 1);
    this.checkForKnight();
    this.squareHasPiece(y + 2, x - 1);
    this.checkForKnight();
    this.squareHasPiece(y + 1, x - 2);
    this.checkForKnight();
}

GameLogic.prototype.checkForKnight = function () {
    // has to be opp colour and a knight
    if (this.pieceOnSquare.color === this.oppenentColour && this.pieceOnSquare.pieceType === "knight") {
        this.beingAttacked = true;
    }
}

// method to check if square has a piece
// already checked user hasn't clicked on own piece on second click
GameLogic.prototype.squareHasPiece = function (row, col) {
    // already checked click wasn't on own pieces
    // only check valid squares
    if (row > -1 && row < 8 && col > -1 && col < 8) {
        // if not equal to null then we have found a piece
        if (this.boardLayout.pieceLayout[row][col] !== null) {
            // found a piece
            this.squareContainsPiece = true;
            this.pieceOnSquare = this.boardLayout.pieceLayout[row][col];
        }
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



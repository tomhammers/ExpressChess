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
    this.oppKingY;
    this.oppKingX;
    // what piece is attacking? needed for checking checkmate
    this.pieceAttackingKingY;
    this.pieceAttackingKingX;



    this.pieceMoved = false;
    this.validMove = false;
    this.check = false; 		// are WE in check?
    this.checkmate = false;		// have we put oppenent in checkmate?
    this.beingAttacked = false;
    this.safeSpace = false; // found a safe space to move to?
    this.safeMove = false; // is there a move that gets out of check?
}

// set the colour of the opponent, called when game is being set up
GameLogic.prototype.oppenentPiece = function () {
    if (this.player.colourPieces === "white") {
        this.oppenentColour = "black";
    } else { this.oppenentColour = "white"; }
}

// used in if statement after a valid 2nd click
// also used in PART 3 of inCheckMate()
// this should return true if move is valid
GameLogic.prototype.checkMove = function (toY, toX, fromY, fromX, pieceType) {
    // allows default parameters, assumes mouse clicks if nothing has been passed
    if (toY === undefined) {
        this.y = this.chessBoard.squareClickedY;
    } else {
        this.y = toY;
    }
    if (toX === undefined) {
        this.x = this.chessBoard.squareClickedX;
    } else {
        this.x = toX;
    }
    if (fromY === undefined) {
        this.prevY = this.chessBoard.prevSquareClickedY;
    } else {
        this.prevY = fromY;
    }
    if (fromX === undefined) {
        this.prevX = this.chessBoard.prevSquareClickedX;
    } else {
        this.prevX = fromX;
    }

    this.prevSquare = this.boardLayout.pieceLayout[this.prevY][this.prevX];
    this.Square = this.boardLayout.pieceLayout[this.y][this.x];
    if (pieceType === undefined) pieceType = this.boardLayout.pieceLayout[this.prevY][this.prevX].pieceType;
    // check if piece has moved previously, effects pawns etc
    this.hasPieceMoved();
    // call the correct method depending on which piece was selected by player
    switch (pieceType) {
        case "pawn":
            this.checkPawnMove();
            this.validPawnCapture();
            break;
        case "king":
            this.checkKingMove();
            break;
        case "queen": // queen uses both validLineMove() and validDiagionalMove()
            this.checkQueenMove();
            break;
        case "rook": // call method used by queen
            this.validLineMove();
            break;
        case "bishop": // call method used by queen
            this.validDiagonalMove();
            break;
        case "knight":
            this.validKnightMove();
            break;
        default: // this should never happen
            console.log("this should never happen....");
    }
    // temp move the piece so we can look for check
    this.movePiece();
    // will King be in check if move happens? last chance to change validMove to false;
    this.inCheck();
    // put everything back to how it was
    this.undoMove();
    // if true move is good, otherwise will return false
    return this.validMove;
}
// next series of methods validate moves, switch statement in checkMove calls the correct one
GameLogic.prototype.checkPawnMove = function () {
    // check for move one square forward
    validPawnMoveForward.call(this, 1);
    // not previously moved, can try to move 2 squares forward
    if (!this.pieceMoved) validPawnMoveForward.call(this, 2);
    
    // function to check if pawn can move forward legally 
    function validPawnMoveForward(num) {
        // if click is 1 or 2 squares forward AND identical x co-ordinates of both clicks
        if (this.y === this.prevY - num && this.x === this.prevX) {
            // y = difference between squareclicked and prevSquare clicked
            var y = this.prevY - this.y;

            // looping through squares checking for pieces blocking the way
            for (var i = 0; i < y; i++) {
                this.squareHasPiece(this.y + i, this.x);
            }
            // if no pieces in the way, its a valid move
            this.pieceInTheWay();
        }
    } // validPawnMoveForward()
} // checkPawnMove()

GameLogic.prototype.validPawnCapture = function () {
    if ((this.y === this.prevY - 1) && (this.x === this.prevX + 1 || this.x === this.prevX - 1)) {
        // does the square clicked on contain a piece
        this.squareHasPiece(this.y, this.x);
        // if square contains a piece its a valid move
        if (this.squareContainsPiece) {
            this.validMove = true;
        }
    }
}

GameLogic.prototype.checkKingMove = function () {
    // click was on the same row
    if (this.y === this.prevY) {
        // can only move left or right since 2nd click on king is not valid
        if (this.x === this.prevX - 1 || this.x === this.prevX + 1) {
            this.validMove = true;
        }
    }
    // click was one above
    if (this.y === this.prevY + 1) {
        checkX.call(this);
    }
    // click was one below
    if (this.y === this.prevY - 1) {
        checkX.call(this);
    }
    // checks x co-ordinate left, middle then right
    function checkX() {
        if (this.x === this.prevX - 1 || this.x === this.prevX || this.x === this.prevX + 1) {
            this.validMove = true;
        }
    }

}

// can combine rooks and bishops methods to check valid queen move
GameLogic.prototype.checkQueenMove = function () {
    // remember already checked for clicks on own pieces
    this.validLineMove();
    this.validDiagonalMove();
}

// rooks, queens
GameLogic.prototype.validLineMove = function () {
    // only a valid line move if one of these is exactly true
    if (this.x === this.prevX || this.y === this.prevY) {
        // now check the 4 possible directions
        
        if (this.y < this.prevY) { // attempt to move upwards
            var y = 1;
            // just one square up, don't worry about pieces in the way, since click on own piece is already checked
            if (this.y + y === this.prevY) {
                this.validMove = true;
            }
            // else this condition will be true, check for pieces blocking the path
            while (this.y + y < this.prevY) {
                // check each square inbetween for a piece
                this.squareHasPiece(this.y + y, this.x);
                // will switch validMove bool to false if a piece was in the way
                this.pieceInTheWay();
                y++;
            }
        }
        /////////////////////////////////////////////////////////////
        if (this.y > this.prevY) { // attempt to move downwards
            var y = -1;
            if (this.y + y === this.prevY) {
                this.validMove = true;
            }
            while (this.y + y > this.prevY) {
                this.squareHasPiece(this.y + y, this.x);
                this.pieceInTheWay();
                y--;
            }
        }
        //////////////////////////////////////////////////////////////
        if (this.x < this.prevX) { // attempt to move left
            var x = 1;
            if (this.x + x === this.prevX) {
                this.validMove = true;
            }
            while (this.x + x < this.prevX) {
                this.squareHasPiece(this.y, this.x + x);
                this.pieceInTheWay();
                x++;
            }
        }
        //////////////////////////////////////////////////////////////
        if (this.x > this.prevX) { // attempt to move right
            var x = -1;
            if (this.x + x === this.prevX) {
                this.validMove = true;
            }
            while (this.x + x > this.prevX) {
                this.squareHasPiece(this.y, this.x + x);
                this.pieceInTheWay();
                x--;
            }
        }
    } // if (this.x === this.prevX || this.y === this.prevY)
}

// bishops, queens
GameLogic.prototype.validDiagonalMove = function () {
    var i, j;
    // loop through NE diagonal squares
    for (i = this.prevY - 1, j = this.prevX + 1; i >= this.y && j <= this.x; i-- , j++) {
        checkSquare.call(this, i, j);
        if (this.squareContainsPiece) {
            this.squareContainsPiece = false; // ready for next check
            break; // piece in the way, reject move attempt
        }
    }
    // loop through SE diagonal squares
    for (i = this.prevY + 1, j = this.prevX + 1; i <= this.y && j <= this.x; i++ , j++) {
        checkSquare.call(this, i, j);
        if (this.squareContainsPiece) {
            this.squareContainsPiece = false; // ready for next check
            break; // piece in the way, reject move attempt
        }
    }
    // loop through SW diagonal squares
    for (i = this.prevY + 1, j = this.prevX - 1; i <= this.y && j >= this.x; i++ , j--) {
        checkSquare.call(this, i, j);
        if (this.squareContainsPiece) {
            this.squareContainsPiece = false; // ready for next check
            break; // piece in the way, reject move attempt
        }
    }
    // loop through NW diagonal squares
    for (i = this.prevY - 1, j = this.prevX - 1; i >= this.y && j >= this.x; i-- , j--) {
        checkSquare.call(this, i, j);
        if (this.squareContainsPiece) {
            this.squareContainsPiece = false; // ready for next check
            break; // piece in the way, reject move attempt
        }
    }

    function checkSquare(y, x) {
        // if we are checking the square clicked DON'T do this - it will block attack attempt
        if (this.y !== y && this.x !== x) {
            if (this.boardLayout.pieceLayout[y][x] !== null) {
                // there is a piece blocking the path, the for loop calling this will now break out
                this.squareContainsPiece = true;
            }
        }
        // if click is the same as the attributes passed into the function we have a valid move
        if (this.y === y && this.x === x) {
            this.validMove = true;
        }
    }
}

// checks for the 8 possible moves, don't have to worry about pieces in the way or off-board co-ords
GameLogic.prototype.validKnightMove = function () {
    if ((this.y === this.prevY - 1) && (this.x === this.prevX - 2 || this.x === this.prevX + 2)) {
        this.validMove = true;
    }
    if ((this.y === this.prevY - 2) && (this.x === this.prevX - 1 || this.x === this.prevX + 1)) {
        this.validMove = true;
    }
    if ((this.y === this.prevY + 1) && (this.x === this.prevX - 2 || this.x === this.prevX + 2)) {
        this.validMove = true;
    }
    if ((this.y === this.prevY + 2) && (this.x === this.prevX - 1 || this.x === this.prevX + 1)) {
        this.validMove = true;
    }
}
// is the player in check
GameLogic.prototype.inCheck = function () {
    // where is our king?
    this.findKings();
    // our King in check? 
    this.underAttack(this.kingY, this.kingX, this.oppenentColour);
    
    // did beingAttacked bool get switched to true?
    if (this.beingAttacked) {
        // in that case we are in check, so can't make that move
        this.validMove = false;
        this.check = true;
        // set to false ready for next check
        this.beingAttacked = false
    }
}

// switch validMove depending if there is a piece blocking the way
GameLogic.prototype.pieceInTheWay = function () {
    if (!this.squareContainsPiece) {
        this.validMove = true;
    } else { // if a piece is blocking, invalid move
        this.validMove = false;
    }
}

// find our own king
GameLogic.prototype.findKings = function () {
    // find king of our colour in data structure
    for (var row = 0; row < 8; row++) {
        for (var col = 0; col < 8; col++) {
            if (this.boardLayout.pieceLayout[row][col] !== null) {
                if (this.boardLayout.pieceLayout[row][col].pieceType === "king" && this.boardLayout.pieceLayout[row][col].color === this.player.colourPieces) {
                    this.kingY = row;
                    this.kingX = col;
                } // if square contains our King

                if (this.boardLayout.pieceLayout[row][col].pieceType === "king" && this.boardLayout.pieceLayout[row][col].color === this.oppenentColour) {
                    this.oppKingY = row;
                    this.oppKingX = col;
                } // if square contains our King
            } // if square !== null
        }	// for col
    }	// for row
}

// Called on players move before they begin their move, only called if they are in check
GameLogic.prototype.inCheckMate = function () {
    // there is likely a more elegent solution, here I spam every possible move a player can make and look for a valid move
    
    // look for all our own pieces and generates every move (valid or not), is there a safe move?
    // Since existing checkMove function looks for check before validating move we can use that, if no valid moves found ~ CHECKMATE
    // i, j = moving from
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (this.boardLayout.pieceLayout[i][j] !== null) { // not an empty square           
                if (this.boardLayout.pieceLayout[i][j].color === this.player.colourPieces) { // found own piece
                    // if found own piece then check moving it to every square on the board
                    this.checkAllMoves(i, j);
                }
            }
        }
    }
    
    
    // check if safeMove flipped from false to true
    if (this.safeMove !== true) {
        // it didn't flip, CHECKMATE!
        this.checkmate = true;
    }
    // reset variables for next usage
    this.validMove = false;
    this.safeMove = false;
}   

// for the piece passed to the method, look for a valid move by attempting top move it to every square om the board
GameLogic.prototype.checkAllMoves = function (row, col) { 
    
    // no need to do unneccessary computation, if a safe move has already been found - don't bother
    if (!this.safeMove) {
                
        // row, col - moving from
        // for every own piece found, it will attempt every possible move, valid or not
        // y, x - moving to
        for (var y = 0; y < 8; y++) {
            for (var x = 0; x < 8; x++) {
            
                // need to check that pawn can move diagonal
                // if (this.boardLayout.pieceLayout[y][x] !== null && this.boardLayout.pieceLayout[y][x].pieceType === "pawn" && y === row-1 && (x === col - 1 || x === col + 1) && y === row - 1) {
                //     if (this.boardLayout.pieceLayout[y][x].color === this.player.oppenentColour) {
                //         if (this.checkMove(y, x, row, col, this.boardLayout.pieceLayout[row][col].pieceType)) {
                //             // found a safe move, not checkmate
                //             this.safeMove = true;
                //             console.log(this.safeMove + " from " + row + " " + col + " to " + y + " " + x);
                //         }
                //     }
                // } else {
            
            
                // only check if square moving to is null OR not equal to our own pieces
                if (this.boardLayout.pieceLayout[y][x] === null || this.boardLayout.pieceLayout[y][x].color !== this.player.colourPieces) {
                    //this.checkMove(y, x, i, j, this.boardLayout.pieceLayout[i][j].pieceType);
                    // now it checks the validity of the move
                    if (this.checkMove(y, x, row, col, this.boardLayout.pieceLayout[row][col].pieceType)) {
                        // found a safe move, not checkmate
                        this.safeMove = true;
                        console.log(this.safeMove + " from " + row + " " + col + " to " + y + " " + x);
                        // flip back to false, ready for next iteration
                        this.validMove = false;
                    }
                }
                // }
            
            } // inner for loop
        } // outer for loop
    } // if (!this.safeMove)
}

// is the y and x co-ordinate given under attack from an enemy piece?
GameLogic.prototype.underAttack = function (y, x, colour) { // colour - opposite to piece under attack
    var i, j;
    // first check along the straight lines
    // how far do we need to check upwards? worry about queen, rooks and king
    // i = y -1 as don't need to check own square
    for (i = y - 1; i >= 0; i--) {
        this.squareHasPiece(i, x);
        // stop at the first piece found
        if (this.squareContainsPiece) {
            // we found a piece, check what it was and is it a threat?
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
        if (this.pieceOnSquare.color === colour) {
            // is there an enemy queen or rook
            if (this.pieceOnSquare.pieceType === "queen" || this.pieceOnSquare.pieceType === "rook") {
                this.beingAttacked = true;
                this.pieceAttackingKingY = row;
                this.pieceAttackingKingX = col;
            }
            
            // is there an enemy king next to us?
            // checks one square directly UP, LEFT, RIGHT then DOWN - if any of these are true then beingAttacked = true
            if ((row === y - 1 && col === x) || (row === y && col === x - 1 || col === x + 1) || (row === y + 1 && col === x)) {
                if (this.pieceOnSquare.pieceType === "king") {
                    this.beingAttacked = true;
                    this.pieceAttackingKingY = row;
                    this.pieceAttackingKingX = col;
                }
            }

        }
    }  
    /************************************************************************/
    // now check along the diagonals
    // NE diagonal? Worry about bishop, queen, pawn, king
    for (i = y - 1, j = x + 1; i >= 0 && j <= 7; i-- , j++) {
        // check each square for a piece
        this.squareHasPiece(i, j);
        // if we found one, check what it is and if its a danger
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
        if (this.pieceOnSquare.color === colour) {
            
            // pawns first
            var i = -1; // pawns attacking us have to be -1 on the y axis
            // row + (-1) AND col -1 or +1  looking for pawn one square diagonally
            if ((row === y + i) && (col === x - 1 || col === x + 1)) {
                if (this.pieceOnSquare.pieceType === "pawn") {
                    this.beingAttacked = true;
                    this.pieceAttackingKingY = row;
                    this.pieceAttackingKingX = col;
                }
            }
            // is there a king next to us?
            // checks one square NW, NE, SW and SE
            if ((row === y - 1 && col === x - 1 || col === x + 1) || (row === y + 1 && col === x - 1 || col === x + 1)) {
                if (this.pieceOnSquare.pieceType === "king") {
                    this.beingAttacked = true;
                    this.pieceAttackingKingY = row;
                    this.pieceAttackingKingX = col;
                }
            }
            // is there an enemy queen or bishop?
            if (this.pieceOnSquare.pieceType === "queen" || this.pieceOnSquare.pieceType === "bishop") {
                this.beingAttacked = true;
                this.pieceAttackingKingY = row;
                this.pieceAttackingKingX = col;
            }
        } // else - first piece in the way was own colour, don't worry about it
    }
 
    /******************************************************************************* */
    // check for enemy knight - checks 8 possible positions around piece
    // i'm sure there is a better way to do this, but my head is hurting too much right now
    this.squareHasPiece(y - 1, x - 2);
    this.checkForKnight(this.oppenentColour, y - 1, x - 2);
    this.squareHasPiece(y - 2, x - 1);
    this.checkForKnight(this.oppenentColour, y - 2, x - 1);
    this.squareHasPiece(y - 2, x + 1);
    this.checkForKnight(this.oppenentColour, y - 2, x + 1);
    this.squareHasPiece(y - 1, x + 2);
    this.checkForKnight(this.oppenentColour, y - 1, x + 2);

    this.squareHasPiece(y + 1, x + 2);
    this.checkForKnight(this.oppenentColour, y + 1, x + 2);
    this.squareHasPiece(y + 2, x + 1);
    this.checkForKnight(this.oppenentColour, y + 2, x + 1);
    this.squareHasPiece(y + 2, x - 1);
    this.checkForKnight(this.oppenentColour, y + 2, x - 1);
    this.squareHasPiece(y + 1, x - 2);
    this.checkForKnight(this.oppenentColour, y + 1, x - 2);
}

GameLogic.prototype.checkForKnight = function (colour, row, col) {
    // has to be opp colour and a knight
    if (this.pieceOnSquare.color === colour && this.pieceOnSquare.pieceType === "knight") {
        this.beingAttacked = true;
        this.pieceAttackingKingY = row;
        this.pieceAttackingKingX = col;
    }
}

// method to check if square has a piece
GameLogic.prototype.squareHasPiece = function (row, col) {
    // only check valid squares on chessboard
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
// Sometimes we will make moves temporalily to check potential game state, use the existing  
// movePiece method to do so then call undoMove after to return the game to how it was.

// this is called for final move and if the program needs to make a temp move to check potential state of board
GameLogic.prototype.movePiece = function (toY, toX, fromY, fromX) {
    // if no parameters are passed use the mouse clicks by default  
    if (toY === undefined) toY = this.y;
    if (toX === undefined) toX = this.x;
    if (fromY === undefined) fromY = this.prevY;
    if (fromX === undefined) fromX = this.prevX;

    if (this.boardLayout.pieceLayout[this.prevY][this.prevX] !== null) {
        this.pieceHolder = this.boardLayout.pieceLayout[this.prevY][this.prevX];
    } else this.pieceHolder = null;
    if (this.boardLayout.pieceLayout[this.y][this.x] !== null) {
        this.oppPieceHolder = this.boardLayout.pieceLayout[this.y][this.x];
    } else this.oppPieceHolder = null;
    
    // now assign previous square to null
    this.boardLayout.pieceLayout[fromY][fromX] = null;
    // move temp object to the new square clicked
    this.boardLayout.pieceLayout[toY][toX] = this.pieceHolder;
}

// this will reset the move
GameLogic.prototype.undoMove = function (toY, toX, fromY, fromX) {
    if (toY === undefined) toY = this.chessBoard.squareClickedY;
    if (toX === undefined) toX = this.chessBoard.squareClickedX;
    if (fromY === undefined) fromY = this.chessBoard.prevSquareClickedY;
    if (fromX === undefined) fromX = this.chessBoard.prevSquareClickedX;
    // put the array back to how it was previously
    this.boardLayout.pieceLayout[this.y][this.x] = this.oppPieceHolder;
    this.boardLayout.pieceLayout[this.prevY][this.prevX] = this.pieceHolder;
}

GameLogic.prototype.incMoveCount = function () {
    // add one to the move count of the selected piece
    this.boardLayout.pieceLayout[this.chessBoard.squareClickedY][this.chessBoard.squareClickedX].moveCount++;
}

// resets variables, used to reset move on unvalid clicks too
GameLogic.prototype.endMove = function () {
    this.chessBoard.prevSquareClickedX = 0;
    this.chessBoard.prevSquareClickedY = 0;
    this.chessBoard.squareClickedX = 0;
    this.chessBoard.squareClickedY = 0;
    this.y = undefined;
    this.x = undefined;
    this.prevY = undefined;
    this.prevX = undefined;
    this.squareContainsPiece = false;
    this.pieceMoved = false;
    this.validMove = false;
    this.safeSpace = false;
    this.pieceType = "";
    this.check = false;
}
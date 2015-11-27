"use strict";
// this file is responsible for the data structure of the pieces and the board
var ChessPiece = function ChessPiece(name, pieceType, colour, col, row) {
	this.name = name;
	this.pieceType = pieceType;
   	this.color = colour;
  	this.col = col;
   	this.row = row;
	this.moveCount = 0;
	  
	// get a feeling this will be useful for multiple pieces 
	ChessPiece.prototype.hasPieceMoved = function() {
		if(this.moveCount !== 0) {
			return true;
		}	
	}	   
}

// define any constants here
var BoardLayout = function BoardLayout() {
	// declare 32 chess piece objects
	this.rookB1 = 		new ChessPiece("rB1", "rook", "black", 0, 0); 		// rook black 1
	this.knightB1 = 	new ChessPiece("nB1", "knight", "black", 1, 0);		// knight black 1
	this.bishopB1 = 	new ChessPiece("bB1", "bishop", "black", 2, 0);		// knight black 1
	this.queenB1 = 		new ChessPiece("qB1", "queen", "black", 3, 0);		// queen black 1
	this.kingB1 = 		new ChessPiece("kB1", "king", "black", 4, 0);		// queen black 1
	this.bishopB2 = 	new ChessPiece("bB2", "bishop", "black", 5, 0);		// bishop black 2
	this.knightB2 = 	new ChessPiece("nB2", "knight", "black", 6, 0);		// knight black 2
	this.rookB2 = 		new ChessPiece("rB2", "rook", "black", 7, 0);		// rook black 2
	
	this.pawnB1 = 		new ChessPiece("pB1", "pawn", "black", 0, 1);		// pawn black 1
	this.pawnB2 = 		new ChessPiece("pB2", "pawn", "black", 1, 1);		// pawn black 2
	this.pawnB3 = 		new ChessPiece("pB3", "pawn", "black", 2, 1);		// pawn black 3
	this.pawnB4 = 		new ChessPiece("pB4", "pawn", "black", 3, 1);		// pawn black 4
	this.pawnB5 = 		new ChessPiece("pB5", "pawn", "black", 4, 1);		// pawn black 5
	this.pawnB6 = 		new ChessPiece("pB6", "pawn", "black", 5, 1);		// pawn black 6
	this.pawnB7 = 		new ChessPiece("pB7", "pawn", "black", 6, 1);		// pawn black 7
	this.pawnB8 = 		new ChessPiece("pB8", "pawn", "black", 7, 1);		// pawn black 8
	
	this.pawnW1 = 		new ChessPiece("pW1", "pawn", "white", 0, 6);		// pawn white 1
	this.pawnW2 = 		new ChessPiece("pW2", "pawn", "white", 1, 6);		// pawn white 2
	this.pawnW3 = 		new ChessPiece("pW3", "pawn", "white", 2, 6);		// pawn white 3
	this.pawnW4 = 		new ChessPiece("pW4", "pawn", "white", 3, 6);		// pawn white 4
	this.pawnW5 = 		new ChessPiece("pW5", "pawn", "white", 4, 6);		// pawn white 5
	this.pawnW6 = 		new ChessPiece("pW6", "pawn", "white", 5, 6);		// pawn white 6
	this.pawnW7 = 		new ChessPiece("pW7", "pawn", "white", 6, 6);		// pawn white 7
	this.pawnW8 = 		new ChessPiece("pW8", "pawn", "white", 7, 6);		// pawn white 8
	
	this.rookW1 = 		new ChessPiece("rW1", "rook", "white", 0, 7); 		// rook white 1
	this.knightW1 = 	new ChessPiece("nW1", "knight", "white", 1, 7);		// knight white 1
	this.bishopW1 = 	new ChessPiece("bW1", "bishop", "white", 2, 7);		// knight white 1
	this.queenW1 = 		new ChessPiece("qW1", "queen", "white", 3, 7);		// queen white 1
	this.kingW1 = 		new ChessPiece("kW1", "king", "white", 4, 7);		// queen white 1
	this.bishopW2 = 	new ChessPiece("bW2", "bishop", "white", 5, 7);		// bishop white 2
	this.knightW2 = 	new ChessPiece("nW2", "knight", "white", 6, 7);		// knight white 2
	this.rookW2 = 		new ChessPiece("rW2", "rook", "white", 7, 7);		// rook white 2
	
	this.boardLayout = [
		[this.rookB1, this.knightB1, this.bishopB1, this.queenB1, this.kingB1, this.bishopB2, this.knightB2, this.rookB2],
		[this.pawnB1, this.pawnB2, this.pawnB3, this.pawnB4, this.pawnB5, this.pawnB6, this.pawnB7, this.pawnB8],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[this.pawnW1, this.pawnW2, this.pawnW3, this.pawnW4, this.pawnW5, this.pawnW6, this.pawnW7, this.pawnW8],
		[this.rookW1, this.knightW1, this.bishopW1, this.queenW1, this.kingW1, this.bishopW2, this.knightW2, this.rookW2]
	];

	BoardLayout.prototype.updateBoard = function(fromY, fromX, toY, toX) {
		
	}
}








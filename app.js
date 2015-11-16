"use strict";

var ChessBoard = function ChessBoard(canvas) {
	this.canvas = canvas; 
	this.context = this.canvas.getContext('2d');
	this.width = canvas.width;
	this.height = canvas.height;
	this.rows = 8;
	this.columns = 8;
	this.squareWidth = (this.width) / this.columns;
	this.squareHeight = (this.height)  / this.rows;


	ChessBoard.prototype.drawBoard = function() {
		for(var row = 0; row < 8; row++) {
			for(var column = 0; column < 8; column++) {
				if(this.alternativeSquare(row,column)) {
					// only actually need to fill in alternative squares
					this.colourSquare('#6d6a6a', row * this.squareWidth, column * this.squareHeight)	
				}
				// pseudo else, if not an alternative square, just leave it as white, no need to do anything
			}
		}	
	};

	ChessBoard.prototype.colourSquare = function(colour, x, y) {
		this.context.fillStyle = colour;
		this.context.fillRect(x, y, this.squareWidth, this.squareHeight)
	};

	ChessBoard.prototype.alternativeSquare = function(row, column) {
		return (this.checkIfEven(row) && !this.checkIfEven(column)) || // even row, odd column OR
            (!this.checkIfEven(row) && this.checkIfEven(column)) // odd row, even column
	};

	ChessBoard.prototype.checkIfEven = function(number) {
		return number == 0 || number % 2 == 0;
	};
};


var ChessPiece = function ChessPiece(pathToImage, chessBoardObject, x, y) {
	
	this.pieceImage = new Image();
	this.pieceImage.src = pathToImage;

	// Centering the Chess Piece in its current square:
	// ChessPiece takes up 90% of available square
	this.imageWidth = (chessBoardObject.squareWidth / 100) * 94;
	this.imageHeight = (chessBoardObject.squareHeight / 100) * 94;

	// puts a 5% margin around the piece
	this.xIncrement = (chessBoardObject.squareWidth / 100) * 3;
	this.yIncrement = (chessBoardObject.squareHeight / 100) * 3;

	chessBoardObject.context.drawImage(this.pieceImage, x * chessBoardObject.squareWidth, y * chessBoardObject.squareHeight,
	 this.imageWidth, this.imageHeight);	

	// isMoveValid?

	// each individual piece inherits?
}

var Square = function Square() {
	// Piece object
	//Square(piece)
}

var Game = function Game() {
	// Player object, we need 2 (black and white)
	// ChessBoard object?

	// methods
	// gameOver()
	// getPiece()
	// move()
}

var Render = function Render() {

	Render.prototype.drawBoard = function() {
		
		var chessBoard = new ChessBoard(document.getElementById('game'));
		chessBoard.drawBoard();

		// pass the chessboard object so we know where to place the pieces
		for(var row = 0; row < 8; row++) {
			for(var column = 0; column < 8; column++) {
				switch(boardLayout[row][column]) {
					case 'rB':  // black rook
						var rookB = new ChessPiece('img/Black R.png', chessBoard,
													column, row);
						break;
					case 'nB':  // black knight
						var knightB = new ChessPiece('img/Black N.png', chessBoard,
													column, row);
						break;
					case 'bB':  // black bishop
						var bishopB = new ChessPiece('img/Black B.png', chessBoard,
													column, row);
						break;
					case 'qB':  // black queen
						var queenB = new ChessPiece('img/Black Q.png', chessBoard,
													column, row);
						break;
					case 'kB':  // black king
						var kingB = new ChessPiece('img/Black K.png', chessBoard,
													column, row);
						break;
					case 'pB':  // black pawn
						var pawnB = new ChessPiece('img/Black P.png', chessBoard,
													column, row);
						break;
					case '':  // nothing
						break;
					case 'pW':  // white pawn
						var pawnW = new ChessPiece('img/White P.png', chessBoard,
													column, row);
						break;
					case 'rW':  // white rook
						var rookW = new ChessPiece('img/White R.png', chessBoard,
													column, row);
						break;
					case 'nW':  // white rook
						var knightW = new ChessPiece('img/White N.png', chessBoard,
													column, row);
						break;
					case 'bW':  // white rook
						var bishopW = new ChessPiece('img/White B.png', chessBoard,
													column, row);
						break;
					case 'kW':  // white rook
						var kingW = new ChessPiece('img/White K.png', chessBoard,
													column, row);
						break;
					case 'qW':  // white rook
						var queenW = new ChessPiece('img/White Q.png', chessBoard,
													column, row);
						break;
				default:
					console.log('something went wrong drawing chess pieces');
				}
			}
		}
		//var rookB1 = new ChessPiece('img/Black R.png', chessBoard);
	}
}

// #5A3336

// "<a href="https://commons.wikimedia.org/wiki/File:Chess_kdt45.svg#/media/File:Chess_kdt45.svg">Chess kdt45</a>" by <a href="//en.wikipedia.org/wiki/User:Cburnett" class="extiw" title="en:User:Cburnett">en:User:Cburnett</a> - <span class="int-own-work" lang="en">Own work</span><a href="//commons.wikimedia.org/wiki/File:Inkscape_Logo.svg" title="File:Inkscape Logo.svg"></a>This <a href="//en.wikipedia.org/wiki/Vector_images" class="extiw" title="w:Vector images">vector image</a> was created with <a href="//commons.wikimedia.org/wiki/Help:Inkscape" title="Help:Inkscape">Inkscape</a>.. Licensed under <a href="http://creativecommons.org/licenses/by-sa/3.0/" title="Creative Commons Attribution-Share Alike 3.0<p></p>">CC BY-SA 3.0</a> via <a href="//commons.wikimedia.org/wiki/">Wikimedia Commons</a>.
// Chess Pieces ^^

$(document).ready(function() {

	var render = new Render();
	setInterval(render.drawBoard, 50); // No need to render superfast on a chess game??
	render.drawBoard();

}); // jQuery ready

"use strict";

$(document).ready(function() {

var ChessBoard = function ChessBoard(canvas) {
	this.canvas = canvas; 
	this.context = this.canvas.getContext('2d');
	this.width = canvas.width;
	this.height = canvas.height;
	this.rows = 8;
	this.columns = 8;
	this.widthIncrement = (this.width) / this.columns;
	this.heightIncrement = (this.height)  / this.rows;


	ChessBoard.prototype.drawBoard = function() {
		for(var row = 0; row < 8; row++) {
			for(var column = 0; column < 8; column++) {
				if(this.alternativeSquare(row,column)) {
					// only actually need to fill in alternative squares
					this.colourSquare('#C5C8C9', row * this.widthIncrement, column * this.heightIncrement)	
				}
				// pseudo else, if not an alternative square, just leave it as white, no need to do anything
			}
		}	
	};

	ChessBoard.prototype.colourSquare = function(colour, x, y) {
		this.context.fillStyle = colour;
		this.context.fillRect(x, y, this.widthIncrement, this.heightIncrement)
	};

	ChessBoard.prototype.alternativeSquare = function(row, column) {
		return (this.checkIfEven(row) && !this.checkIfEven(column)) || // even row, odd column OR
            (!this.checkIfEven(row) && this.checkIfEven(column)) // odd row, even column
	};

	ChessBoard.prototype.checkIfEven = function(number) {
		return number == 0 || number % 2 == 0;
	};
};


var ChessPiece = function ChessPiece(pathToImage, chessBoardObject) {
	
	this.pieceImage = new Image();
	this.pieceImage.src = pathToImage;

	// Centering the Chess Piece in its current square:
	// ChessPiece takes up 90% of available square
	this.imageWidth = (chessBoardObject.widthIncrement / 100) * 90;
	this.imageHeight = (chessBoardObject.heightIncrement / 100) * 90;

	// puts a 5% margin around the piece
	this.xIncrement = (chessBoardObject.widthIncrement / 100) * 5;
	this.yIncrement = (chessBoardObject.heightIncrement / 100) * 5;

	chessBoardObject.context.drawImage(this.pieceImage, this.xIncrement, this.yIncrement,
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
		var rookB1 = new ChessPiece('img/Black R.png', chessBoard);
	}
}

// #5A3336

// "<a href="https://commons.wikimedia.org/wiki/File:Chess_kdt45.svg#/media/File:Chess_kdt45.svg">Chess kdt45</a>" by <a href="//en.wikipedia.org/wiki/User:Cburnett" class="extiw" title="en:User:Cburnett">en:User:Cburnett</a> - <span class="int-own-work" lang="en">Own work</span><a href="//commons.wikimedia.org/wiki/File:Inkscape_Logo.svg" title="File:Inkscape Logo.svg"></a>This <a href="//en.wikipedia.org/wiki/Vector_images" class="extiw" title="w:Vector images">vector image</a> was created with <a href="//commons.wikimedia.org/wiki/Help:Inkscape" title="Help:Inkscape">Inkscape</a>.. Licensed under <a href="http://creativecommons.org/licenses/by-sa/3.0/" title="Creative Commons Attribution-Share Alike 3.0<p></p>">CC BY-SA 3.0</a> via <a href="//commons.wikimedia.org/wiki/">Wikimedia Commons</a>.
// Chess Pieces ^^

var render = new Render();
setInterval(render.drawBoard, 50); // No need to render superfast on a chess game
render.drawBoard();

}); // jQuery ready

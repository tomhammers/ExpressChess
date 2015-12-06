"use strict";
// Responsible for drawing the chessboard and handling click events on the board
var ChessBoard = function ChessBoard(canvas) {
	this.canvas = canvas;
	this.context = this.canvas.getContext('2d');

	this.canvas.width = (window.innerWidth / 100) * 30;
	this.canvas.height = this.canvas.width; // keeps everything square
	this.width = this.canvas.width;
	this.height = this.canvas.height;

	this.rows = 8;
	this.columns = 8;

	this.squareHeight = this.height / this.rows;
	this.squareWidth = this.width / this.columns;

	this.canvasX; 				// x co-ordinate of a click
	this.canvasY; 				// y co-ordinate of a click
	this.squareClickedX;		// can use canvasX and canvas Y
	this.squareClickedY;		// to get X and Y coords of square clicked

	this.prevSquareClickedX;	// used after user clicks a new square ~
	this.prevSquareClickedY;	// 				redraw the old square
	
	this.selectedPiece; 		// what did the user click on?

	ChessBoard.prototype.drawBoard = function () {
		for (var row = 0; row < 8; row++) {
			for (var column = 0; column < 8; column++) {
				this.drawSquare(row, column);
			}
		}
	};

	// this was in drawBoard, this is better since this code can be reused on click events
	ChessBoard.prototype.drawSquare = function (row, column) {
		if (this.squareClickedX === row && this.squareClickedY === column) {
			this.colourSquare('yellow', row * this.squareWidth, column * this.squareHeight);
		} else if (this.alternativeSquare(row, column)) {
			this.colourSquare('#6d6a6a', row * this.squareWidth, column * this.squareHeight);
		} else {
			this.colourSquare('white', row * this.squareWidth, column * this.squareHeight);
		}
	}

	ChessBoard.prototype.colourSquare = function (colour, x, y) {
		this.context.fillStyle = colour;
		this.context.fillRect(x, y, this.squareWidth, this.squareHeight)
	};

	ChessBoard.prototype.alternativeSquare = function (row, column) {
		return (this.checkIfEven(row) && !this.checkIfEven(column)) || // even row, odd column OR
            (!this.checkIfEven(row) && this.checkIfEven(column)) // odd row, even column
	};

	ChessBoard.prototype.checkIfEven = function (number) {
		return number == 0 || number % 2 == 0;
	};

	ChessBoard.prototype.squareClicked = function (event) {
		// note the need to minus the canvas offset from the main window or we get wrong co-ords
		this.canvasX = event.pageX - this.canvas.offsetLeft - 5; // where user clicked - canvas offset - border
		this.canvasY = event.pageY - this.canvas.offsetTop - 5;
		this.squareClickedX = Math.ceil(this.canvasX / this.squareWidth) - 1; // -1 to count from 0
		this.squareClickedY = Math.ceil(this.canvasY / this.squareHeight) - 1;
	};

	ChessBoard.prototype.prevSquareClicked = function (x, y) {
		// co-ord / square width rounded up = square clicked
		this.prevSquareClickedX = Math.ceil(this.canvasX / this.squareWidth) - 1; // -1 to count from 0
		this.prevSquareClickedY = Math.ceil(this.canvasY / this.squareHeight) - 1;
	};

	// listen for mouse clicks on the canvas
	this.canvas.addEventListener("mousedown", this.squareClicked.bind(this), false); // need to bind "this" or the click event will become "this"!
	// on mouse up copy square clicked so it can be redrawn on the next click
	this.canvas.addEventListener("mouseup", this.prevSquareClicked.bind(this), false);
};

// Attributes of a chess piece image and a method to draw a chess piece
var ChessPieceImage = function ChessPieceImage(pathToImage, chessBoardObject, x, y) {

	this.pieceImage = new Image();
	// ChessPiece takes up 94% of available square, I've done this to keep my chessboard responsive
	this.imageWidth = (chessBoardObject.squareWidth / 100) * 94;
	this.imageHeight = (chessBoardObject.squareHeight / 100) * 94;
	// problem with above solution, do pieces look right at higher resolutions? 

	// puts a 3% margin around the piece, should center the piece in its square
	// these are added to the x and y coordinates in drawImage below
	this.xMargin = (chessBoardObject.squareWidth / 100) * 3;
	this.yMargin = (chessBoardObject.squareHeight / 100) * 3;

	// x === to the index in the row for loop in the Render object which is passed to this method
	// y === to the index in the column for loop in the Render object which is passed to this method
	// multiplying x or y by the squareWidth/height should give the correct x and y coordinates
	ChessPieceImage.prototype.drawPiece = function () {
		chessBoardObject.context.drawImage(this.pieceImage, (x * chessBoardObject.squareWidth) + this.xMargin, // x co-ordinate
			(y * chessBoardObject.squareHeight) + this.yMargin, // y co-ordinate
			this.imageWidth, this.imageHeight);	 // image width + height defined above
	}
	this.pieceImage.src = pathToImage;
	// Check image has been loaded before trying to draw it	
	this.pieceImage.addEventListener('load', this.drawPiece.bind(this), false);
}
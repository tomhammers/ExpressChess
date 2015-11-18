// This file is responsible for rendering the chessboard
"use strict";
var ChessBoard = function ChessBoard(canvas) {
	this.canvas = canvas; 
	this.context = this.canvas.getContext('2d');

	this.canvas.width = (window.innerWidth / 100) * 50;
	this.canvas.height = this.canvas.width; // keeps everything square
	this.width = this.canvas.width;
	this.height = this.canvas.height;

	this.rows = 8;
	this.columns = 8;

	this.squareWidth = (this.width) / this.columns;
	this.squareHeight = (this.height)  / this.rows;

	this.canvasX; // x co-ordinate of a click
	this.canvasY; // y co-ordinate of a click
	this.squareClickedX;
	this.squareClickedY;



	ChessBoard.prototype.drawBoard = function() {
		for(var row = 0; row < 8; row++) {
			for(var column = 0; column < 8; column++) {

				if(this.alternativeSquare(row,column)) {
					// only actually need to fill in alternative squares

					this.colourSquare('#6d6a6a', row * this.squareWidth, column * this.squareHeight);	
					//console.log(this.canvasX);
				}
				// pseudo else, gives illusion of white squares being rendered but no need to actually do anything
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


	ChessBoard.prototype.assignClickCoordinates = function(event) {
		// note the need to minus the canvas offset from the main window or we get wrong co-ords
		this.canvasX = event.pageX - this.canvas.offsetLeft - 5; 
		this.canvasY = event.pageY - this.canvas.offsetTop;
		console.log('clicked at x: ' + this.canvasX + " and y: " + this.canvasY);
		// now we have click co-ords, use some maths to work out which square was clicked
		this.squareClicked(this.canvasX, this.canvasY);

	}

	ChessBoard.prototype.squareClicked = function(x, y) {
		this.squareClickedX = Math.ceil(x / this.squareWidth) - 1;
		this.squareClickedY = Math.ceil(y / this.squareHeight) - 1;
		console.log("Clicked on column: " + this.squareClickedX + " and row " + this.squareClickedY);
		this.colourSquare('yellow', this.squareClickedX * this.squareWidth, this.squareClickedY * this.squareHeight);
	}

	// listen for mouse clicks on the canvas
	this.canvas.addEventListener("mousedown", this.assignClickCoordinates.bind(this), false); // need to bind "this" or the click event will become "this"!

};


var ChessPiece = function ChessPiece(pathToImage, chessBoardObject, x, y) {
	
	this.pieceImage = new Image();
	
	this.pieceImage.src = pathToImage;

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
	ChessPiece.prototype.drawPiece = function() {
		chessBoardObject.context.drawImage(this.pieceImage, (x * chessBoardObject.squareWidth) + this.xMargin, // x co-ordinate
															(y * chessBoardObject.squareHeight) + this.yMargin, // y co-ordinate
		 													this.imageWidth, this.imageHeight);	 // image width + height defined above

	}	
	this.pieceImage.addEventListener('load', this.drawPiece.bind(this) , false);

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

	Render.prototype.drawBoard = function(chessBoardObject) {
		
		//var chessBoard = new ChessBoard(document.getElementById('game'));
		chessBoardObject.drawBoard();
		console.log(chessBoardObject);
	}

	Render.prototype.drawPieces = function(chessBoardObject) {


		// pass the chessboard object so we know where to place the pieces
		for(var row = 0; row < 8; row++) {
			for(var column = 0; column < 8; column++) {
				// Initial boardlayout is declared in define.js
				switch(boardLayout[row][column]) {
					case 'rB':  // black rook
						var rookB = new ChessPiece('img/Black R.png', chessBoardObject, column, row);
						console.log(column + " " + row);
						break;
					case 'nB':  // black knight
						var knightB = new ChessPiece('img/Black N.png', chessBoardObject, column, row);
						break;
					case 'bB':  // black bishop
						var bishopB = new ChessPiece('img/Black B.png', chessBoardObject, column, row);
						break;
					case 'qB':  // black queen
						var queenB = new ChessPiece('img/Black Q.png', chessBoardObject, column, row);
						break;
					case 'kB':  // black king
						var kingB = new ChessPiece('img/Black K.png', chessBoardObject, column, row);
						break;
					case 'pB':  // black pawn
						var pawnB = new ChessPiece('img/Black P.png', chessBoardObject, column, row);
						break;
					case '':  // nothing
						break; // do nothing
					case 'pW':  // white pawn
						var pawnW = new ChessPiece('img/White P.png', chessBoardObject, column, row);
						break;
					case 'rW':  // white rook
						var rookW = new ChessPiece('img/White R.png', chessBoardObject, column, row);
						break;
					case 'nW':  // white knight
						var knightW = new ChessPiece('img/White N.png', chessBoardObject, column, row);
						break;
					case 'bW':  // white bishop
						var bishopW = new ChessPiece('img/White B.png', chessBoardObject, column, row);
						break;
					case 'qW':  // white queen
						var queenW = new ChessPiece('img/White Q.png', chessBoardObject, column, row);
						break;
					case 'kW':  // white king
						var kingW = new ChessPiece('img/White K.png', chessBoardObject, column, row);
						break;
					
				default:
					console.log('something went wrong drawing chess pieces');
				}
			}
		}
	}
	

	
}
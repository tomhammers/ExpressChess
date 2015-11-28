"use strict";
// Responsible for drawing the chessboard and handling click events on the board
var ChessBoard = function ChessBoard(canvas) {
	this.canvas = canvas;
	this.context = this.canvas.getContext('2d');

	this.canvas.width = (window.innerWidth / 100) * 50;
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

// what I will call everytime I want to draw something
var Render = function Render(boardLayoutObject) {

	this.selectedPiece;

	// method just to call another method?
	Render.prototype.drawBoard = function (chessBoardObject) {
		chessBoardObject.drawBoard();
	}

	// Draw everything in the global boardLayout array
	Render.prototype.drawPieces = function (chessBoardObject) {
		// pass the chessboard object so we know where to place the pieces
		for (var row = 0; row < 8; row++) {
			for (var column = 0; column < 8; column++) {
				this.drawPiece(chessBoardObject, row, column);
			}
		}
	}
	
	// this code used to be part of drawPieces method
	// but now this code can be reused on click events (used in drawSquare)
	Render.prototype.drawPiece = function (chessBoardObject, row, column) {
		// take advantage of the "fallthrough" feature in js switch case to draw the piece
		switch (boardLayoutObject.boardLayout[row][column]) {
			case boardLayoutObject.rookB1:  	// black rook1
			case boardLayoutObject.rookB2:  	// black rook2
				var rookB = new ChessPieceImage('img/Black R.png', chessBoardObject, column, row);
				break;
			case boardLayoutObject.knightB1:  	// black knight1
			case boardLayoutObject.knightB2:  	// black knight2
				var knightB = new ChessPieceImage('img/Black N.png', chessBoardObject, column, row);
				break;
			case boardLayoutObject.bishopB1:  	// black bishop1
			case boardLayoutObject.bishopB2:  	// black bishop2
				var bishopB = new ChessPieceImage('img/Black B.png', chessBoardObject, column, row);
				break;
			case boardLayoutObject.queenB1:  	// black queen
				var queenB = new ChessPieceImage('img/Black Q.png', chessBoardObject, column, row);
				break;
			case boardLayoutObject.kingB1:  	// black king
				var kingB = new ChessPieceImage('img/Black K.png', chessBoardObject, column, row);
				break;
			case boardLayoutObject.pawnB1:  	// black pawn1
			case boardLayoutObject.pawnB2:  	// black pawn2
			case boardLayoutObject.pawnB3:  	// black pawn3
			case boardLayoutObject.pawnB4:  	// black pawn4
			case boardLayoutObject.pawnB5:  	// black pawn5
			case boardLayoutObject.pawnB6:  	// black pawn6
			case boardLayoutObject.pawnB7:  	// black pawn7
			case boardLayoutObject.pawnB8:  	// black pawn8
				var pawnB = new ChessPieceImage('img/Black P.png', chessBoardObject, column, row);
				break;
			case null:  // do nothing
				break; // do nothing
			case boardLayoutObject.pawnW1:  	// white pawn1
			case boardLayoutObject.pawnW2:  	// white pawn2
			case boardLayoutObject.pawnW3:  	// white pawn3
			case boardLayoutObject.pawnW4:  	// white pawn4
			case boardLayoutObject.pawnW5:  	// white pawn5
			case boardLayoutObject.pawnW6:  	// white pawn6
			case boardLayoutObject.pawnW7:  	// white pawn7
			case boardLayoutObject.pawnW8:  	// white pawn8
				var pawnW = new ChessPieceImage('img/White P.png', chessBoardObject, column, row);
				break;
			case boardLayoutObject.rookW1:  	// white rook1
			case boardLayoutObject.rookW2:  	// white rook2
				var rookW = new ChessPieceImage('img/White R.png', chessBoardObject, column, row);
				break;
			case boardLayoutObject.knightW1:  	// white knight1
			case boardLayoutObject.knightW2:  	// white knight2
				var knightW = new ChessPieceImage('img/White N.png', chessBoardObject, column, row);
				break;
			case boardLayoutObject.bishopW1:  	// white bishop1
			case boardLayoutObject.bishopW2:	// white bishop2
				var bishopW = new ChessPieceImage('img/White B.png', chessBoardObject, column, row);
				break;
			case boardLayoutObject.queenW1:  	// white queen
				var queenW = new ChessPieceImage('img/White Q.png', chessBoardObject, column, row);
				break;
			case boardLayoutObject.kingW1:  	// white king
				var kingW = new ChessPieceImage('img/White K.png', chessBoardObject, column, row);
				break;
			default:
				// I hope this never happens
				console.log('something went wrong drawing chess pieces');
		}
	}

	Render.prototype.drawSquare = function (chessBoardObject) {
		// firstly highlight the square the user clicked on
		// future me - update so only highlights on users pieces
		chessBoardObject.drawSquare(chessBoardObject.squareClickedX, chessBoardObject.squareClickedY);

		// now just redraw the selected piece
		this.drawPiece(chessBoardObject, chessBoardObject.squareClickedY, chessBoardObject.squareClickedX);
	}

	Render.prototype.drawPreviousSquare = function (chessBoardObject) {
		// When user clicks
		// future me - update so only highlights on users pieces
		// on first click of move there will be no value for prevSquareClicked, check for it:
		if (typeof chessBoardObject.prevSquareClickedX !== "undefined") {
			// now draw square
			chessBoardObject.drawSquare(chessBoardObject.prevSquareClickedX, chessBoardObject.prevSquareClickedY);
			// now just redraw the previously selected piece
			this.drawPiece(chessBoardObject, chessBoardObject.prevSquareClickedY, chessBoardObject.prevSquareClickedX);
		}
	}

	

	Render.prototype.getPieceClicked = function (boardLayoutObject, chessBoardObject) {
		// if (boardLayoutObject.boardLayout[chessBoardObject.squareClickedY][chessBoardObject.squareClickedX] !== null) {
		// 	this.selectedPiece = boardLayoutObject.boardLayout[chessBoardObject.squareClickedY][chessBoardObject.squareClickedX];
		// 	console.log(this.selectedPiece);
		// } else {
		// 	this.selectedPiece = null;
		// }
		// only try to move piece if a prev square has been clicked
		// if (typeof chessBoardObject.prevSquareClickedX !== "undefined" && typeof chessBoardObject.prevSquareClickedY !== "undefined") {
		// 	this.movePiece(boardLayoutObject, chessBoardObject);
		// }
		
		this.selectedPiece = boardLayoutObject.boardLayout[chessBoardObject.prevSquareClickedY][chessBoardObject.prevSquareClickedX];
			
		
	};
	
	

	Render.prototype.movePiece = function (boardLayoutObject, chessBoardObject) {
		// only can move to an empty square
		// major rework here later!!
		if (boardLayoutObject.boardLayout[chessBoardObject.squareClickedY][chessBoardObject.squareClickedX] === null) {
			boardLayoutObject.boardLayout[chessBoardObject.prevSquareClickedY][chessBoardObject.prevSquareClickedX] = null;
			boardLayoutObject.boardLayout[chessBoardObject.squareClickedY][chessBoardObject.squareClickedX] = this.selectedPiece;
			console.log(boardLayoutObject.boardLayout[chessBoardObject.squareClickedY][chessBoardObject.squareClickedX]);
		} 
		// clear out selected piece ready for next move
		this.selectedPiece = "";
	};
	
	Render.prototype.endMove = function (chessBoardObject) {
		// chessBoardObject.prevprevSquareClickedX = "undefined";
		// chessBoardObject.prevprevSquareClickedY = "undefined";
		// this.drawSquare(chessBoardObject);
	}
}
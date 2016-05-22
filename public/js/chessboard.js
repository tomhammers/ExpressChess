"use strict";
// Responsible for drawing the chessboard and handling click events on the board
var ChessBoard = function ChessBoard(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');

    // width of the parent div ~ a flexible bootstrap column
    this.canvas.width = $(canvas).parent().width();
    this.canvas.height = this.canvas.width; // keeps everything square
    // width and height of the chessboard
    this.width = (this.canvas.width / 100) * 92;
    this.height = this.width;
    // border width
    this.borderWidth = (this.canvas.width / 100) * 4;

    this.rows = 8;
    this.columns = 8;

    this.squareHeight = this.height / this.rows;
    this.squareWidth = this.width / this.columns;

    this.canvasX = 0; 				// x co-ordinate of a click
    this.canvasY = 0; 				// y co-ordinate of a click
    this.squareClickedX = -1;		// can use canvasX and canvas Y
    this.squareClickedY = -1;		// to get X and Y coords of square clicked

    this.prevSquareClickedX = -1;	// used after user clicks a new square ~
    this.prevSquareClickedY = -1;	// redraw the old square
	
    this.selectedPiece; 		    // what did the user click on?
	
    this.validFirstClick = false;

    ChessBoard.prototype.drawBoard = function () {
        for (var row = 0; row < 8; row++) {
            for (var column = 0; column < 8; column++) {
                this.drawSquare(row, column);
            }
        }
    };

    // this was in drawBoard, this is better since this code can be reused on click events
    ChessBoard.prototype.drawSquare = function (row, column) {
        if (this.validFirstClick) {
            this.colourSquare('yellow', row * this.squareWidth + this.borderWidth, column * this.squareHeight + this.borderWidth);
        } else if (this.alternativeSquare(row, column)) {
            this.colourSquare('#6d6a6a', row * this.squareWidth + this.borderWidth, column * this.squareHeight + this.borderWidth);
        } else {
            this.colourSquare('white', row * this.squareWidth + this.borderWidth, column * this.squareHeight + this.borderWidth);
        }
        this.drawChessBorder();
    }

    ChessBoard.prototype.drawChessBorder = function () {
        // basicly just draw a square by calculating each corner of the chessboard
        this.context.beginPath();
        this.context.moveTo(this.borderWidth, this.borderWidth);                                // top left corner
        this.context.lineTo(this.width + this.borderWidth, this.borderWidth);                   // top right corner
        this.context.lineTo(this.width + this.borderWidth, this.height + this.borderWidth);     // bottom right corner
        this.context.lineTo(this.borderWidth, this.height + this.borderWidth);                  // bottom left corner
        this.context.lineTo(this.borderWidth, this.borderWidth);                                // top left corner
        this.context.stroke();
    }

    ChessBoard.prototype.colourSquare = function (colour, x, y) {
        this.context.fillStyle = colour;
        this.context.fillRect(x, y, this.squareWidth, this.squareHeight)
    };

    ChessBoard.prototype.printChessCoords = function (colourPieces) {
        var char = 'a';
        var wnum = 8;
        var bnum = 1;
        this.context.font = "bold 12px Arial";
        this.context.fillStyle = "black";
        for (var i = 0; i < 8; i++) {
            // files across the top (letters)
            this.context.fillText(char, i * this.squareWidth + this.borderWidth + this.squareWidth / 2, this.borderWidth - 5);
            // files across the bottom (letters)
            this.context.fillText(char, i * this.squareWidth + this.borderWidth + this.squareWidth / 2, this.borderWidth + this.height + (this.borderWidth / 100 * 75));
            char = nextChar(char);
            if (colourPieces === "white") {
                // rank down left hand side (numbers)
                this.context.fillText(wnum, this.borderWidth / 2, i * this.squareHeight + this.borderWidth + this.squareHeight / 2);
                // rank down right hand side (numbers)
                this.context.fillText(wnum, this.borderWidth + this.width + (this.borderWidth / 100 * 20), i * this.squareHeight + this.borderWidth + this.squareHeight / 2);
                wnum--;
            } 
            else {
                // flip numbers around for black
                this.context.fillText(bnum, this.borderWidth / 2, i * this.squareHeight + this.borderWidth + this.squareHeight / 2);
                this.context.fillText(bnum, this.borderWidth + this.width + (this.borderWidth / 100 * 20), i * this.squareHeight + this.borderWidth + this.squareHeight / 2);
                bnum++;
            }
        }
        
        // increment letters, found here http://stackoverflow.com/questions/12504042/what-is-a-method-that-can-be-used-to-increment-letters
        function nextChar(c) {
            return String.fromCharCode(c.charCodeAt(0) + 1);
        }
    }

    ChessBoard.prototype.alternativeSquare = function (row, column) {
        return (this.checkIfEven(row) && !this.checkIfEven(column)) || // even row, odd column OR
            (!this.checkIfEven(row) && this.checkIfEven(column)) // odd row, even column
    };

    ChessBoard.prototype.checkIfEven = function (number) {
        return number == 0 || number % 2 == 0;
    };

    ChessBoard.prototype.squareClicked = function (event) {
        // note the need to minus the canvas offset from the main window or we get wrong co-ords
        // to fix mouse offsets - got help from http://stackoverflow.com/questions/25934607/bootstrap-offset-and-html5-canvas
        this.canvasX = event.pageX - this.canvas.offsetLeft - $(this.canvas).parent().offset().left - this.borderWidth - 2; // where user clicked - canvas offset - canvasBorder - border
        this.canvasY = event.pageY - this.canvas.offsetTop - $(this.canvas).parent().offset().top - this.borderWidth - 2;
        this.squareClickedX = Math.ceil(this.canvasX / this.squareWidth) - 1; // -1 to count from 0
        this.squareClickedY = Math.ceil(this.canvasY / this.squareHeight) - 1;
    };
	
    // has the player clicked on their own piece on the FIRST click?
    ChessBoard.prototype.validClick = function (boardLayout, playerColour) {
        // if clicked on null square, will exit method and return false
        if (boardLayout.pieceLayout[this.squareClickedY][this.squareClickedX] !== null) {
            // will only return true if player clicked on their OWN piece on first click
            if (boardLayout.pieceLayout[this.squareClickedY][this.squareClickedX].color === playerColour) {
                this.validFirstClick = true;
            }
        }
    };
	
    // has the player clicked an empty square or on an oppenets piece?
    ChessBoard.prototype.checkSecondClick = function (boardLayout, playerColour) {
        if (boardLayout.pieceLayout[this.squareClickedY][this.squareClickedX] === null ||
            boardLayout.pieceLayout[this.squareClickedY][this.squareClickedX].color !== playerColour) {
            return true;
        }
    };
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
    this.xMargin = (chessBoardObject.squareWidth / 100) * 3 + chessBoardObject.borderWidth;
    this.yMargin = (chessBoardObject.squareHeight / 100) * 3 + chessBoardObject.borderWidth;

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
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
					this.colourSquare('#c9c9c9', row * this.widthIncrement, column * this.heightIncrement)
					// if (row === 0 || row ===1) {
					// 	context.fillText(265A, row, column);
					// }
				}
				// pseudo else, if not an alternative square, just leave it as white
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

var chessBoard = new ChessBoard(document.getElementById('game'));
chessBoard.drawBoard();

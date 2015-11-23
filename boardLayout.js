// define any constants here
var BoardLayout = function BoardLayout() {
	this.boardLayout = [
		['rB', 'nB', 'bB', 'qB', 'kB', 'bB', 'nB', 'rB'],
		['pB', 'pB', 'pB', 'pB', 'pB', 'pB', 'pB', 'pB'],
		["", "", "", "", "", "", "", ""],
		["", "", "", "", "", "", "", ""],
		["", "", "", "", "", "", "", ""],
		["", "", "", "", "", "", "", ""],
		['pW', 'pW', 'pW', 'pW', 'pW', 'pW', 'pW', 'pW'],
		['rW', 'nW', 'bW', 'qW', 'kW', 'bW', 'nW', 'rW']
	];

	BoardLayout.prototype.movePiece = function(fromRow, fromColumn, toRow, toColumn, piece) {
		this.boardLayout[fromRow][fromColumn] = "";
		this.boardLayout[toRow][toColumn] = piece;
	}
}











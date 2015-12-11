var Player = function Player() {
	this.turn = false;
	this.colourPieces = ""; // white, black or spectator
	this.winner = false;
	
	Player.prototype.assignColour = function(colour) {
		this.colourPieces = colour;
	}
	
}
var Player = function Player() {
	this.turn = false;
	this.colourPieces = ""; // white, black or spectator
	
	Player.prototype.assignColour = function(colour) {
		this.colourPieces = colour;
	}
	
}
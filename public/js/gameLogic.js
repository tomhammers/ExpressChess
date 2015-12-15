var GameLogic = function GameLogic(player, boardLayout, chessBoard) {
	this.player= player;
	this.boardLayout = boardLayout;
	this.chessBoard = chessBoard;
}

GameLogic.prototype.checkMove = function() {
	if (this.oppenentPiece()) {
		console.log("opp piece");
	}
	return true;
}

GameLogic.prototype.checkPawnMove = function() {
	return true;
}

// method to check if square contains oppenent piece
GameLogic.prototype.oppenentPiece = function() {
	var oppColour;
	if (this.player.colourPieces === "white") {
		oppColour = "black";
	} else { oppColour = "white"; }
	
	if(this.boardLayout.pieceLayout[this.chessBoard.squareClickedY][this.chessBoard.squareClickedX] !== null) {
		if(this.boardLayout.pieceLayout[this.chessBoard.squareClickedY][this.chessBoard.squareClickedX].colour === oppColour) {
			return true;
		}
	}
	return false;
	
}

var checkMove = function(row, col, prevRow, prevCol, boardLayout, colour) {
	// 
	
	// switch (piece) {
	// 	case "pawn":
	// 		if (colour === "white") {
				
	// 		} else {
				
	// 		}
	// }
	
	//checkPawn(row, col, prevCol, prevRow, boardLayout); 
	console.log(row);
	if (checkPawnMove(row, col, prevRow, prevCol, boardLayout)) {
		return true;
	}
}

function checkPawnMove(row, col, prevRow, prevCol, boardLayout) {

	if (boardLayout.pieceLayout[prevRow][prevCol].moveCount === 0) {
		if(boardLayout.pieceLayout[prevRow][prevCol].color === "white") {
			if(col === prevCol && row === prevRow - 1 || row === prevRow - 2) {
				boardLayout.pieceLayout[prevRow][prevCol].moveCount++
				return true;	
			}
			// checking for diagonal move to take a piece
			if(col === prevCol+1 || col === prevCol-1 && row === prevRow+1) {
				// does this square have oppenent piece?
				//if()
			}
			
		} else { // must be black (already checked for valid click)
			if(col === prevCol && row === prevRow + 1 || row === prevRow + 2) {
				boardLayout.pieceLayout[prevRow][prevCol].moveCount++
				return true;	
			}
		} 
			
	} else { // move count is 1 or more (doesn't matter how many any more)
		if(boardLayout.pieceLayout[prevRow][prevCol].color === "white") {
			if(col === prevCol && row === prevRow - 1) {
				boardLayout.pieceLayout[prevRow][prevCol].moveCount++
				return true;	
			}
			
		} else { // must be black (already checked for valid click)
			if(col === prevCol && row === prevRow + 1) {
				boardLayout.pieceLayout[prevRow][prevCol].moveCount++
				return true;	
			}
		} 	
	}	
}

// checks if square attempted to move to has oppenent piece
var oppenentPiece = function(row, col) {
	boardLayout.pieceLayout[row][col]
}


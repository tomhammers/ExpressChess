// ChessPiece lives in BoardLayout.js
describe("ChessPiece", function () {
    var chessPiece;
    beforeEach(function () {
        chessPiece = new ChessPiece("rB1", "rook", "black"); // before test create a new object
    });

    it("this particular ChessPiece object should have the following attributes: rB1, rook, black and 0", function () {
        expect(chessPiece.name).toEqual("rB1");
        expect(chessPiece.pieceType).toEqual("rook");
        expect(chessPiece.color).toEqual("black");
        expect(chessPiece.moveCount).toEqual(0);
    });
});




var boardLayout;
describe("BoardLayout", function () {

    beforeEach(function () {
        boardLayout = new BoardLayout(); // before test create a new object
    });

    it("pieceLayout multi dimensional array to consist of 16 objects and 16 nulls", function () {
        expect(boardLayout.pieceLayout).toBeDefined();
        // outer array should be 8 in length
        expect(boardLayout.pieceLayout.length).toEqual(8);
        // there should be null objects in the array
        expect(boardLayout.pieceLayout).toContain(jasmine.objectContaining(null));
    });
});





var chessBoard;
describe("ChessBoard", function () {
    beforeEach(function () {
        chessBoard = new ChessBoard("game"); // before test create a new object
    });
    
    // it("Canvas and context are defined", function() {
    //    expect(chessBoard.canvas).toBeDefined(); 
    // });
    
    // it("should draw on the canvas", function () {
    //     var context = jasmine.createSpyObj('context', ['arc', 'stroke']);
    //     chessBoard.draw(context);
    //     expect(context.arc).toHaveBeenCalledWith(47, 32, 10, 0, 2 * Math.PI)
    //     expect(context.stroke).toHaveBeenCalled();
    // });
});






var player;
describe("Player", function () {
    beforeEach(function () {
        player = new Player(); // before test create a new object
    });

    it("Correctly initialises players turn to false", function () {
        expect(player.turn).toBeFalsy();
    });
    it("Correctly initialises colour of pieces to an empty string", function () {
        expect(player.colourPieces).toEqual('');
    });
    it("Correctly initialises winner to false", function () {
        expect(player.winner).toBeFalsy();
    });
});







// remaining tests are for gameLogic.js
describe("GameLogic", function () {
    var gameLogic;
    beforeEach(function () {
        gameLogic = new GameLogic(player, boardLayout, chessBoard); // before test create a new object
    });

    it("contains a player variable", function () {
        expect(gameLogic.player).toBeDefined();
    });

    it("contains a boardLayout variable", function () {
        expect(gameLogic.boardLayout).toBeDefined();
    });

    it("checkMove method", function () {
        expect(gameLogic.checkMove).toBeDefined();
        //expect(gameLogic.checkMove(5, 1, 6, 1, "pawn")).toBeTruthy();
    });
});

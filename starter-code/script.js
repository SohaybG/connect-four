const board = {
    pieces: [],
    columns: []
};

// Ongoing test board
// const board = {
//     pieces: [
//         {
//             "player": "player_one",
//             "column": 2,
//             "row": 1
//         },
//         {
//             "player": "player_one",
//             "column": 2,
//             "row": 2
//         },
//         {
//             "player": "player_two",
//             "column": 2,
//             "row": 3
//         },
//         {
//             "player": "player_two",
//             "column": 3,
//             "row": 1
//         },
//         {
//             "player": "player_one",
//             "column": 3,
//             "row": 2
//         },
//         {
//             "player": "player_one",
//             "column": 4,
//             "row": 1
//         },
//         {
//             "player": "player_two",
//             "column": 4,
//             "row": 2
//         },
//         {
//             "player": "player_one",
//             "column": 4,
//             "row": 3
//         },
//         {
//             "player": "player_two",
//             "column": 5,
//             "row": 1
//         }
//     ],
//     columns: []
// }

// hasWon test board
// const board = {
//     pieces: [
//         {
//             "player": "player_one",
//             "column": 2,
//             "row": 1
//         },
//         {
//             "player": "player_one",
//             "column": 2,
//             "row": 2
//         },
//         {
//             "player": "player_two",
//             "column": 2,
//             "row": 3
//         },
//         {
//             "player": "player_two",
//             "column": 3,
//             "row": 1
//         },
//         {
//             "player": "player_one",
//             "column": 3,
//             "row": 2
//         },
//         {
//             "player": "player_one",
//             "column": 4,
//             "row": 1
//         },
//         {
//             "player": "player_two",
//             "column": 4,
//             "row": 2
//         },
//         {
//             "player": "player_one",
//             "column": 4,
//             "row": 3
//         },
//         {
//             "player": "player_two",
//             "column": 5,
//             "row": 1
//         },
//         {
//             "player": "player_one",
//             "column": 5,
//             "row": 2
//         },
//         {
//             "player": "player_two",
//             "column": 5,
//             "row": 3
//         },
//         {
//             "player": "player_one",
//             "column": 5,
//             "row": 4
//         }
//     ],
//     columns: []
// }


const players = ['player_one', 'player_two'];
const game = {
    currentPlayer: 'player_one',
    maxColumns: 7,
    maxRows: 6
}

generatePiecesFromBoard();

document.querySelectorAll('.board-button').forEach(button => {
    button.addEventListener('click', function() {
        let column = this.dataset.column;
        addPiece(column);
    });
});

function generatePiecesFromBoard() {
    sortBoardPieces();
    board.pieces.forEach(piece => {
        generateHTMLPiece(piece.column, piece.player);
    });
}
function addPiece(column, player = game.currentPlayer) {
    let piecesWithTheSameColumns = getPiecesByColumn(column);
    
    if (piecesWithTheSameColumns.length < game.maxRows) {
        board.pieces.push(
            {
                player: player, 
                column: parseInt(column), 
                row: piecesWithTheSameColumns.length + 1
            }
        );

        generateHTMLPiece(column, player);

        sortBoardPieces();
    }

    if (piecesWithTheSameColumns.length == game.maxRows - 1) {
        disableButtonByColumnNumber(column);
    }

    finishPlayerTurn();
};

function generateHTMLPiece(column, player = game.currentPlayer, isPreview = false) {
    let piece = document.createElement('li');
    let columnNode = document.querySelector(`.board__column:nth-child(${column})`);
    piece.classList.add(`board__piece`, `board__piece--${player}`);

    if (isPreview) {
        piece.classList.add('board__piece--preview');
    }

    columnNode.appendChild(piece);
}

function getPiecesByColumn(column) {
    return board.pieces.filter(piece => piece.column == column);
}

function getPieceByCoordinates(column, row) {
    return board.pieces.filter(piece => piece.column == column && piece.row == row)[0];
}

function getCurrentPlayerPieces() {
    return board.pieces.filter(piece => piece.player == game.currentPlayer);
}

function sortBoardPieces() {
    let boardPiecesCopy = JSON.parse(JSON.stringify(board.pieces));
    boardPiecesCopy.sort((a, b) => {
        return a.column - b.column || a.row - b.row;
    });
    board.pieces.splice(0, board.pieces.length, ...boardPiecesCopy);
}

function finishPlayerTurn() {
    if (checkForVictory()) {
        console.log('WINNER IS :', game.currentPlayer);
        document.querySelectorAll(`.board-button`).forEach(button => button.disabled = true);
        
        return;
    }

    let currentPlayerIndex = players.indexOf(game.currentPlayer);

    if (currentPlayerIndex == players.length-1) {
        game.currentPlayer = players[0];
    } else {
        game.currentPlayer = players[currentPlayerIndex+1];
    }
}

function disableButtonByColumnNumber(column) {
    document.querySelector(`.board-button[data-column="${column}"]`).disabled = true;
}

function checkForVictory() {
    let currentPlayerPieces = getCurrentPlayerPieces();
    let hasWon = false;

    for (let i = 0; i < currentPlayerPieces.length; i++) {
        const piece = currentPlayerPieces[i];

        if (checkPiecesInAxis(piece, getNextHorizonalPieces)) {
            return true;
        } else if (checkPiecesInAxis(piece, getNextVerticalPieces)) {
            return true;
        } else if (checkPiecesInAxis(piece, getNextUpDiagonalPieces)) {
            return true;
        } else if (checkPiecesInAxis(piece, getNextDownDiagonalPieces)) {
            return true;
        }
    }

    return hasWon;
}

function checkPiecesInAxis(referencePiece, operation) {
    let hasWon = true;
    let nextPieces = operation(referencePiece);

    for (let i = 0; i < nextPieces.length; i++) {
        const nextPiece = nextPieces[i];

        if (!nextPiece || (nextPiece.player != referencePiece.player)) {
            hasWon = false;
        }
    }

    if (hasWon) {
        nextPieces.unshift(referencePiece)
        hightlightWinningPieces(nextPieces);
    }
    
    return hasWon;
}

function getNextHorizonalPieces(referencePiece) {
    return [
        getPieceByCoordinates(referencePiece.column + 1, referencePiece.row),
        getPieceByCoordinates(referencePiece.column + 2, referencePiece.row),
        getPieceByCoordinates(referencePiece.column + 3, referencePiece.row)
    ];
}
function getNextVerticalPieces(referencePiece) {
    return [
        getPieceByCoordinates(referencePiece.column, referencePiece.row + 1),
        getPieceByCoordinates(referencePiece.column, referencePiece.row + 2),
        getPieceByCoordinates(referencePiece.column, referencePiece.row + 3)
    ];
}
function getNextUpDiagonalPieces(referencePiece) {
    return [
        getPieceByCoordinates(referencePiece.column + 1, referencePiece.row + 1),
        getPieceByCoordinates(referencePiece.column + 2, referencePiece.row + 2),
        getPieceByCoordinates(referencePiece.column + 3, referencePiece.row + 3)
    ];
}

function getNextDownDiagonalPieces(referencePiece) {
    return [
        getPieceByCoordinates(referencePiece.column + 1, referencePiece.row - 1),
        getPieceByCoordinates(referencePiece.column + 2, referencePiece.row - 2),
        getPieceByCoordinates(referencePiece.column + 3, referencePiece.row - 3)
    ];
}

function hightlightWinningPieces(pieces) {
    pieces.forEach(piece => {
        let pieceNode = getPieceHTMLNode(piece);
        pieceNode.classList.add('board__piece--winner');
    });
}

function getPieceHTMLNode(piece) {
    return document.querySelector(`.board__column:nth-child(${piece.column}) .board__piece:nth-child(${piece.row})`);
}
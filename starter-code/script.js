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

// Winning test board
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
    return board.pieces.filter(piece => piece.column == column && piece.row == row);
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
    let winning = false;

    for (let i = 0; i < currentPlayerPieces.length; i++) {
        const piece = currentPlayerPieces[i];
        if (checkHorizontal(piece)) {
            return true;
        } else if (checkVertical(piece)) {
            return true;
        }
    }

    return winning;
}

function checkHorizontal(referencePiece) {
    let winning = true;
    let nextPieces = [
        getPieceByCoordinates(referencePiece.column + 1, referencePiece.row),
        getPieceByCoordinates(referencePiece.column + 2, referencePiece.row),
        getPieceByCoordinates(referencePiece.column + 3, referencePiece.row),
        getPieceByCoordinates(referencePiece.column + 4, referencePiece.row)
    ];
    
    for (let i = 0; i < nextPieces.length; i++) {
        const nextPiece = nextPieces[i];

        if (nextPiece.player != referencePiece.player) {
            winning = false;
        }
    }
    
    return winning;
}
function checkVertical(referencePiece) {
    let winning = true;
    let nextPieces = [
        getPieceByCoordinates(referencePiece.column, referencePiece.row + 1),
        getPieceByCoordinates(referencePiece.column, referencePiece.row + 2),
        getPieceByCoordinates(referencePiece.column, referencePiece.row + 3),
        getPieceByCoordinates(referencePiece.column, referencePiece.row + 4)
    ];
    
    for (let i = 0; i < nextPieces.length; i++) {
        const nextPiece = nextPieces[i];

        if (nextPiece.player != referencePiece.player) {
            winning = false;
        }
    }
    
    return winning;
}
import { game, board, playerAliases } from './_global';
import { finishPlayerTurn } from './_game.js';

function clearBoardDisplay() {
    document.querySelectorAll('.board__piece').forEach(piece => piece.parentNode.removeChild(piece));
}
  
function clearBoardData() {
    board.pieces = [];
}
  
function generatePiecesFromBoard() {
    sortBoardPieces();
    board.pieces.forEach(piece => {
        generateHTMLPiece(piece.column, piece.player);
    });
}
  
function addPiece(column, player = game.currentPlayer) {
    if (!column) {
        return;
    }
  
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
    } else {
        return;
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

function isBoardFull() {
    return board.pieces.length == game.maxColumns * game.maxRows;
}
  
function updateCurrentPlayer(player = false) {
    game.currentPlayer = player;
    updatePlayerCSSColor();
    refreshPlayerAliasDisplays();
}
  
function updatePlayerCSSColor(player = game.currentPlayer) {
    document.querySelector('body').style.setProperty('--player-color', `var(--${player}-color)`);
    document.querySelector('body').style.setProperty('--player-text-color', `var(--${player}-text-color)`);
}
  
function refreshPlayerAliasDisplays(player = game.currentPlayer) {
    let nameNodes = document.querySelectorAll('[data-update-player-alias]');
    nameNodes.forEach(node => node.textContent = playerAliases[game.currentPlayer]);
}
  
function disableButtonByColumnNumber(column) {
    document.querySelector(`.board-button[data-column="${column}"]`).disabled = true;
}
  
function checkPiecesInAxis(referencePiece, operation) {
    let streakIsStillGoing = true;
    let streakPieces = [referencePiece];
    let currentPiece = referencePiece;
  
    while (streakIsStillGoing) {
        let nextPiece = operation(currentPiece);
  
        if (nextPiece && (nextPiece.player == currentPiece.player)) {
            streakPieces.push(nextPiece);
            currentPiece = nextPiece;
        } else {
            streakIsStillGoing = false;
        }
    }
  
    if (streakPieces.length > 3) {
        hightlightWinningPieces(streakPieces);
        return true;
    } else {
        return false;
    }
}
  
function getNextHorizonalPieces(referencePiece) {
    return getPieceByCoordinates(referencePiece.column + 1, referencePiece.row);
}
function getNextVerticalPieces(referencePiece) {
    return getPieceByCoordinates(referencePiece.column, referencePiece.row + 1);
}
function getNextUpDiagonalPieces(referencePiece) {
    return getPieceByCoordinates(referencePiece.column + 1, referencePiece.row + 1);
}
function getNextDownDiagonalPieces(referencePiece) {
    return getPieceByCoordinates(referencePiece.column + 1, referencePiece.row - 1);
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

export {
    clearBoardDisplay,
    clearBoardData,
    generatePiecesFromBoard,
    addPiece,
    generateHTMLPiece,
    getPiecesByColumn,
    getPieceByCoordinates,
    getCurrentPlayerPieces,
    sortBoardPieces,
    isBoardFull,
    updateCurrentPlayer,
    updatePlayerCSSColor,
    refreshPlayerAliasDisplays,
    disableButtonByColumnNumber,
    checkPiecesInAxis,
    getNextHorizonalPieces,
    getNextVerticalPieces,
    getNextUpDiagonalPieces,
    getNextDownDiagonalPieces,
    hightlightWinningPieces,
    getPieceHTMLNode
}
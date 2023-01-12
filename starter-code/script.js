const board = {
    pieces: []
    // pieces: JSON.parse(JSON.stringify(tiedTestBoard))
};

const players = ['player_one', 'player_two'];
const playerAliases = {
    player_one: 'Player 1',
    player_two: 'Player 2'
}
const playerScores = {
    player_one: 0,
    player_two: 0
}
const game = {
    currentPlayer: 'player_one',
    maxColumns: 7,
    maxRows: 6,
    timePerTurn: 30,
    isPaused: false
}

const quicktest = false;

if (quicktest) {
    game.timePerTurn = 10,
    generatePiecesFromBoard();
    startGame();
    dismissMenuAndBackdrop();
} else {
    focusFirstFocusableElement(document.querySelector('#start_menu'));
}

document.addEventListener('keydown', function(e) {
    if (e.key == 'Escape') {
        if (isGameRunning()) {
            goToMenu('#pause_menu');
            pauseGame();
        } else if (getActiveMenu().id != 'start_menu') {
            dismissMenuAndBackdrop();
        }
    } else if (parseInt(e.key) > 0 && parseInt(e.key) <= game.maxColumns) {
        if (isGameRunning()) {
            document.querySelector(`.board-button[data-column="${e.key}"]`).focus();
        }
    } else if (e.key == 'ArrowLeft' || e.key == 'ArrowRight') {
        if (isGameRunning()) {
            let currentlySelectedElement = document.querySelector('*:focus');
            let currentColumn = parseInt(currentlySelectedElement.dataset.column);
            let columnToFocus = e.key == 'ArrowLeft' ? currentColumn - 1 : currentColumn + 1;

            if (columnToFocus < 1) {
                columnToFocus = game.maxColumns;
            } else if (columnToFocus > game.maxColumns) {
                columnToFocus = 1;
            }

            document.querySelector(`.board-button[data-column="${columnToFocus}"]`).focus();
        }
    }
});

document.querySelectorAll('.board-button').forEach(button => {
    button.addEventListener('click', function() {
        let column = this.dataset.column;
        addPiece(column);
    });
});

document.querySelectorAll('.js-reset-game').forEach(element => element.addEventListener('click', resetGame));
document.querySelectorAll('.js-start-next-game').forEach(element => element.addEventListener('click', startNextGame));
document.querySelectorAll('.js-start-game').forEach(element => element.addEventListener('click', startGame));
document.querySelectorAll('.js-pause-game').forEach(element => element.addEventListener('click', pauseGame));
document.querySelectorAll('.js-resume-game').forEach(element => element.addEventListener('click', resumeGame));

document.querySelectorAll('.js-dismiss-parent-menu').forEach(element => element.addEventListener('click', function() {
    dismissMenuAndBackdrop();
}));

document.querySelectorAll('.js-switch-menu').forEach(element => element.addEventListener('click', function(e) {
    e.preventDefault();
    goToMenu.call(this, element.getAttribute('href'), this.dataset.updateBackdrop);
}));

document.querySelectorAll('.js-trap-focus, .menu').forEach(element => element.addEventListener('keydown', handleKeyPressInModal));

function pauseGame() {
    game.isPaused = true;
    stopTurnTimer();
}
function resumeGame() {
    startTurnTimer();
    game.isPaused = false;
}
function startGame() {
    game.isPaused = false;
    startTurnTimer();
    document.querySelector('.board-button[data-column="1"]').focus();
}
function continueLastGame() {
    generatePiecesFromBoard();
    startGame();
}
function startNextGame() {
    resetGameDataAndUI();
    alternateStartingPlayer();
    startGame();
}
function resetGame() {
    resetGameDataAndUI();
    updateCurrentPlayer(players[0]);
    startGame();
}

function isGameRunning() {
    return !game.isPaused && !getActiveMenu();
}

function goToMenu(targetMenuID, backdropNewType = false) {
    let activeClass = 'menu--active';
    let menuBackdrop = document.querySelector('.menu-backdrop');
    let backdropWasNotVisible = menuBackdrop.classList.contains('hidden');
    let menu = document.querySelector(targetMenuID);
    hideActiveMenu();
    menu.classList.add(activeClass);

    if (backdropWasNotVisible) {
        menuBackdrop.classList.remove('hidden');
        menuBackdrop.setAttribute('data-type', targetMenuID.replace('#', ''));

        if (this.nodeType) {
            game.lastMenuOpener = this;
        }
    } else if (backdropNewType) {
        menuBackdrop.setAttribute('data-type', targetMenuID.replace('#', ''));
    }
    
    focusFirstFocusableElement(menu);
}

function dismissMenuAndBackdrop() {
    let menuBackdrop = document.querySelector('.menu-backdrop')
    menuBackdrop.classList.add('hidden');
    menuBackdrop.setAttribute('data-type', 'start_menu');
    hideActiveMenu();
    
    if (game.lastMenuOpener) {
        game.lastMenuOpener.focus();
        game.lastMenuOpener = null;
    }
    if (game.isPaused) {
        resumeGame();
    }
}

function hideActiveMenu() {
    let activeClass = 'menu--active';
    let activeMenu = document.querySelector(`.${activeClass}`);

    if (activeMenu) {
        activeMenu.classList.remove(activeClass);
    }
}

function getActiveMenu() {
    return document.querySelector('.menu--active');
}

function handleKeyPressInModal(e) {
    if (e.key == 'Tab') {
        trapFocusInElement.call(this, e);
    }
}

function trapFocusInElement(e) {
    if (e.key == 'Tab') {
        let focusableElements = getKeyboardFocusableElements(this);
        let firstFocusableElement = focusableElements[0];
        let lastFocusableElement = focusableElements[focusableElements.length - 1];
        let focusedElement = this.querySelector(':focus'); 

        if (e.shiftKey) {
            if (focusedElement === firstFocusableElement) {
                e.preventDefault();
                lastFocusableElement.focus();
            }
        } else {
            if (focusedElement === lastFocusableElement) {
                e.preventDefault();
                firstFocusableElement.focus();
            }
        }
    }

}

function focusFirstFocusableElement(element = document) {
    let firstFocusableElementInStartMenu = getKeyboardFocusableElements(element)[0];
    if (firstFocusableElementInStartMenu) {
        firstFocusableElementInStartMenu.focus();
    }
}

function getKeyboardFocusableElements(element = document) {
    return [
      ...element.querySelectorAll(
        'a[href], button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
      )
    ].filter(
      el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
    )
}

function resetGameDataAndUI() {
    stopTurnTimer();
    clearBoardData();
    clearBoardDisplay();
    document.querySelectorAll(`.board-button`).forEach(button => button.disabled = false);
    document.querySelector('.winner-window').classList.add('hidden');
    document.querySelector('.tie-window').classList.add('hidden');
    document.querySelector('.current-turn-window').classList.remove('hidden');
    document.querySelector('body').style.setProperty('--winner-color', ``);
}

function clearBoardDisplay() {
    document.querySelectorAll('.board__piece').forEach(piece => piece.parentNode.removeChild(piece));
}

function clearBoardData() {
    board.pieces = [];
}

function alternateStartingPlayer() {
    players.push(players.splice(0, 1)[0]);
    updateCurrentPlayer(players[0]);
}

function incrementTimer() {
    game.remainingTurnTime--;

    if (game.remainingTurnTime <= 0) {
        finishPlayerTurn();
    }
    
    updateRemainingTimeDisplay();
}

function startTurnTimer() {
    if (!game.isPaused) {
        game.remainingTurnTime = game.timePerTurn;
        updateRemainingTimeDisplay();
    }

    game.turnTimerInterval = setInterval(incrementTimer, 1000);
}

function stopTurnTimer() {
    clearInterval(game.turnTimerInterval);
    game.turnTimerInterval = null;
}

function updateRemainingTimeDisplay() {
    document.querySelector('.current-turn-timer').textContent = `${game.remainingTurnTime}s`;
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

function finishPlayerTurn() {
    stopTurnTimer();
    
    if (checkForVictory()) {
        finishGame();
        return;
    }

    if (isBoardFull()) {
        finishGame(true);
        return;
    }

    startNextPlayerTurn();
}

function isBoardFull() {
    return board.pieces.length == game.maxColumns * game.maxRows;
}

function finishGame(isATie = false) {
    document.querySelectorAll(`.board-button`).forEach(button => button.disabled = true);
    document.querySelector('.current-turn-window').classList.add('hidden');

    if (isATie) {
        document.querySelector('.tie-window').classList.remove('hidden');
    } else {
        playerScores[game.currentPlayer]++;
        document.querySelector(`.player-score-window--${game.currentPlayer} .player-score`).textContent = playerScores[game.currentPlayer];
        document.querySelector('.winner-window').classList.remove('hidden');
        document.querySelector('body').style.setProperty('--winner-color', `var(--${game.currentPlayer}-color)`);
    }
}

function startNextPlayerTurn() {
    let currentPlayerIndex = players.indexOf(game.currentPlayer);
    let nextPlayer;

    if (currentPlayerIndex == players.length-1) {
        nextPlayer = players[0];
    } else {
        nextPlayer = players[currentPlayerIndex+1];
    }

    updateCurrentPlayer(nextPlayer);
    startTurnTimer();
}

function updateCurrentPlayer(player = false) {
    game.currentPlayer = player;
    updatePlayerCSSColor();
    refreshPlayerAliasDisplays();
}

function updatePlayerCSSColor(player = game.currentPlayer) {
    document.querySelector('body').style.setProperty('--player-color', `var(--${player}-color)`);
}

function refreshPlayerAliasDisplays(player = game.currentPlayer) {
    let nameNodes = document.querySelectorAll('[data-update-player-alias]');
    nameNodes.forEach(node => node.textContent = playerAliases[game.currentPlayer]);
}

function disableButtonByColumnNumber(column) {
    document.querySelector(`.board-button[data-column="${column}"]`).disabled = true;
}

function checkForVictory() {
    let currentPlayerPieces = getCurrentPlayerPieces();
    let hasWon = false;

    if (currentPlayerPieces.length < 4) {
        return hasWon;
    }

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
        nextPieces.unshift(referencePiece);
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
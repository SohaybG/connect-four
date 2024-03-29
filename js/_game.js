import { game, players, playerAliases, playerScores, toggleBoardButtonPermission, leaveOnlineRoom, setPlayerReadyStatus } from './_global.js';
import { getActiveMenu } from './_menus.js';
import {
    clearBoardDisplay,
    clearBoardData,
    generatePiecesFromBoard,
    getCurrentPlayerPieces,
    isBoardFull,
    updateCurrentPlayer,
    checkPiecesInAxis,
    getNextHorizonalPieces,
    getNextVerticalPieces,
    getNextUpDiagonalPieces,
    getNextDownDiagonalPieces
} from './_board.js';

function startGame() {
    game.isPaused = false;
    startTurnTimer();
    document.querySelector('.board-button[data-column="1"]').focus();
}
function continueLastGame() {
    generatePiecesFromBoard();
    startGame();
}
function pauseGame() {
    if (game.isOnline) return;
    game.isPaused = true;
    stopTurnTimer();
}
function resumeGame() {
    if (game.isOnline) return;
    startTurnTimer();
    game.isPaused = false;
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
function quitGame() {
    if (game.isOnline) leaveOnlineRoom();
    resetGameDataAndUI();
    resetScores();
    game.userIsWhichPlayer = players[0];
    updateCurrentPlayer(players[0]);
};
function isGameRunning() {
    return !game.isPaused && !getActiveMenu();
}
function resetGameDataAndUI() {
    if (!game.isOnline) {
        players.forEach(player => {
            document.querySelector(`.game-info-window [data-alias-${player}]`).textContent = playerAliases[player];
        });
    }
    setPlayerReadyStatus(players[0], false);
    setPlayerReadyStatus(players[1], false);
    stopTurnTimer();
    clearBoardData();
    clearBoardDisplay();
    document.querySelectorAll(`.board-button`).forEach(button => button.disabled = false);
    document.querySelector('.winner-window').classList.add('hidden');
    document.querySelector('.tie-window').classList.add('hidden');
    document.querySelector('.current-turn-window').classList.remove('hidden');
    document.querySelector('body').style.setProperty('--winner-color', ``);
}
function resetScores() {
    playerScores.player_one = 0;
    playerScores.player_two = 0;
    document.querySelectorAll('.player-score').forEach(scoreNode => {
        scoreNode.textContent = 0;
    });
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
    if (game.isOnline) {
        toggleBoardButtonPermission();
    }
    startTurnTimer();
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

function alternateStartingPlayer() {
    players.push(players.splice(0, 1)[0]);
    updateCurrentPlayer(players[0]);

    if (game.isOnline) {
        toggleBoardButtonPermission();
    }
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
  
function incrementTimer() {
    game.remainingTurnTime--;
  
    if (game.remainingTurnTime <= 0) {
        finishPlayerTurn();
    }
    
    updateRemainingTimeDisplay();
}
  
function updateRemainingTimeDisplay() {
    document.querySelector('.current-turn-timer').textContent = `${game.remainingTurnTime}s`;
}

function isUserCurrentPlayer() {
    return game.userIsWhichPlayer == game.currentPlayer;
}

export {
    startGame,
    continueLastGame,
    pauseGame,
    resumeGame,
    quitGame,
    startNextGame,
    resetGame,
    isGameRunning,
    resetGameDataAndUI,
    checkForVictory,
    finishGame,
    startNextPlayerTurn,
    finishPlayerTurn,
    alternateStartingPlayer,
    startTurnTimer,
    stopTurnTimer,
    incrementTimer,
    updateRemainingTimeDisplay,
    isUserCurrentPlayer
}
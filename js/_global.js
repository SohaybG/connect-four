import '../scss/style.scss';
import { io } from 'socket.io-client';
import { startGame, pauseGame, resumeGame, quitGame, startNextGame, resetGame, isGameRunning } from './_game.js';
import { goToPreviousMenu, goToMenu, dismissMenuAndBackdrop } from './_menus.js';
import { generatePiecesFromBoard, addPiece } from './_board.js';

export const board = {
  pieces: []
  // pieces: JSON.parse(JSON.stringify(tiedTestBoard))
};

export const players = ['player_one', 'player_two'];
export const playerAliases = {
  player_one: 'Player 1',
  player_two: 'Player 2'
}
export const playerScores = {
  player_one: 0,
  player_two: 0
}
export const game = {
  currentPlayer: 'player_one',
  maxColumns: 7,
  maxRows: 6,
  timePerTurn: 30,
  isPaused: false,
  menuHistory: [],
  isOnline: false,
  userIsWhichPlayer: 'player_one'
}

export const socket = io('https://connect-four-nv8g.onrender.com/');

const quicktest = false;

const searchParams =  new URLSearchParams(window.location.search);
if (searchParams.get('room')) {
  socket.emit('join_room', searchParams.get('room'));
}

socket.on('created_room', room => {
  document.querySelector('.create-room-menu-link').textContent = `${window.location.href.split(/[?#]/)[0]}?room=${room}`;
});
socket.on('joined_room', (joiningSocketID, position) => {
  if (socket.id == joiningSocketID) {
    game.userIsWhichPlayer = players[position];
  }
});
socket.on('start_game', () => {
  document.querySelector(`.game-info-window [data-alias-${game.userIsWhichPlayer}]`).textContent = `${playerAliases[game.userIsWhichPlayer]} (You)`;
  changeGameOnlineStatus(true);
  toggleBoardButtonPermission();
  startGame();
  dismissMenuAndBackdrop(true);
});
socket.on('start_next_game', () => {
  startNextGame();
});
socket.on('added_piece', column => {
  addPiece(column);
});
socket.on('player_disconnect', () => {
  quitGame();
  goToMenu('#start_menu');
});
socket.on('full_room', () => {
  showAlert('Room is full', 'The room you tried to join is already full');
});
// socket.on('room_not_found', () => {
//   showAlert('Room not found', 'The room you tried to join doesn\'t or no longer exists');
// });
socket.on('next_game_request', () => {
  setPlayerReadyStatus(getOpponent(), true);
});

function toggleBoardButtonPermission() {
  document.querySelectorAll('.board-button').forEach(button => {
    button.disabled = game.userIsWhichPlayer != game.currentPlayer;
  });
}
function leaveOnlineRoom() {
  changeGameOnlineStatus(false);
  game.userIsWhichPlayer = players[0];
  socket.emit('leave_room');
}
function changeGameOnlineStatus(isOnline) {
  game.isOnline = isOnline;
  
  document.querySelectorAll('[hide-online]').forEach(element => {
    element.classList.toggle('hidden', isOnline);
  });
  document.querySelectorAll('[show-online]').forEach(element => {
    element.classList.toggle('hidden', !isOnline);
  });
}
function getOpponent(referencePlayer = game.userIsWhichPlayer) {
  return players.filter(player => player != referencePlayer)[0];
}
function setPlayerReadyStatus(player, isReady) {
  document.querySelectorAll(`.game-info-window-waitlist__name[data-player="${player}"]`).forEach(nameNode => {
    nameNode.classList.toggle('active', isReady);
  });
}

if (quicktest) {
  game.timePerTurn = 10,
  generatePiecesFromBoard();
  startGame();
  dismissMenuAndBackdrop(true);
} else {
  focusFirstFocusableElement(document.querySelector('#start_menu'));
}

document.addEventListener('keydown', function(e) {
  if (e.key == 'Escape') {
      if (isGameRunning()) {
          goToMenu('#pause_menu');
          pauseGame();
      } else {
          goToPreviousMenu();
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

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('copy-on-click')) {
    copyContent(e.target.textContent);
  }
});

document.querySelectorAll('.board-button').forEach(button => {
  button.addEventListener('click', function() {
      let column = this.dataset.column;
      addPiece(column);
  });
});

document.querySelectorAll('.js-reset-game').forEach(element => element.addEventListener('click', resetGame));
document.querySelectorAll('.js-start-next-game').forEach(element => element.addEventListener('click', () => {
  if (game.isOnline) {
    socket.emit('next_game_request');
    setPlayerReadyStatus(game.userIsWhichPlayer, true);
  } else {
    startNextGame();
  }
}));
document.querySelectorAll('.js-start-game').forEach(element => element.addEventListener('click', startGame));
document.querySelectorAll('.js-pause-game').forEach(element => element.addEventListener('click', pauseGame));
document.querySelectorAll('.js-resume-game').forEach(element => element.addEventListener('click', resumeGame));
document.querySelectorAll('.js-quit-game').forEach(element => element.addEventListener('click', quitGame));
document.querySelectorAll('.js-dismiss-parent-menu').forEach(element => element.addEventListener('click', dismissMenuAndBackdrop));
document.querySelectorAll('.js-go-to-prev-menu').forEach(element => element.addEventListener('click', goToPreviousMenu));
document.querySelectorAll('.js-create-room').forEach(element => element.addEventListener('click', createOnlineRoom));
document.querySelectorAll('.js-leave-room').forEach(element => element.addEventListener('click', leaveOnlineRoom));

document.querySelectorAll('.js-force-dismiss-parent-menu').forEach(element => element.addEventListener('click', function() {
  dismissMenuAndBackdrop(true);
}));

document.querySelectorAll('.js-switch-menu').forEach(element => element.addEventListener('click', function(e) {
  e.preventDefault();
  goToMenu.call(this, element.getAttribute('href'), this.dataset.updateBackdrop);
}));

document.querySelectorAll('.js-trap-focus, .menu').forEach(element => element.addEventListener('keydown', handleKeyPressInModal));

function createOnlineRoom() {
  socket.emit('create_room');
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

function showAlert(title = '', content = '') {
  document.querySelector('.alert-menu__title').textContent = title;
  document.querySelector('.alert-menu__content').textContent = content;
  goToMenu('#alert_menu');
}

async function copyContent(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

export {
  handleKeyPressInModal,
  trapFocusInElement,
  focusFirstFocusableElement,
  getKeyboardFocusableElements,
  toggleBoardButtonPermission,
  leaveOnlineRoom,
  setPlayerReadyStatus
}
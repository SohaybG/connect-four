import { game, focusFirstFocusableElement } from './_global';
import { resumeGame } from './_game.js';

function goToPreviousMenu() {
    if (!game.menuHistory.length) {
        dismissMenuAndBackdrop();
        return;
    }
  
    let previousMenu = game.menuHistory[game.menuHistory.length - 1];
  
    goToMenu(`#${previousMenu.menuId}`);
  
    if (previousMenu.openedBy) {
        previousMenu.openedBy.focus();
    }
}
  
function goToMenu(targetMenuID, backdropNewType = false) {
    let activeClass = 'menu--active';
    let menuBackdrop = document.querySelector('.menu-backdrop');
    let backdropWasNotVisible = menuBackdrop.classList.contains('hidden');
    let menu = document.querySelector(targetMenuID);
    let previouslyOpenedMenu = game.menuHistory[game.menuHistory.length - 1];
  
    if (previouslyOpenedMenu && previouslyOpenedMenu.menuId == menu.id) {
        game.menuHistory.pop();
    } else if (getActiveMenu() && previouslyOpenedMenu != menu) {
        game.menuHistory.push({menuId: getActiveMenu().id, openedBy: this.nodeType ? this : null});
    }
  
    hideActiveMenu();
    menu.classList.add(activeClass);
  
    if (backdropWasNotVisible) {
        menuBackdrop.classList.remove('hidden');
  
        if (this && this.nodeType) {
            game.lastMenuOpener = this;
        }
    }
  
    if (backdropWasNotVisible || backdropNewType) {
        menuBackdrop.setAttribute('data-type', targetMenuID.replace('#', ''));
    }
    
    focusFirstFocusableElement(menu);
}
  
function dismissMenuAndBackdrop(ignoreExceptions = false) {
    let exceptions = ['start_menu'];
    let activeMenuId = getActiveMenu().id;
  
    if (!ignoreExceptions && exceptions.indexOf(activeMenuId) >= 0) {
        return;
    }
  
    hideAndResetMenuBackdrop();
    hideActiveMenu();
  
    game.menuHistory = [];
    
    if (game.lastMenuOpener) {
        game.lastMenuOpener.focus();
        game.lastMenuOpener = null;
    }
    
    if (game.isPaused) {
        resumeGame();
    }
}
  
function hideAndResetMenuBackdrop() {
    let menuBackdrop = document.querySelector('.menu-backdrop');
    menuBackdrop.classList.add('hidden');
    menuBackdrop.setAttribute('data-type', 'start_menu');
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

export {
    goToPreviousMenu,
    goToMenu,
    hideActiveMenu,
    dismissMenuAndBackdrop,
    hideAndResetMenuBackdrop,
    getActiveMenu
}
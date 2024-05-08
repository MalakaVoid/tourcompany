window.addEventListener('load', function(e) {
    let menuButton = this.document.querySelector('.header__menu_button');
    menuButton.addEventListener('click', onMenuButtonClick);

    let exitButton = this.document.querySelector('.header__exit_button');
    exitButton.addEventListener('click', onExitButtonClick);
});

function onMenuButtonClick(e){
    let nav = document.querySelector('.header__nav');
    nav.style.display = 'block';
}
function onExitButtonClick(e){
    let nav = document.querySelector('.header__nav');
    nav.style.display = 'none';
}
document.getElementById('playButton').addEventListener('click', () => {
    decreaseTimer();
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('bigContainer').style.display = 'inline-block';

    gameStart = true;
});
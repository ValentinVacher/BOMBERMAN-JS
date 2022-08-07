const canvas = document.getElementById('bomberman');
const play = document.getElementById('play');

let ctx = canvas.getContext('2d');

play.addEventListener('click', () => {
    play.style.transition = '0s'
    play.style.visibility = 'hidden';
    canvas.style.background = '#000';
})
const canvas = document.getElementById('bomberman');
const canvasWidth = canvas.width = 1920;
const canvasHeight = canvas.height = 1080;
const play = document.getElementById('play');
const ctx = canvas.getContext('2d');

play.addEventListener('click', () => {
    play.style.transition = '0s'
    play.style.visibility = 'hidden';
    canvas.style.background = '#eee';

    launchGame();
});

function launchGame() {
    const linkWidth = 120;
    const linkHeight = 130;
    const staggerFrame = 5;

    let link = new Image();
    let gameFrame = 0;
    let linkState = 'walkRight';

    link.src = "./asset/animation/link.png";

    const linkAnimation = [];
    const linkStates = [
        {
            name : 'idleBot',
            frames : 1
        },
        {
            name : 'idleLeft',
            frames : 1
        },
        {
            name : 'idleTop',
            frames : 1
        },
        {
            name : 'idleRight',
            frames : 1
        },
        {
            name : 'walkBot',
            frames : 10
        },
        {
            name : 'walkLeft',
            frames : 10
        },
        {
            name : 'walkTop',
            frames : 10
        },
        {
            name : 'walkRight',
            frames : 10
        }
    ];

    linkStates.forEach((state, index) => {
        let frames = {
            loc : [],
        };

        for(let j = 0; j < state.frames; j++){
            let positionX = j * linkWidth;
            let positionY = index * linkHeight;

            frames.loc.push(
                {
                    x : positionX, 
                    y : positionY
                });
        }

        linkAnimation[state.name] = frames;
    });

    console.log(linkAnimation);

    function animate(){
        ctx.clearRect(0, 0, 1920, 1080);
    
        let position = Math.floor(gameFrame/staggerFrame) % linkAnimation[linkState].loc.length;
        let frameX = linkWidth * position;
        let frameY = linkAnimation[linkState].loc[position].y;
    
        ctx.drawImage(link, frameX, frameY, linkWidth, linkHeight, 0, 0, linkWidth, linkHeight);
    
        gameFrame++;
        requestAnimationFrame(animate);
    }

    animate();
}
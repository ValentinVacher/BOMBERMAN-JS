window.addEventListener('load', function() {
    const canvas = document.getElementById('bomberman');
    const play = document.getElementById('play');
    const ctx = canvas.getContext('2d');

    canvas.width = 1920;
    canvas.height = 1080;

    play.addEventListener('click', () => {
        play.style.transition = '0s'
        play.style.visibility = 'hidden';
        canvas.style.background = '#eee';

        class InputHandler {

        }

        class Particle {

        }

        class Player {
            constructor(game, x, y) {
                this.game = game;
                this.width = 120;
                this.height = 130;
                this.x = x;
                this.y = y;
                this.speedX = 0;
                this.speedY = 0;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY
            }

            draw(context){
                context.fillRect(this.x, this.y, this.width, this.height)
            }
        }

        class Background {

        }

        class UI {

        }

        class Game {
            constructor(width, height) {
                this.width = width;
                this.height = height;
                this.player = new Player(this, 0, 0);
            }

            update() {
                this.player.update();
            }

            draw(context) {
                this.player.draw(context);
            }
        }

        const game = new Game(canvas.width, canvas.height);

        // animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            game.update();
            game.draw(ctx);
            requestAnimationFrame(animate);
        }

        animate();
    });
})
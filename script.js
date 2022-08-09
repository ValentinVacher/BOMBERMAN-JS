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
            constructor(game) {
                this.game = game;
                window.addEventListener('keydown', e => {
                    ((e.key === 'z' || e.key === 's' || e.key === 'q' || e.key === 'd') && this.game.keys.indexOf(e.key) === -1) ? this.game.keys.push(e.key) : (e.key === ' ') ? this.game.player.setBomb() : '';
                });

                window.addEventListener('keyup', e => {
                    this.game.keys.indexOf(e.key) > -1 ? this.game.keys.splice(this.game.keys.indexOf(e.key), 1) : '';
                });
            }
        }

        class Bomb {
            constructor(game, x, y) {
                this.game = game;
                this.x = x;
                this.y = y;
                this.width = 150;
                this.height = 150;
                this.markeForDeletion = false;
            }

            update() {

            }

            draw(context) {
                context.fillStyle = 'yellow';
                context.fillRect(this.x, this.y, this.width, this.height)
            }
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
                this.maxSpeed = 10;
                this.bombs = [];
                this.ammo = 1
            }

            update() {
                this.game.keys.includes('z') ? this.speedY = -this.maxSpeed : (this.game.keys.includes('s') ? this.speedY = this.maxSpeed : this.speedY = 0);

                this.game.keys.includes('q') ? this.speedX = -this.maxSpeed : (this.game.keys.includes('d') ? this.speedX = this.maxSpeed : this.speedX = 0);

                this.x += this.speedX;
                this.y += this.speedY

                // handle bomb
                this.bombs.forEach(bomb => {
                    bomb.update();
                });

                this.bombs = this.bombs.filter(bomb => !bomb.markeForDeletion)
            }

            draw(context){
                this.bombs.forEach(bomb => {
                    bomb.draw(context);
                });

                context.fillStyle = 'green';
                context.fillRect(this.x, this.y, this.width, this.height)
            }

            setBomb() {
                this.ammo > 0 ? (this.bombs.push(new Bomb(this.game, this.x - 15, this.y - 10)),
                this.ammo--) : '' ;
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
                this.input = new InputHandler(this);
                this.keys = [];
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
});
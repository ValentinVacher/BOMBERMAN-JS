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
                    if((    e.key === 'z' || 
                            e.key === 's' || 
                            e.key === 'q' || 
                            e.key === 'd') && 
                            this.game.keys.indexOf(e.key) === -1) {
                                this.game.keys.push(e.key)
                            }else if(e.key === ' '){
                                this.game.player.setBomb()
                            }
                });

                window.addEventListener('keyup', e => {
                    if(this.game.keys.indexOf(e.key) > -1){
                        this.game.keys.splice(this.game.keys.indexOf(e.key), 1)
                    }
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
                this.timer = 0
                this.duration = 3000
            }

            update(deltaTime) {
                if(this.timer >= this.duration){
                    this.markeForDeletion = true;
                } else {
                    this.timer += deltaTime;
                }
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
                this.maxBomb = 1
            }

            update(deltaTime) {

                if(this.game.keys.includes('z')){
                    this.speedY = -this.maxSpeed
                } else if(this.game.keys.includes('s')){
                    this.speedY = this.maxSpeed
                } else{
                    this.speedY = 0
                }

                if(this.game.keys.includes('q')){
                    this.speedX = -this.maxSpeed
                } else if(this.game.keys.includes('d')){
                    this.speedX = this.maxSpeed
                } else{
                    this.speedX = 0
                }

                this.x += this.speedX;
                this.y += this.speedY

                // handle bomb
                this.bombs.forEach(bomb => {
                    bomb.update(deltaTime);
                    if(bomb.markeForDeletion === true){
                        this.maxBomb++;
                    }
                });

                this.bombs = this.bombs.filter(bomb => !bomb.markeForDeletion)
                this.maxBombTimer += deltaTime
            }

            draw(context){
                this.bombs.forEach(bomb => {
                    bomb.draw(context);
                });

                context.fillStyle = 'green';
                context.fillRect(this.x, this.y, this.width, this.height)
            }

            setBomb() {
                if(this.maxBomb > 0){
                    this.bombs.push(new Bomb(this.game, this.x - 15, this.y - 10));
                    this.maxBomb--
                }
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

            update(deltaTime) {
                this.player.update(deltaTime);
            }

            draw(context) {
                this.player.draw(context);
            }
        }

        const game = new Game(canvas.width, canvas.height);

        let lastTime = 0;

        // animation loop
        function animate(timeStamp) {
            const deltaTime = timeStamp - lastTime;

            lastTime = timeStamp;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            game.update(deltaTime);
            game.draw(ctx);

            requestAnimationFrame(animate);
        }

        animate(0);
    });
});
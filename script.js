window.addEventListener('load', function() {
    const body = document.getElementById('background');
    const canvas = document.getElementById('bomberman');
    const play = document.getElementById('play');
    const ctx = canvas.getContext('2d');

    canvas.width = 1920;
    canvas.height = 1080;

    play.addEventListener('click', () => {
        play.style.transition = '0s';
        play.style.visibility = 'hidden';
        body.style.background = '#000';
        canvas.style.background = '#eee';
        canvas.style.visibility = 'visible';

        class InputHandler {
            constructor(game) {
                this.game = game;
                window.addEventListener('keydown', e => {
                    if((    e.key === 'z' || 
                            e.key === 's' || 
                            e.key === 'q' || 
                            e.key === 'd') && 
                            this.game.keys.indexOf(e.key) === -1) {
                                this.game.keys.push(e.key);
                            }else if(e.key === ' '){
                                this.game.player.setBomb();
                            }
                });

                window.addEventListener('keyup', e => {
                    if(this.game.keys.indexOf(e.key) > -1){
                        this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                    }
                });
            }
        }

        class Explosion {
            constructor(game, bomb, x, y){
                this.game = game;
                this.bomb = bomb;
                this.x = x;
                this.y = y;
                this.width = 150;
                this.height = 150;
                this.markeForDeletion = false;
            }

            update(){
                if( this.x < this.game.border.vertical ||
                    this.x == this.game.width - this.game.border.vertical ||
                    this.y < this.game.border.horizontal ||
                    this.y == this.game.height - this.game.border.horizontal){
                        this.markeForDeletion = true;
                    }

                this.game.walls.forEach(wall => {
                    if(this.game.checkCollision(this, wall)){
                        this.markeForDeletion = true;
                    }
                });

                this.game.player.bombs.forEach(bomb => {
                    if(this.game.checkCollision(this, bomb)) {
                        bomb.timer = 2500;
                    }
                });
            }

            draw(context){
                context.fillStyle = 'orange';
                context.fillRect(this.x, this.y, this.width, this.height);
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
                this.timer = 0;
                this.explosionTime = 2500;
                this.explosions = [];
                this.explosion = false;
                this.duration = 3000;
                this.tangible = false;
            }

            update(deltaTime) {
                if( this.timer >= this.explosionTime &&
                    !this.explosion){
                        this.explosion = true;
                        this.explosions.push(new Explosion(this.game, this, this.x, this.y), new Explosion(this.game, this, this.x + 150, this.y), new Explosion(this.game, this, this.x - 150, this.y), new Explosion(this.game, this, this.x, this.y + 150), new Explosion(this.game, this, this.x, this.y - 150));
                        this.explosions.forEach(explosion => {
                            explosion.update();
                        });
                        this.explosions = this.explosions.filter(explosion => !explosion.markeForDeletion);
                    }

                if(this.timer >= this.duration){
                    this.markeForDeletion = true;
                } else {
                    this.timer += deltaTime;
                }

                if( !this.tangible &&
                    !this.game.checkCollision(this, this.game.player)){
                        this.tangible = true;
                    }
            }

            draw(context) {
                if(this.timer < this.explosionTime &&
                    !this.explosion) {
                    context.fillStyle = 'yellow';
                    context.fillRect(this.x, this.y, this.width, this.height);
                    } else{
                        this.explosions.forEach(explosion => {
                            explosion.draw(context);
                        })
                    }
                
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
                this.maxBomb = 5;
            }

            update(deltaTime) {
                if( this.game.keys.includes('z') &&
                    this.y > this.game.border.horizontal){
                    this.speedY = -this.maxSpeed;
                } else if(  this.game.keys.includes('s') &&
                            this.y + this.height < this.game.height - this.game.border.horizontal){
                    this.speedY = this.maxSpeed;
                } else{
                    this.speedY = 0;
                }

                if( this.game.keys.includes('q') &&
                    this.x > this.game.border.vertical){
                    this.speedX = -this.maxSpeed;
                } else if(  this.game.keys.includes('d') &&
                            this.x + this.width < this.game.width - this.game.border.vertical){
                    this.speedX = this.maxSpeed;
                } else{
                    this.speedX = 0;
                }

                
                

                // colision X
                if(this.speedX != 0){
                    this.x += this.speedX;

                    let collisionX = this.checkCollision();

                    if(collisionX) {
                        this.x -= this.speedX;
                    }
                }

                // colision Y
                if(this.speedY != 0){
                    this.y += this.speedY;

                    let collisionY = this.checkCollision();

                    if(collisionY) {
                        this.y -= this.speedY;
                    }
                }

                // handle bomb
                this.bombs.forEach(bomb => {
                    bomb.update(deltaTime);
                    if(bomb.markeForDeletion === true){
                        this.maxBomb++;
                    }
                });

                this.bombs = this.bombs.filter(bomb => !bomb.markeForDeletion);
                this.maxBombTimer += deltaTime;
            }

            draw(context){
                this.bombs.forEach(bomb => {
                    bomb.draw(context);
                });

                context.fillStyle = 'green';
                context.fillRect(this.x, this.y, this.width, this.height);
            }

            checkCollision() {
                let collision = false;

                this.game.walls.forEach(wall => {
                    if(this.game.checkCollision(this, wall)) {
                        collision = true;
                    }
                });

                if(!collision){
                    this.bombs.forEach(bomb => {
                        if( bomb.tangible && 
                            bomb.timer < bomb.explosionTime && 
                            this.game.checkCollision(this, bomb)) {
                                collision = true;
                            }
                    });
                }

                return collision;
            }

            setBomb() {
                if(this.maxBomb > 0){
                    let x = Math.floor((this.x - 60) / 150) * 150 + this.game.border.vertical;
                    let y = Math.floor((this.y + 65) / 150) * 150 + this.game.border.horizontal;
                    let setBomb = true;

                    this.bombs.forEach(bomb  => {
                        if( x === bomb. x &&
                            y === bomb.y){
                                setBomb = false;
                            }
                    })

                    if(setBomb){
                        this.bombs.push(new Bomb(this.game, x, y));
                        this.maxBomb--;
                    }   
                }
            }
        }

        class Wall {
            constructor(game) {
                this.game = game;
                this.width = 150;
                this.height = 150;
            }

            draw(context){
                context.fillStyle = 'grey';
                context.fillRect(this.x, this.y, this.width, this.height);
            }
        }

        class GreyWall extends Wall {
            constructor (game, x, y){
                super(game);
                this.x = x;
                this.y = y;
            }
        }

        class Background {

        }

        class Border {
            constructor(game) {
                this.game = game;
                this.vertical = 135;
                this.horizontal = 15;
            }

            draw(context) {
                context.fillStyle = "black";
                context.fillRect(0, 0, this.vertical, this.game.height);
                context.fillRect(this.game.width - this.vertical, 0, this.vertical, this.game.height);
                context.fillRect(0, 0, this.game.width, this.horizontal);
                context.fillRect(0, this.game.height - this.horizontal, this.game.width, this.horizontal);
            };
        }

        class UI {
            constructor(game) {
                this.game = game;
                this.fontSize = 25;
                this.fontFamily = 'botw';
                this.color = "yellow";
            }

            draw(context){
                // bomb
                context.fillStyle = this.color;
                for (let i = 0; i < this.game.player.maxBomb; i++){
                    context.fillRect(this.game.border.vertical + 10 + 60 * i, this.game.border.horizontal + 10, 50, 50);
                }
            }
        }

        class Game {
            constructor(width, height) {
                this.width = width;
                this.height = height;
                this.border = new Border(this);
                this.player = new Player(this, this.border.vertical, this.border.horizontal);
                this.input = new InputHandler(this);
                this.ui = new UI(this);
                this.keys = [];
                this.walls = [];
            }

            update(deltaTime) {
                this.player.update(deltaTime);
            }

            draw(context) {
                this.border.draw(context);
                this.walls.forEach(wall => {
                    wall.draw(context);
                });
                this.player.draw(context);
                this.ui.draw(context);
            }

            addGreyWall() {
                for(let i = 0; i < 5; i++) {
                    for(let j = 0; j < 3; j++) {
                        this.walls.push(new GreyWall(this, this.border.vertical + 150 + 300 * i, this.border.horizontal + 150 + 300 * j));
                    }
                }
            }

            checkCollision(rect1, rect2){
                return( rect1.x < rect2.x + rect2.width && 
                        rect1.x + rect1.width > rect2.x &&
                        rect1.y < rect2.y + rect2.height &&
                        rect1.height + rect1.y > rect2.y)
            }
        }

        const game = new Game(canvas.width, canvas.height);
        game.addGreyWall();

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
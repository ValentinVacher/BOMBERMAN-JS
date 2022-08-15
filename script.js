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
                            e.key === 'd' ||
                            e.key === ' ' ||
                            e.key === 'ArrowUp' ||
                            e.key === 'ArrowDown' ||
                            e.key === 'ArrowLeft' ||
                            e.key === 'ArrowRight' ||
                            e.key === 'Control') && 
                            this.game.keys.indexOf(e.key) === -1) {
                                this.game.keys.push(e.key);
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
                        if(wall.color === 'grey') {
                            this.markeForDeletion = true;
                        } else{
                            wall.markeForDeletion = true;
                            this.bomb.destroyedWall++;
                        }       
                    }
                });

                this.bomb.player.bombs.forEach(bomb => {
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
            constructor(game, player, x, y) {
                this.game = game;
                this.player = player;
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
                this.destroyedWall = 0;
            }

            update(deltaTime) {
                if( this.timer >= this.explosionTime &&
                    !this.explosion){
                        this.explosion = true;
                        this.explosions.push(   new Explosion(this.game, this, this.x, this.y), 
                                                new Explosion(this.game, this, this.x + 150, this.y), 
                                                new Explosion(this.game, this, this.x - 150, this.y), 
                                                new Explosion(this.game, this, this.x, this.y + 150), 
                                                new Explosion(this.game, this, this.x, this.y - 150));

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
                    !this.game.checkCollision(this, this.player)){
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
            constructor(game, x, y, up, down, left, right, inputBomb, color) {
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
                this.score = 5;
                this.up = up;
                this.down = down;
                this.right = right;
                this.left = left;
                this.inputBomb = inputBomb;
                this.color = color
            }

            update(deltaTime) {
                if(this.game.keys.includes(this.up) && this.game.keys.includes(this.down)) {
                    this.speedY = 0;
                } else if(this.game.keys.includes(this.up) && this.y > this.game.border.horizontal){
                    this.speedY = -this.maxSpeed;

                     while(this.y + this.speedY < this.game.border.horizontal) {
                        this.speedY++;
                    }
                } else if(this.game.keys.includes(this.down) && this.y + this.height < this.game.height - this.game.border.horizontal){
                    this.speedY = this.maxSpeed;

                    while(this.y + this.height + this.speedY > this.game.height - this.game.border.horizontal) {
                        this.speedY--;
                    }
                } else{
                    this.speedY = 0;
                }

                if(this.game.keys.includes(this.left) && this.game.keys.includes(this.right)) {
                        this.speedX = 0;
                } else if(  this.game.keys.includes(this.left) && this.x > this.game.border.vertical){
                    this.speedX = -this.maxSpeed;

                    while(this.x + this.speedX < this.game.border.vertical) {
                        this.speedX++;
                    }
                } else if(  this.game.keys.includes(this.right) && this.x + this.width < this.game.width - this.game.border.vertical){
                    this.speedX = this.maxSpeed;

                    while(this.x + this.width + this.speedX > this.game.width - this.game.border.vertical) {
                        this.speedX--;
                    }
                } else{
                    this.speedX = 0;
                }

                if(this.game.keys.includes(this.inputBomb)) {
                    this.setBomb();
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
                        for(let i = 1; i <= bomb.destroyedWall; i++){
                            this.score += i * 10
                        }
                    }
                });

                this.bombs = this.bombs.filter(bomb => !bomb.markeForDeletion);
                this.maxBombTimer += deltaTime;
            }

            draw(context){
                this.bombs.forEach(bomb => {
                    bomb.draw(context);
                });

                context.fillStyle = this.color;
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
                        this.bombs.push(new Bomb(this.game, this, x, y));
                        this.maxBomb--;
                        this.score -= 5;
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
                context.fillStyle = this.color;
                context.fillRect(this.x, this.y, this.width, this.height);
            }
        }

        class GreyWall extends Wall {
            constructor (game, x, y){
                super(game);
                this.x = x;
                this.y = y;
                this.color = 'grey';
            }
        }

        class BrownWall extends Wall {
            constructor(game, x, y) {
                super(game);
                this.x = x;
                this.y = y
                this.color = 'brown';
                this.markeForDeletion = false;
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
            constructor(game, player) {
                this.game = game;
                this.player = player;
                this.fontSize = 25;
                this.fontFamily = 'sans-serif';
            }

            draw(context){
                context.save();
                context.fillStyle = 'black';
                context.shadowOffsetX = 1;
                context.shadowOffsetY = 1;
                context.shadowColor = 'black'
                context.font = this.fontSize + 'px ' + this.fontFamily;

                // score
                context.fillText('Score: ' + this.player.score, this.game.border.vertical + 10, this.game.border.horizontal + 25);

                // bomb
                context.fillStyle = "yellow";
                for (let i = 0; i < this.player.maxBomb; i++){
                    context.fillRect(this.game.border.vertical + 10 + 60 * i, this.game.border.horizontal + 30, 50, 50);
                }

                context.restore();
            }
        }

        class Game {
            constructor(width, height) {
                this.width = width;
                this.height = height;
                this.border = new Border(this);
                this.greenPlayer = new Player(this, this.border.vertical, this.border.horizontal, 'z', 's', 'q', 'd', ' ', 'green');
                this.redPlayer = new Player(this, this.width - this.border.vertical - 120, this.height - this.border.horizontal - 130, 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Control', 'red')
                this.input = new InputHandler(this);
                this.ui = new UI(this, this.greenPlayer);
                this.keys = [];
                this.walls = [];
                this.nbBrownWall = 40;
            }

            update(deltaTime) {
                this.greenPlayer.update(deltaTime);
                this.redPlayer.update(deltaTime);

                this.walls = this.walls.filter(wall => !wall.markeForDeletion);
            }

            draw(context) {
                this.border.draw(context);
                this.walls.forEach(wall => {
                    wall.draw(context);
                });
                this.greenPlayer.draw(context);
                this.redPlayer.draw(context);
                this.ui.draw(context);
            }

            addGreyWall() {
                for(let i = 0; i < 5; i++) {
                    for(let j = 0; j < 3; j++) {
                        this.walls.push(new GreyWall(this, this.border.vertical + 150 + 300 * i, this.border.horizontal + 150 + 300 * j));
                    }
                }
            }

            addBrownWall() {
                let replace;
                for(let i = 0; i < 40; i++){
                    let brownWall = new BrownWall(this, Math.floor(Math.random() * 11) * 150 + this.border.vertical, Math.floor(Math.random() * 7) * 150 + this.border.horizontal);
                    
                    replace = true;

                    while(replace){
                        replace = false;

                        this.walls.forEach(wall => {
                            if(this.checkCollision(wall, brownWall)){
                                replace = true;
                            }
                        })

                        if( replace || 
                            ((brownWall.y == this.border.horizontal || brownWall.y == 900 + this.border.horizontal) && (brownWall.x < 300 + this.border.vertical || brownWall.x > 1200 + this.border.vertical)) ||
                            ((brownWall.y == 150 + this.border.horizontal || brownWall.y == 750 + this.border.horizontal) && (brownWall.x == this.border.vertical || brownWall.x == 1500 + this.border.vertical))){
                                brownWall = new BrownWall(this, Math.floor(Math.random() * 11) * 150 + this.border.vertical, Math.floor(Math.random() * 7) * 150 + this.border.horizontal);
                                replace = true
                            }
                    }

                    this.walls.push(brownWall);
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
        game.addBrownWall();

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
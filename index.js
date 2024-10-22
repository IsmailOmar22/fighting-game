const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 574;

c.fillRect(0, 0, canvas.width, canvas.height);


const gravity = 0.7;

let gameStart = false;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imgSrc: './img/background.png',
});

const shop = new Sprite({
    position: {
        x: 620,
        y: 160
    },
    imgSrc: './img/shop.png',
    scale: 2.5,
    framesMax: 6,
    
});

const player = new Fighter({
    position: { 
        x: 50, 
        y: 100,
    },

    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 0,
        y: 0
    },
    imgSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: { 
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imgSrc: './img/samuraiMack/Idle.png',
            framesMax: 8,

        },
        run: {
            imgSrc: './img/samuraiMack/Run.png',
            framesMax: 8,

        },
        jump: {
            imgSrc: './img/samuraiMack/Jump.png',
            framesMax: 2,

        },
        fall: {
            imgSrc: './img/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imgSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6,
        },
        attack2: {
            imgSrc: './img/kenji/Attack2.png',
            framesMax: 4,
        },
        takeHit: {
            imgSrc: './img/samuraiMack/Take hit - white silhouette.png',
            framesMax: 4,
        },
        death: {
            imgSrc: './img/samuraiMack/Death.png',
            framesMax: 6,
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50,
        },
        width: 145,
        height: 50,
    }
});


const enemy = new Fighter({
    position: { 
        x: 900, 
        y: 100,
    },

    velocity: {
        x: 0,
        y: 0,
    },
    color: 'blue',
    offset: { 
        x: -50,
        y: 50,
    },
    imgSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: { 
        x: 215,
        y: 169
    },
    sprites: {
        idle: {
            imgSrc: './img/kenji/Idle.png',
            framesMax: 4,

        },
        run: {
            imgSrc: './img/kenji/Run.png',
            framesMax: 8,

        },
        jump: {
            imgSrc: './img/kenji/Jump.png',
            framesMax: 2,

        },
        fall: {
            imgSrc: './img/kenji/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imgSrc: './img/kenji/Attack1.png',
            framesMax: 4,
        },
        attack2: {
            imgSrc: './img/kenji/Attack2.png',
            framesMax: 4,
        },
        takeHit: {
            imgSrc: './img/kenji/Take hit.png',
            framesMax: 3,
        },
        death: {
            imgSrc: './img/kenji/Death.png',
            framesMax: 7,
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50,
        },
        width: 170,
        height: 50,
    }

});




const keys = {
    a:{
        pressed: false,
    },
    d:{
        pressed: false,
    },
    ArrowLeft:{
        pressed: false,
    },
    ArrowRight:{
        pressed: false,
    }
};



function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    background.update();
    shop.update();

    c.fillStyle = 'rgba(225, 225, 225, 0.1)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //player movement
    if(keys.a.pressed && player.lastKey === 'a') {
        player.switchSprites('run');
        player.velocity.x = -10;
    }
    else if(keys.d.pressed && player.lastKey === 'd') {
        player.switchSprites('run');
        player.velocity.x = 10;
    }
    else{
        player.switchSprites('idle');
    }

    if(player.velocity.y < 0) {
        player.switchSprites('jump');
    }
    else if(player.velocity.y > 0) {
        player.switchSprites('fall');
    }
    //enemy movement
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.switchSprites('run');
        enemy.velocity.x = -10;
    }
    else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.switchSprites('run');
        enemy.velocity.x = 10;
    }
    else{
        enemy.switchSprites('idle');
    }

    if(enemy.velocity.y < 0) {
        enemy.switchSprites('jump');
    }
    else if(enemy.velocity.y > 0) {
        enemy.switchSprites('fall');
    }

    //collision detection
    if(rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    })&& player.isAttacking && player.frameCurrent === 4) {
        enemy.takeHit();
        player.isAttacking = false;
        gsap.to('#enemybar', {width: enemy.health + '%'});
    }

    // if player misses
    if(player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false;
    }

    if(rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    })&& enemy.isAttacking && enemy.frameCurrent === 2) {
        player.takeHit();
        enemy.isAttacking = false;
        gsap.to('#playerbar', {width: player.health + '%'});

    }


      // if enemy misses
      if(enemy.isAttacking && enemy.frameCurrent === 2) {
        enemy.isAttacking = false;
    }

    if(player.health <= 0 || enemy.health <= 0) {
        determineWinner({player, enemy, timerID});
    }

}

animate();

window.addEventListener('keydown', (e) => {

    if(!gameStart){
        return;
    }
    if(!player.dead) {
        
        switch(e.key) {
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'w':
                player.velocity.y = -20;
                break;
            case 's':
                player.Attack1();
                break; 
        }
    }

    if(!enemy.dead){
        switch(e.key) {
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowUp':
                enemy.velocity.y = -20;
                break;
            case 'ArrowDown':
                enemy.Attack1();
                break;
        }
    }
});

window.addEventListener('keyup', (e) => {
    switch(e.key) {
        case 'a':
            keys.a.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
    switch(e.key) {
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
    }
});

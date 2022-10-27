const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const backgroundImg = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./images/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./images/shop.png",
  scale: 2.75,
  frameMax: 6,
});

const player = new Fight({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./images/samuraiMack/idle.png",
  frameMax: 8,
  scale: 2.75,
  offset: {
    x: 215,
    y: 187,
  },
  sprites: {
    idele: {
      imageSrc: "./images/samuraiMack/Idle.png",
      frameMax: 8,
    },
    run: {
      imageSrc: "./images/samuraiMack/Run.png",
      frameMax: 8,
    },
    jump: {
      imageSrc: "./images/samuraiMack/Jump.png",
      frameMax: 2,
    },
    fall: {
      imageSrc: "./images/samuraiMack/Fall.png",
      frameMax: 2,
    },
    attack1: {
      imageSrc: "./images/samuraiMack/Attack1.png",
      frameMax: 6,
    },
    takeHit: {
      imageSrc: "./images/samuraiMack/Take Hit - white silhouette.png",
      frameMax: 4,
    },
    death: {
      imageSrc: "./images/samuraiMack/Death.png",
      frameMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const enemy = new Fight({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./images/kenji/Idle.png",
  frameMax: 4,
  scale: 2.75,
  offset: {
    x: 215,
    y: 202,
  },
  sprites: {
    idele: {
      imageSrc: "./images/kenji/idle.png",
      frameMax: 4,
    },
    run: {
      imageSrc: "./images/kenji/Run.png",
      frameMax: 8
    },
    jump: {
      imageSrc: "./images/kenji/Jump.png",
      frameMax: 2,
    },
    fall: {
      imageSrc: "./images/kenji/Fall.png",
      frameMax: 2,
    },
    attack1: {
      imageSrc: "./images/kenji/Attack1.png",
      frameMax: 4,
    },
    takeHit: {
      imageSrc: "./images/kenji/Take hit.png",
      frameMax: 3,
    },
    death: {
      imageSrc: "./images/kenji/Death.png",
      frameMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -175,
      y: 50,
    },
    width: 175,
    height: 50,
  },
});

enemy.draw();

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  backgroundImg.update();
  shop.update();
  c.fillStyle = 'rgba(255,255,255,0.12)'
  c.fillRect(0,0,canvas.width,canvas.height)
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movment

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprites("run");
  } 
  else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprites("run");
  }
   else {
    player.switchSprites("idele");
  }

  //  jump
  if (player.velocity.y < 0) {
    player.switchSprites("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprites("fall");
  }

  // enemyy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprites("run");
  } 
  else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprites("run");
  } 
  else {
    enemy.switchSprites("idele");
  }

  //  jump
  if (enemy.velocity.y < 0) {
    enemy.switchSprites("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprites("fall");
  }

  // detect for collision && enemy get hit
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.frameCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    enemy.health -= 10;
    gsap.to("#enemyHealth",{
      width: enemy.health + "%"
    })
  }

  // if player miss attack
  if (player.isAttacking && player.frameCurrent === 4) {
    player.isAttacking = false;
  }
  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking &&
    enemy.frameCurrent === 2
  ) {
    player.takeHit()
    enemy.isAttacking = false;
    player.health -= 10;
    gsap.to("#playerHealth",{
      width: player.health + "%"
    })
    console.log("enemy attack successful");
  }

  if (enemy.isAttacking && enemy.frameCurrent === 2) {
    enemy.isAttacking = false;
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    announceWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (e) => {
  if(!player.dead){

    switch (e.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        player.velocity.y = -20;
        break;
      case " ":
        player.attack();
        break;
  
      default:
        break;
    }
  }

  if (!enemy.dead) {
    
    switch (e.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        enemy.velocity.y = -20;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    
      default:
        break;
    }
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      lastKey = "w";
      break;
  }
  // enemy cases
  switch (e.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      lastKey = "w";
      break;
    default:
      break;
  }
});

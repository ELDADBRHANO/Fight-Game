const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;



const backgroundImg = new Sprite({
  position:{
    x: 0 ,
    y: 0
  },
  imageSrc: './images/background.png'
})

const shop = new Sprite({
  position:{
    x: 600 ,
    y: 128
  },
  imageSrc: './images/shop.png',
  scale: 2.75,
  frameMax: 6
})

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
  imageSrc: './images/samuraiMack/idle.png',
  frameMax:8,
  scale:2.75,
  offset:{
    x:215,
    y:178
  },
  sprites:{
    idele:{
      imageSrc: './images/samuraiMack/Idle.png',
      frameMax:8
    },
    run:{
      imageSrc: './images/samuraiMack/Run.png',
      frameMax:8,
    },
    jump:{
      imageSrc: './images/samuraiMack/Jump.png',
      frameMax:2,
    },
    fall:{
      imageSrc: './images/samuraiMack/Fall.png',
      frameMax:2,
    },
    attack1:{
      imageSrc: './images/samuraiMack/Attack1.png',
      frameMax:6,
    }
  }
});
console.log(player.imageSrc)
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

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  backgroundImg.update()
  shop.update()
  player.update();
  // enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;
  // player movment
  
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprites('run')
  }else{
    player.switchSprites('idele')
  }


  if(player.velocity.y < 0){
    player.switchSprites('jump')
  }else if(player.velocity.y > 0 ){
    player.switchSprites('fall')
  }
  // enemyy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  }

  // detect for collision
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.getElementById("enemyHealth").style.width = enemy.health + "%";
  }

  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.getElementById("playerHealth").style.width = player.health + "%";
    console.log("enemy attack successful");
  }

  // end game based on health
  if(enemy.health <=0 || player.health<=0){
    announceWinner({player,enemy, timerId})
  }

}

animate();

window.addEventListener("keydown", (e) => {
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
      enemy.isAttacking = true;
      break;
    default:
      break;
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

const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2;
class Sprite {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, 50, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else this.velocity.y += gravity;
  }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
});

const enemy = new Sprite({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
});

enemy.draw();

const keys = {
  a:{
    pressed:false
  },
  d:{
    pressed:false
  }
}
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0 ;
  
  if(keys.a.pressed){
    player.velocity.x = -1;
  }else if(keys.d.pressed){
    player.velocity.x = 1
  }
}

animate();


window.addEventListener('keydown',(e)=>{
  switch (e.key) {
    case 'd':
      keys.d.pressed = true
      break;
      case 'a':
      keys.a.pressed = true
      break;
  
    default:
      break;
  }
})


window.addEventListener('keyup',(e)=>{
  switch (e.key) {
    case 'd':
      keys.d.pressed = false;
      break;
      case 'a':
        keys.a.pressed = false;
        break;
  
    default:
      break;
  }
})
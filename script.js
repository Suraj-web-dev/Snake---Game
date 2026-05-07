const board = document.querySelector(".board");
const start = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startgamemodal = document.querySelector(".start");
const gameovermodal = document.querySelector(".game-over");
const restartbutton = document.querySelector(".btn-restart");
const highscoreelement = document.querySelector("#high-score");
const scoreelement = document.querySelector("#score");
const timeElement = document.querySelector("#time")



const blockHeught = 30;
const blockwidth = 30;
const blocks = [];


let highscore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = "00-00";

highscoreelement.innerText = highscore

let snake = [
  {
    x: 1,
    y: 3,
  },
  // {
  //   x: 1,
  //   y: 4,
  // },
  // {
  //   x: 1,
  //   y: 5,
  // },
];
let direction = "right";
const cols = Math.floor(board.clientWidth / blockwidth);
const rows = Math.floor(board.clientHeight / blockHeught);
let interval = null;
let timerintervalid = null
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
   

    blocks[`${row}-${col}`] = block;
  }
}

function render() {
  let head = null;

  blocks[`${food.x}-${food.y}`].classList.add("food");

  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }
  if (!head) return;
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(interval);
    modal.style.display = "flex";
    startgamemodal.style.display = "none";
    gameovermodal.style.display = "flex";
    return;
  }
    //food consume logic
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    blocks[`${food.x}-${food.y}`].classList.add("food");
    snake.unshift(head);

    score +=10;
    scoreelement.innerText = score;

    if (score > highscore){
      highscore = score;
      localStorage.setItem("highScore",highscore.toString())
    }
  }

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });
  console.log(head);

  snake.unshift(head);
  snake.pop();
  snake.forEach((segement) => {
    blocks[`${segement.x}-${segement.y}`].classList.add("fill");
  });
}

// interval = setInterval(() => {
//   render();
// }, 300);

start.addEventListener("click", () => {
  modal.style.display = "none";
  interval = setInterval(() => {
    render();
  }, 200);
  timerintervalid = setInterval(()=>{
    let [min , sec] = time.split("-").map(Number)

    if (sec == 59){
      min += 1
      sec = 0
    }else{
      sec +=1
    }
    time = `${min}-${sec}`
    timeElement.innerText = time
  },1000)
});

restartbutton.addEventListener("click", restartGame);
function restartGame() {
  blocks[`${food.x}-${food.y}`].classList.remove("food");
  snake.forEach(segment =>{
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
  })
  score = 0
  time = "00-00"
  modal.style.display = "none";
  snake = [{ x: 1, y: 3 }];
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
  direction = "down"
  scoreelement.innerText = score
  timeElement.innerText = time
  highscoreelement.innerText = highscore
  interval = setInterval(() => {
    render();
  }, 200);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") direction = "left";
  if (e.key === "ArrowRight") direction = "right";
  if (e.key === "ArrowUp") direction = "up";
  if (e.key === "ArrowDown") direction = "down";
});

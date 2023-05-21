const startBtn = document.querySelector('button[data-start]');
const stopBtn = document.querySelector('button[data-stop]');
const body = document.querySelector('body');

let timerId = null;

startBtn.addEventListener('click', () => {
  startBtn.setAttribute('disabled', 'true');
  stopBtn.removeAttribute('disabled');
  changeBodyColor();
  timerId = setInterval(() => {
    changeBodyColor();
  }, 1000);
});

function changeBodyColor() {
  body.style.backgroundColor = getRandomHexColor();
}

stopBtn.addEventListener('click', stopChangingColor);
function stopChangingColor() {
  startBtn.removeAttribute('disabled');
  clearInterval(timerId);
  stopBtn.setAttribute('disabled', 'true');
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}

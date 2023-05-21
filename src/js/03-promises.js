import Notiflix from 'notiflix';

const delayValue = document.querySelector('input[name="delay"]');
const stepValue = document.querySelector('input[name="step"]');
const amountValue = document.querySelector('input[name="amount"]');
const btn = document.querySelector('button');
const form = document.querySelector('form');
form.addEventListener('submit', onSubmit);

let delay = 0;

function onSubmit(event) {
  event.preventDefault();
  let firstDelay = Number(form.elements.delay.value);
  let stepDelay = Number(form.elements.step.value);
  let amount = Number(form.elements.amount.value);

  for (let i = 1; i <= amount; i += 1) {
    delay = firstDelay + (i - 1) * stepDelay;
    createPromise(i, delay);
  }
}

function createPromise(position, delay) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      const shouldResolve = Math.random() > 0.3;
      if (shouldResolve) {
        res({
          position,
          delay,
        });
      } else {
        rej({ position, delay });
      }
    }, delay);
  })
    .then(({ position, delay }) => {
      notifingSuccess(position, delay);
    })
    .catch(({ position, delay }) => {
      notifingFailure(position, delay);
    });
}

function notifingSuccess(position, delay) {
  return Notiflix.Notify.success(`Fulfilled promise ${position} in ${delay}ms`);
}

function notifingFailure(position, delay) {
  return Notiflix.Notify.failure(`Rejected promise ${position} in ${delay}ms`);
}

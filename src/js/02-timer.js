import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const startBtn = document.querySelector('button[data-start]');

const input = document.querySelector('#datetime-picker');
const fields = document.querySelectorAll('.field');
const timer = document.querySelector('.timer');
const labels = document.querySelectorAll('.label');
const values = document.querySelectorAll('.value');

const daysSpan = document.querySelector('span[data-days]');
const hoursSpan = document.querySelector('span[data-hours]');
const minutesSpan = document.querySelector('span[data-minutes]');
const secondsSpan = document.querySelector('span[data-seconds]');

// ------adding styles--
timer.style.marginTop = '20px';
timer.style.display = 'flex';
timer.style.gap = '22px';
timer.style.textTransform = 'uppercase';

labels.forEach(label => {
  label.style.fontSize = '11px';
  label.style.fontWeight = '500';
});

values.forEach(value => {
  value.style.fontSize = '30px';
  value.style.textAlign = 'center';
});

fields.forEach(field => {
  field.style.display = 'flex';
  field.style.flexDirection = 'column';
});
// ------------------
let ms = 0;
let selectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0].getTime() > new Date().getTime()) {
      startBtn.removeAttribute('disabled');
      ms = selectedDates[0].getTime() - new Date().getTime();
      selectedDate = selectedDates[0];
    } else {
      startBtn.setAttribute('disabled', 'true');
      notify();
    }
  },
};

flatpickr('#datetime-picker', options);

class CountDownTimer {
  constructor({ onTick, onFirstTick }) {
    this.onTick = onTick;
    this.onFirstTick = onFirstTick;
  }

  startTicking(chosenDate) {
    ms = chosenDate.getTime() - new Date().getTime();
    const time = this.convertMs(ms);
    this.onFirstTick(time);
    this.intervalId = setInterval(() => {
      ms = chosenDate.getTime() - new Date().getTime();
      const time = this.convertMs(ms);
      if (ms > 0) {
        this.onTick(time);
      } else {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = this.addLeadingZero(Math.floor(ms / day));
    // Remaining hours
    const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
    // Remaining minutes
    const minutes = this.addLeadingZero(
      Math.floor(((ms % day) % hour) / minute)
    );
    // Remaining seconds
    const seconds = this.addLeadingZero(
      Math.floor((((ms % day) % hour) % minute) / second)
    );

    return { days, hours, minutes, seconds };
  }

  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }
}

const startTimer = new CountDownTimer({
  onFirstTick: renderingMarkUpFirstTick,
  onTick: renderingMarkUpOnTick,
});

function renderingMarkUpFirstTick(time) {
  renderingMarkUp(time);
  startBtn.setAttribute('disabled', 'true');
  input.setAttribute('disabled', 'true');
  input.style.cursor = 'default';
}

function renderingMarkUpOnTick(time) {
  renderingMarkUp(time);
}

function renderingMarkUp({ days, hours, minutes, seconds }) {
  daysSpan.textContent = days;
  hoursSpan.textContent = hours;
  minutesSpan.textContent = minutes;
  secondsSpan.textContent = seconds;
}

function notify() {
  return Notiflix.Notify.failure('Please choose a date in the future');
}

startBtn.addEventListener('click', () => {
  if (selectedDate.getTime() < new Date().getTime()) {
    notify();
  } else {
    startTimer.startTicking(selectedDate);
  }
});

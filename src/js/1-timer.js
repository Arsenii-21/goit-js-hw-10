import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const backBtn = document.querySelector('.back-btn');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const picked = selectedDates[0];
    if (!picked) return;
    if (picked <= new Date()) {
      iziToast.error({ title: 'Error', message: 'Please choose a date in the future' });
      startBtn.disabled = true;
      userSelectedDate = null;
    } else {
      userSelectedDate = picked;
      startBtn.disabled = false;
    }
  },
};

flatpickr(datetimePicker, options);

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateInterface({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function setAllZero() {
  updateInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
}

startBtn.addEventListener('click', () => {
  if (!userSelectedDate || timerId) return;

  startBtn.disabled = true;
  datetimePicker.disabled = true;

  function tick() {
    const now = new Date();
    const ms = userSelectedDate - now;
    if (ms <= 0) {
      clearInterval(timerId);
      timerId = null;
      setAllZero();
      datetimePicker.disabled = false;
      startBtn.disabled = true;
      return;
    }
    const time = convertMs(ms);
    updateInterface(time);
  }

  // initial draw
  tick();
  timerId = setInterval(tick, 1000);
});

if (backBtn) {
  backBtn.addEventListener('click', () => {
    // navigate back to index page
    window.location.href = './index.html';
  });
}

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.getElementById('promise-form');

function createDelayedPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') resolve(delay);
      else reject(delay);
    }, delay);
  });
}

form.addEventListener('submit', event => {
  event.preventDefault();

  const formData = new FormData(form);
  const delay = Number(formData.get('delay'));
  const state = formData.get('state');

  if (!Number.isFinite(delay) || delay < 0) {
    iziToast.error({ title: 'Error', message: 'Please enter a valid non-negative delay' });
    return;
  }

  createDelayedPromise(delay, state)
    .then(ms => {
      iziToast.success({
        title: '',
        message: `✅ Fulfilled promise in ${ms}ms`,
        position: 'topRight',
        timeout: 4000,
        close: true,
        class: 'custom-toast success',
      });
      console.log(`✅ Fulfilled promise in ${ms}ms`);
    })
    .catch(ms => {
      iziToast.error({
        title: '',
        message: `❌ Rejected promise in ${ms}ms`,
        position: 'topRight',
        timeout: 4000,
        close: true,
        class: 'custom-toast error',
      });
      console.log(`❌ Rejected promise in ${ms}ms`);
    });

});

// back button behavior (like timer)
const backBtn = document.querySelector('.back-btn');
if (backBtn) {
  backBtn.addEventListener('click', () => {
    window.location.href = './index.html';
  });
}

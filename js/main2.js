'use strict';

{
  const timer = document.getElementById('timer');
  const start = document.getElementById('start');
  const stop = document.getElementById('stop');
  const reset = document.getElementById('reset');
 
  const workTime = 0.5;
  const breakTime = 0.5;
  let startTime;
  let timeoutId;
  let elapsedTime = 0;

  timer.textContent = `${String(workTime).padStart(2, '0')}:00`;

  class CountDownTimer {
    constructor() {
      this.state = state;
    }
    countDown(time) {
      const restTime = (time * 60 *1000) - elapsedTime - (Date.now() - startTime);
      const restMin = String(Math.floor((restTime / 1000 / 60) % 60)).padStart(2, '0');
      const restSec = String(Math.floor((restTime / 1000) % 60)).padStart(2, '0');
      timer.textContent = `${restMin}:${restSec}`;
      timeoutId = setTimeout(() => {
        countDown(time);
      }, 100);
    }
  }

  function countDown(time) {
    timeoutId = setInterval(() => {
      const restTime = (time * 60 *1000) - elapsedTime - (Date.now() - startTime);
      const restMin = String(Math.floor((restTime / 1000 / 60) % 60)).padStart(2, '0');
      const restSec = String(Math.floor((restTime / 1000) % 60)).padStart(2, '0');
      timer.textContent = `${restMin}:${restSec}`;
    }, 1000);
  }

  start.addEventListener('click', () => {
    startTime = Date.now();
    countDown(workTime);
  });

  stop.addEventListener('click', () => {
    clearTimeout(timeoutId);
    elapsedTime += Date.now() - startTime;
  });
}
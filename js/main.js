'use strict';

{
  const timer = document.getElementById('timer');
  const start = document.getElementById('start');
  const stop = document.getElementById('stop');
  const reset = document.getElementById('reset');
 
  const workTime = 0.1;
  const breakTime = 0.2;
  let startTime;
  let workTimeoutId;
  let breakTimeoutId;
  let elapsedTime = 0;
  let count = 0;

  // 最初のレンダリング後の描画
  timer.textContent = `${String(workTime).padStart(2, '0')}:00`;

  // ミリ秒で残り時間を計算する

  function workTimeCountDown() {
    const remainigTime = (workTime * 60 *1000) - elapsedTime - (Date.now() - startTime);
    const restMin = String(Math.floor((remainigTime / 1000 / 60) % 60)).padStart(2, '0');
    const restSec = String(Math.floor((remainigTime / 1000) % 60)).padStart(2, '0');
    timer.textContent = `${restMin}:${restSec}`;
    if ( remainigTime > 0 ) {
      workTimeoutId = setTimeout(() => {
        workTimeCountDown();
        }, 100); 
      } else {
      clearTimeout(workTimeoutId);
      startTime = Date.now();
      breakTimeCountDown();
    }
  }

  function breakTimeCountDown() {
    const remainigTime = (breakTime * 60 *1000) - elapsedTime - (Date.now() - startTime);
    const restMin = String(Math.floor((remainigTime / 1000 / 60) % 60)).padStart(2, '0');
    const restSec = String(Math.floor((remainigTime / 1000) % 60)).padStart(2, '0');
    timer.textContent = `${restMin}:${restSec}`;
    if ( remainigTime > 0 ) {
      breakTimeoutId = setTimeout(() => {
        breakTimeCountDown();
        }, 100); 
      } else {
      clearTimeout(breakTimeoutId);
      startTime = Date.now();
      workTimeCountDown();
    }
  }



  start.addEventListener('click', () => {
    startTime = Date.now();
    workTimeCountDown();
  });

  stop.addEventListener('click', () => {
    clearTimeout(workTimeoutId);
    elapsedTime += Date.now() - startTime;
  });

  reset.addEventListener('click', () => {
    timer.textContent = `${String(workTime).padStart(2, '0')}:00`;;
    elapsedTime = 0;
  });
}
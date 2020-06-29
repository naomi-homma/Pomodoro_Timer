'use strict';

{
  const timer = document.getElementById('timer');
  const start = document.getElementById('start');
  const stop = document.getElementById('stop');
  const reset = document.getElementById('reset');

  const workTime = 25;
  let startTime;
  let timeoutId;
  let elapsedTime = 0;

// countdown関数を作成する
// 出力：25分-(クリックした時刻からの経過時間-クリック時刻)

  // function countDown() {
  //   timeoutId = setInterval(() => {
  //     console.log(rest);
  //     rest = (25 * 60 * 1000)-(Date.now() - startTime);
  //   }, 1000);
  // };

  // ミリ秒で残り時間を計算する

  function countDown() {
    const rest = (workTime * 60 *1000) - elapsedTime - (Date.now() - startTime);
    const restMin = String(Math.floor((rest / 1000 / 60) % 60)).padStart(2, '0');
    const restSec = String(Math.floor((rest / 1000) % 60)).padStart(2, '0');
    timer.textContent = `${restMin}:${restSec}`;
    timeoutId = setTimeout(() => {
      countDown();
    }, 1000);
  }

  start.addEventListener('click', () => {
    startTime = Date.now();
    countDown();
  });

  stop.addEventListener('click', () => {
    clearTimeout(timeoutId);
    elapsedTime += Date.now() - startTime;
  });

  reset.addEventListener('click', () => {
    const resetTime = String(workTime);
    timer.textContent = `${resetTime}:00`;
    elapsedTime = 0;
  });
}
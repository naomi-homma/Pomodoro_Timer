'use strict';

{
  const timer = document.getElementById('timer');
  const start = document.getElementById('start');
  const stop = document.getElementById('stop');
  const reset = document.getElementById('reset');
  const timeState = document.getElementById('timeState');
  const cycle = document.getElementById('cycle');
 
  const workTime = 0.1;
  const breakTime = 0.2;
  const longBreakTime = 0.3;
  let state = "work";
  let startTime;
  let workTimeoutId;
  let breakTimeoutId;
  let longBreakTimeoutId;
  let elapsedTime = 0;
  let initCount = 3;
  let count = 1;

  // 最初のレンダリング後の描画
  timer.textContent = `${String(workTime).padStart(2, '0')}:00`;
  timeState.textContent = state;
  cycle.textContent = `1/${initCount}`;

  // ミリ秒で残り時間を計算する
  // workTimeCountDown関数⇒残り時間の計算、ミリ秒から(分、秒)への変換、描画を行う
  // 残り時間が0になったらカウントダウンを止めて、breakTimeCountDownを呼び出す
  function workTimeCountDown() {
    state = "work";
    const remainigTime = (workTime * 60 *1000) - elapsedTime - (Date.now() - startTime);
    const restMin = String(Math.floor((remainigTime / 1000 / 60) % 60)).padStart(2, '0');
    const restSec = String(Math.floor((remainigTime / 1000) % 60)).padStart(2, '0');
    timer.textContent = `${restMin}:${restSec}`;
    if ( remainigTime > 0 ) {
      workTimeoutId = setTimeout(() => {
        workTimeCountDown();
        }, 100); 
      } else if ( remainigTime < 0 && count === 3 ) {
        clearTimeout(workTimeoutId);
        startTime = Date.now();
        elapsedTime = 0;
        longBreakTimeCountDown();
        timeState.textContent = state;
      } else {
      clearTimeout(workTimeoutId);
      startTime = Date.now();
      elapsedTime = 0;
      breakTimeCountDown();
      timeState.textContent = state;
    }
  }

  function breakTimeCountDown() {
    state = "break";
    const remainigTime = (breakTime * 60 *1000) - elapsedTime - (Date.now() - startTime);
    const restMin = String(Math.floor((remainigTime / 1000 / 60) % 60)).padStart(2, '0');
    const restSec = String(Math.floor((remainigTime / 1000) % 60)).padStart(2, '0');
    timer.textContent = `${restMin}:${restSec}`;
    timeState.textContent = state;
    if ( remainigTime > 0 ) {
      breakTimeoutId = setTimeout(() => {
        breakTimeCountDown();
        }, 100); 
      } else {
      clearTimeout(breakTimeoutId);
      startTime = Date.now();
      elapsedTime = 0;
      count ++;
      cycle.textContent = `${count}/${initCount}`;
      workTimeCountDown();
      timeState.textContent = state;
    }
  }

  function longBreakTimeCountDown() {
    state = "longBreak";
    const remainigTime = (longBreakTime * 60 *1000) - elapsedTime - (Date.now() - startTime);
    const restMin = String(Math.floor((remainigTime / 1000 / 60) % 60)).padStart(2, '0');
    const restSec = String(Math.floor((remainigTime / 1000) % 60)).padStart(2, '0');
    timer.textContent = `${restMin}:${restSec}`;
    timeState.textContent = state;
    if ( remainigTime > 0 ) {
      longBreakTimeoutId = setTimeout(() => {
        longBreakTimeCountDown();
        }, 100); 
      } else {
      clearTimeout(longBreakTimeoutId);
      startTime = Date.now();
      elapsedTime = 0;
      count = 1;
      cycle.textContent = `${count}/${initCount}`;
      workTimeCountDown();
      timeState.textContent = state;
    }
  }

  start.addEventListener('click', () => {
    startTime = Date.now();
    switch (state) {
      case "work": workTimeCountDown();
        break;
      case "break": breakTimeCountDown();
        break;
      case "longBreak": longBreakTimeCountDown();
        break;
    }
  });

  stop.addEventListener('click', () => {
    switch (state) {
      case "work": clearTimeout(workTimeoutId);
        break;
      case "break": clearTimeout(breakTimeoutId);
        break;
      case "longBreak": clearTimeout(longBreakTimeoutId);
        break;
    }
    elapsedTime += Date.now() - startTime;
  });

  reset.addEventListener('click', () => {
    timer.textContent = `${String(workTime).padStart(2, '0')}:00`;
    elapsedTime = 0;
  });
}
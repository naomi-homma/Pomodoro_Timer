'use strict';

{
  const timer = document.getElementById('timer');
  const start = document.getElementById('start');
  const stop = document.getElementById('stop');
  const reset = document.getElementById('reset');
  const timeState = document.getElementById('timeState');
  const cycle = document.getElementById('cycle');
 
  // workTime、breakTime、longBreakTime、cycleCountは後々ユーザーが入力できるようにしたい
  // workTime：作業時間
  // breakTime：小休憩時間
  // longBreakTime：長休憩時間
  // cycleCountt：（作業+小休憩）のサイクル回数

  const workTime = 0.1;
  const breakTime = 0.2;
  const longBreakTime = 0.3;

  // 状態をstateで管理する：work,break,longBreak
  let state = "work";
  let startTime;
  let workTimeoutId;
  let breakTimeoutId;
  let longBreakTimeoutId;
  let elapsedTime = 0;
  let cycleCount = 3; 
  let count = 1;

  // 最初のレンダリング後の描画
  timer.textContent = `${String(workTime).padStart(2, '0')}:00`;
  timeState.textContent = state;
  cycle.textContent = `1/${cycleCount}`;

  // workTimeCountDown()、breakTimeCountDown()、longBreakTimeCountDown()を
  // 各ターン終了後に呼び出す

  function workTimeCountDown() {
    state = "work";
    // 残り時間をミリ秒で計算⇒分・秒に変換⇒描画
    const remainigTime = (workTime * 60 *1000) - elapsedTime - (Date.now() - startTime);
    const restMin = String(Math.floor((remainigTime / 1000 / 60) % 60)).padStart(2, '0');
    const restSec = String(Math.floor((remainigTime / 1000) % 60)).padStart(2, '0');
    timer.textContent = `${restMin}:${restSec}`;
    // ●0になるまではカウントダウンを繰り返す
    if ( remainigTime > 0 ) {
      workTimeoutId = setTimeout(() => {
        workTimeCountDown();
        }, 100); 
      // ●指定回数のサイクルが終了したら長休憩に入る
      } else if ( remainigTime < 0 && count === cycleCount ) {
        clearTimeout(workTimeoutId);
        startTime = Date.now();
        elapsedTime = 0;
        longBreakTimeCountDown();
        timeState.textContent = state;
      } else {
      // ●指定回数のサイクル未満は小休憩に入る
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
      // ●小休憩に入ったらcountを増やして状態を管理する
      clearTimeout(breakTimeoutId);
      startTime = Date.now();
      elapsedTime = 0;
      count ++;
      cycle.textContent = `${count}/${cycleCount}`;
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
      // ●長い休憩が終了したらcountを1に戻し最初へ戻る
      clearTimeout(longBreakTimeoutId);
      startTime = Date.now();
      elapsedTime = 0;
      count = 1;
      cycle.textContent = `${count}/${cycleCount}`;
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
    switch (state) {
      case "work": timer.textContent = `${String(workTime).padStart(2, '0')}:00`;
        break;
      case "break": timer.textContent = `${String(breakTime).padStart(2, '0')}:00`;
        break;
      case "longBreak": timer.textContent = `${String(longBreakTime).padStart(2, '0')}:00`;
        break;
    }
    elapsedTime = 0;
  });
}
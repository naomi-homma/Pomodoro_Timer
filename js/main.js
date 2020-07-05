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

  const workTime = 0.2;
  const breakTime = 0.2;
  const longBreakTime = 0.1;

  let state = "work";
  let startTime;
  let timeoutId;
  let elapsedTime = 0;
  let cycleCount = 3; 
  let count = 1;

  const audio = new Audio();

  // StateとCountを表示
  function displayState (state, count) {
    timeState.textContent = state;
    if (state === "work")
      cycle.textContent = `${count}/${cycleCount}`;
  }

  // Timerを表示
  function displayTime(time) {
    timer.textContent = `${String(time).padStart(2, '0')}:00`;
  }

  function countDown(time) {
    const remainigTime = (time * 60 *1000) - elapsedTime - (Date.now() - startTime);
    const restMin = String(Math.floor((remainigTime / 1000 / 60) % 60)).padStart(2, '0');
    const restSec = String(Math.floor((remainigTime / 1000) % 60)).padStart(2, '0');
    timer.textContent = `${restMin}:${restSec}`;
    document.title = `${restMin}:${restSec} Pomodoro Timer`;
    if (remainigTime >= 0) {
      timeoutId = setTimeout(() => {
        countDown(time);
        }, 100); 
    } else if (remainigTime < 0 ) {
      clearTimeout(timeoutId);
      startTime = Date.now();
      elapsedTime = 0;
      if (count === cycleCount && state === "work") {
        audio.src = "../assets/hatoclock.mp3#t=0,3.5";
        audio.play();
        state = "longBreak";
        displayState(state);
        countDown(longBreakTime);
      } else if (state === "work") {
        audio.src = "../assets/hatoclock.mp3#t=0,3.5";
        audio.play();
        state = "break";
        displayState(state);
        countDown(breakTime);
      } else if (state === "break") {
        audio.src = "../assets/school-chime1.mp3#t=0,10.5";
        audio.play();
        state = "work";
        count ++;
        displayState(state, count);
        countDown(workTime);
      } else if (state === "longBreak") {
        audio.src = "../assets/school-chime1.mp3#t=0,10.5";
        audio.play();
        state = "work";
        count = 1;
        displayState(state, count);
        countDown(workTime);
      }
    }
  }

  // START, STOP, RESETボタンのクリック制御
  function setButtonStateInitial() {
    start.disable = false;
    stop.disabled = true;
    reset.disabled = true;
  }

  function setButtonStateRunning() {
    start.disabled = true;
    stop.disabled = false;
    reset.disabled = true;
  }

  function setButtonStateStopped() {
    start.disabled = false;
    stop.disabled = true;
    reset.disabled = false;
  }

  // 一番最初のレンダリング直後の描画
  displayState(state, count);
  displayTime(workTime);
  setButtonStateInitial();

  start.addEventListener('click', () => {
    setButtonStateRunning();
    startTime = Date.now();
    switch (state) {
      case "work": countDown(workTime);
        break;
      case "break": countDown(breakTime);
        break;
      case "longBreak": countDown(longBreakTime);
        break;
    }
  });

  stop.addEventListener('click', () => {
    setButtonStateStopped();
    clearTimeout(timeoutId);
    elapsedTime += Date.now() - startTime;
  });

  reset.addEventListener('click', () => {
    setButtonStateInitial();
    switch (state) {
      case "work": displayTime(workTime);
        break;
      case "break": displayTime(breakTime);
        break;
      case "longBreak": displayTime(longBreakTime);
        break;
    }
    elapsedTime = 0;
  });
}
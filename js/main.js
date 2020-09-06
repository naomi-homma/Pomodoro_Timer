'use strict';

{
  const timer = document.getElementById('timer');
  const start = document.getElementById('start');
  const stop = document.getElementById('stop');
  const reset = document.getElementById('reset');
  const timeState = document.getElementById('timeState');
  const cycle = document.getElementById('cycle');
  const input_worktime = document.getElementById('input_worktime');
  const input_breaktime = document.getElementById('input_breaktime');
  const input_longbreaktime = document.getElementById('input_longbreaktime');
  const input_cyclecount = document.getElementById('input_cyclecount');
  const form_id = document.getElementById('form_id');
 
  // workTime、breakTime、longBreakTime、cycleCountは後々ユーザーが入力できるようにしたい
  // workTime：作業時間
  // breakTime：小休憩時間
  // longBreakTime：長休憩時間
  // cycleCountt：（作業+小休憩）のサイクル回数

  // 初期値
  let workTime = 25;
  let breakTime = 5;
  let longBreakTime = 20;
  let cycleCount = 4; //長休憩までの回数
  let state = "work";

  let startTime;
  let timeoutId;
  let elapsedTime = 0;
  let count = 1;

  // 効果音再生
  const audio = new Audio();

  // StateとCountを表示
  function displayState (state, count) {
    timeState.textContent = state;
    if (state === "work")
      cycle.textContent = `${count}/${Number(cycleCount)+1}`;
  }

  // Timerを表示
  function displayTime(time) {
    timer.textContent = `${String(time).padStart(2, '0')}:00`;
  }

  // inputの取得値を表示
  function displayInput(workTime, breakTime, longBreakTime, cycleCount) {
    input_worktime.textContent = `：${workTime}`;
    input_breaktime.textContent = `：${breakTime}`;
    input_longbreaktime.textContent = `：${longBreakTime}`;
    input_cyclecount.textContent = `：${cycleCount}`;
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
        audio.src = "https://naomi-homma.github.io/Pomodoro_Timer/assets/audio/hatoclock.mp3#t=0,3.5";
        const playPromise = audio.play();
        if(playPromise !== undefined) {
          playPromise.then(_ => {
          })
          .catch(error => {
            console.log(error);
          });
        }
        state = "longBreak";
        displayState(state);
        countDown(longBreakTime);
      } else if (state === "work") {
        audio.src = "https://naomi-homma.github.io/Pomodoro_Timer/assets/audio/hatoclock.mp3#t=0,3.5";
        const playPromise = audio.play();
        if(playPromise !== undefined) {
          playPromise.then(_ => {
          })
          .catch(error => {
            console.log(error);
          });
        }
        state = "break";
        console.log(count);
        console.log(cycleCount);
        displayState(state);
        countDown(breakTime);
      } else if (state === "break") {
        audio.src = "https://naomi-homma.github.io/Pomodoro_Timer/assets/audio/school-chime1.mp3#t=0,10.5";
        const playPromise = audio.play();
        if(playPromise !== undefined) {
          playPromise.then(_ => {
          })
          .catch(error => {
            console.log(error);
          });
        }
        state = "work";
        count ++;
        displayState(state, count);
        countDown(workTime);
      } else if (state === "longBreak") {
        audio.src = "https://naomi-homma.github.io/Pomodoro_Timer/assets/audio/school-chime1.mp3#t=0,10.5";
        const playPromise = audio.play();
        if(playPromise !== undefined) {
          playPromise.then(_ => {
          })
          .catch(error => {
            console.log(error);
          });
        }
        state = "work";
        count = 1;
        displayState(state, count);
        countDown(workTime);
      }
    }
  }

  // START, STOP, RESETボタンのクリック制御
  function setButtonStateInitial() {
    start.disabled = false;
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

  // user設定反映
  form_id.addEventListener('submit', () => {
    workTime = work_time.value;
    breakTime = break_time.value;
    longBreakTime = longbreak_time.value;
    cycleCount = cycle_count.value;
    displayInput(workTime, breakTime, longBreakTime, cycleCount);
    displayTime(workTime);
    displayState(state, count);
  });

  // 一番最初のレンダリング直後の描画
  displayState(state, count);
  displayTime(workTime);
  displayInput(workTime, breakTime, longBreakTime, cycleCount);
  setButtonStateInitial();

}
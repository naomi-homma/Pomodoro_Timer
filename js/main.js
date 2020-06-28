'use strict';

{
  const timer = document.getElementById('timer');
  const start = document.getElementById('start');
  const stop = document.getElementById('stop');
  const reset = document.getElementById('reset');

  let startTime;
  let timeoutId;

// countdown関数を作成する
// 出力：25分-(クリックした時刻からの経過時間-クリック時刻)

  function countDown() {
    const d = new Date(Date.now() - startTime);
    console.log(d);

    timeoutId = setTimeout(() => {
      countDown();
    }, 1000);
  };

  start.addEventListener('click', () => {
    startTime = Date.now();
    countDown();
  })
}
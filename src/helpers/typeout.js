//
// typeout.js - type out a string with typewriter effect
//

function typeout(string, wrapper, speed, on_complete) {
  const arr = string.split('');
  let i = 0;
  let timeout;

  function run() {
    // End of string
    if (i >= arr.length) {
      if (on_complete) {
        on_complete();
      }
      return;
    }

    // Pauses: ^100 etc.
    let m = string.substring(i, i+10).match(/^\^(\d+)/);
    if (m !== null) {
      const delay_ms = parseInt(m[1]);
      i += m[1].length + 1;
      setTimeout(run, delay_ms);
      return;
    }

    // Simply append
    wrapper.textContent += arr[i++];
    setTimeout(run, speed);
  }

  function stop() {
    clearTimeout(timeout);
  }

  run();

  return { stop };
}

export default typeout;


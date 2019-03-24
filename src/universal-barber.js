//
// app.js - welcome to universal barber
//

import Big from 'big.js';
import M from './model';
import controllers from './controllers';


// Load or set up state for new game
// ------------------------------

function load() {
  const model_loaded = M.load();
  if (!model_loaded) {
    return false;
  }
}

function new_game() {
  M.mk_controller('sanity__happy_hair_salon');
}

load() || new_game();


// Game loop
// ------------------------------

function loop() {
  const t = performance.now();
  let delta_t = 0;
  if (loop.last_t !== undefined) {
    delta_t = (t - loop.last_t) * 0.001;
  }

  const should_save = (
    loop.t_last_save === undefined ||
    t - loop.t_last_save > 10000
  );
  if (should_save) {
    M.save();
    loop.t_last_save = t;
  }

  loop.last_t = t;
  delta_t = Math.max(delta_t, 0.05);
  delta_t = Math.min(delta_t, 0.2);

  // Update controllers
  M.state.controllers.forEach(c => c.instance.update(delta_t));
  controllers.core.update();
}
loop.start = function() { loop.timer = setInterval(loop, 50) };
loop.stop = function() { clearInterval(loop.timer); };
loop.start();

window.universal_barber = loop;  // For convenience


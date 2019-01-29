//
// app.js - welcome to universal barber
//

import Big from 'big.js';

import * as controllerman from './controllerman';
import * as c_core from './controllers/core.js';
import sanity__happy_hair_salon from './controllers/sanity__happy-hair-salon';


c_core.set_title('Happy Hair Salon');
c_core.update();


// Add initial controller
// ------------------------------

controllerman.add_controller(sanity__happy_hair_salon());


// Game loop
// ------------------------------

function loop() {
  const t = performance.now();
  let delta_t = 0;
  if (loop.last_t !== undefined) {
    delta_t = (t - loop.last_t) * 0.001;
  }
  loop.last_t = t;
  delta_t = Math.max(delta_t, 0.05);
  delta_t = Math.min(delta_t, 0.2);

  // Update controllers
  controllerman.get_controllers().forEach((c) => c.update(delta_t));
  c_core.update();
}
loop.start = function() { loop.timer = setInterval(loop, 50) };
loop.stop = function() { clearInterval(loop.timer); };
loop.start();

window.universal_barber = loop;  // For convenience


//
// app.js - welcome to universal barber
//

import Big from 'big.js';

import * as controllerman from './controllerman';
import * as c_core from './controllers/core.js';
import c1_salon_haircut_btn from './controllers/c1-salon-haircut-btn';


c_core.set_title('Happy Hair Salon');
c_core.update();


// Add initial controller
// ------------------------------

controllerman.add_controller(c1_salon_haircut_btn());
c_core.set_story(`
- Welcome to Happy Hair Salon.^200 It’s great to see you.^1000
- Oh look,^100 customers!
`);


// Game loop
// ------------------------------

function loop(t) {
  let delta_t = 0.05;
  if (loop.last_t !== undefined) {
    delta_t = (t - loop.last_t) * 0.001;
    loop.last_t = t;
  }
  loop.last_t = t;
  delta_t = Math.max(delta_t, 0.05);

  // Update controllers
  controllerman.get_controllers().forEach((c) => c.update(delta_t));
  c_core.update();

  // Loop
  loop.enqueue();
}
loop.enqueue = () => loop.timer = requestAnimationFrame(loop);
loop.stop = () => cancelAnimationFrame(loop.timer);
loop.enqueue();

window.universal_barber = loop;  // For convenience

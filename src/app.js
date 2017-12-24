//
// app.js - welcome to universal barber
//

import Big from 'big.js';

import * as model from './model';
import * as renderman from './renderman';
import * as controllerman from './controllerman';
import c1_salon_haircut_btn from './controllers/c1-salon-haircut-btn';


renderman.set_title('Happy Hair Salon');
renderman.update();


// Add initial controller
// ------------------------------

controllerman.add_controller(c1_salon_haircut_btn());


// Game loop
// ------------------------------

function loop(t) {
  let delta_t = 0.04;
  if (loop.last_t === undefined) {
    loop.last_t = t;
  }
  else {
    delta_t = (t - loop.last_t) * 0.001;
    loop.last_t = t;
  }

  // Update controllers
  controllerman.get_controllers().forEach((c) => c.update(delta_t));

  // Render
  renderman.update();

  // Loop
  loop.enqueue();
}
loop.enqueue = () => loop.timer = requestAnimationFrame(loop);
loop.stop = () => cancelAnimationFrame(loop.timer);
loop.enqueue();

window.universal_barber = loop;  // For convenience

//
// app.js - welcome to universal barber
//

import Big from 'big.js';
import controllers from './controllers';
import model from './model';


// Controllers
// ------------------------------

const live_controllers = [ ];

function mk_controller(name) {
  // Get uid
  if (mk_controller.uid === undefined) {
    mk_controller.uid = 0;
  }
  const uid = mk_controller.uid++;

  const c = controllers[name](uid);
  c.name = name;
  c.uid = `c-${uid}`;

  return c;
}

function save_controllers() {
  try {
    const controllers_data = live_controllers.map(c => [ c.name, c.uid ]);
    localStorage.setItem('ub-controllers', JSON.stringify(controllers_data));
  }
  catch(error) {
    console.log(error);
  }
}

live_controllers.push(mk_controller('sanity__happy_hair_salon'));


// Initialize game loop
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
    model.save();
    save_controllers();
    loop.t_last_save = t;
  }

  loop.last_t = t;
  delta_t = Math.max(delta_t, 0.05);
  delta_t = Math.min(delta_t, 0.2);

  // Update controllers
  live_controllers.forEach(c => c.update(delta_t));
  controllers.core.update();
}
loop.start = function() { loop.timer = setInterval(loop, 50) };
loop.stop = function() { clearInterval(loop.timer); };
loop.start();

window.universal_barber = loop;  // For convenience


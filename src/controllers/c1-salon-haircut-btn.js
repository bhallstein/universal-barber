//
// controllers/c1-salon-haircut-btn.js
//
// - simple initial controller, creates a haircut button
//

import * as renderman from '../renderman';
import model from '../model';
import create_element from '../helpers/create_element';

export default function instance() {
  let e = {
    renderer_div : null,
    btn           : null,
    customer_count_wrap   : null,
    customer_count_n      : null,
    customer_count_label  : null,
    customer_count_plural : null,
  };

  let customer_rate = 0.2;   // Per second (probabilistic)
  let customers_waiting = 0;

  function init() {
    e.renderer_div = renderman.get_renderer_slot();

    e.btn = create_element('<input type="button" value="Give haircut" class="c1-btn" disabled>');

    e.customer_count_wrap = create_element(`
      <div class="c1-cust-count" style="float: right;">
        <span class="c1-cust-count__n">0</span>
        <span class="c1-cust-count__label">
          customer<span class="c1-cust-count__plural">s</span> waiting</span>
        </span>
      </div>
    `);
    e.customer_count_n = e.customer_count_wrap.querySelector('.c1-cust-count__n');
    e.customer_count_label = e.customer_count_wrap.querySelector('.c1-cust-count__label');
    e.customer_count_plural = e.customer_count_wrap.querySelector('.c1-cust-count__plural');

    e.renderer_div.appendChild(e.btn);
    e.renderer_div.appendChild(e.customer_count_wrap);

    e.btn.addEventListener('click', cb__btn_click);
  }
  init();

  function tear_down() {
    e.btn.removeEventListener('click', cb__btn_click);

    renderman.remove_renderer(e.renderer_div);
    e = { };
  }

  function cb__btn_click(ev) {
    model.haircuts = model.haircuts.plus(1);
    --customers_waiting;
    disp_update();
  }

  function update(delta_t) {
    let changed = false;

    // Spawn customers
    let spawn_probability = customer_rate * delta_t;
    if (Math.random() <= spawn_probability) {
      ++customers_waiting;
      changed = true;
    }

    if (changed) {
      disp_update();
    }
  }

  function disp_update() {
    e.btn.disabled = customers_waiting === 0;
    e.customer_count_n.textContent = customers_waiting;
    e.customer_count_plural.style.display = customers_waiting === 1 ? 'none' : 'inline';
  }

  return {
    tear_down,
    update,
  };
}

//
// controllers/sanity__happy-hair-salon.js
//
// - simple initial controller
//

import * as renderman from '../renderman';
import model from '../model';
import create_element from '../helpers/create_element';
import * as core from './core';

function mk_instance() {
  const e = {
    renderer_div : null,
    btn          : null,
    customer_count_wrap   : null,
    customer_count_n      : null,
    customer_count_label  : null,
    customer_count_plural : null,
  };

  const customer_initial_delay = 5;

  const story = [
    {
      text:      "It's a nice salon you have here. Could use a lick of paint, maybe.",
      time:      4,
      timer:     null,
    },
    {
      text:      "Oh look, customers!",
      time:      8,
      timer:     null,
    },
    {
      text:      "Are you a barber or what?",
      time:      30,
      timer:     null,
      condition: () => model.haircuts.eq(0),
    },
  ];

  let p_customer_spawns_1s = 0.1;    // Per second (probabilistic)
  let customers_waiting = 0;
  let max_customers = 4;
  let spawn = false;

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

    init_story();
    setTimeout(() => spawn = true, customer_initial_delay * 1000);
  }
  init();

  function init_story() {
    story.forEach(item => {
      setTimeout(() => story_cb(item), item.time * 1000);
    });
  }
  function story_cb(item) {
    const passed = !item.condition || item.condition();
    if (passed) {
      core.push_story(`- ${item.text}`);
    }
  }


  function tear_down() {
    e.btn.removeEventListener('click', cb__btn_click);
    renderman.remove_renderer(e.renderer_div);
    e = { };
  }

  function cb__btn_click(ev) {
    model.haircuts = model.haircuts.plus(1);
    --customers_waiting;
    display_update();
  }

  function update(delta_t) {
    let changed = false;

    // Spawn customers
    if (spawn) {
      let spawn_probability = p_customer_spawns_1s * delta_t;
      if (Math.random() <= spawn_probability) {
        ++customers_waiting;
        changed = true;
      }
      customers_waiting = Math.min(customers_waiting, max_customers);
    }

    if (changed) {
      display_update();
    }
  }

  function display_update() {
    e.btn.disabled = customers_waiting === 0;
    e.customer_count_n.textContent = customers_waiting;
    e.customer_count_plural.style.display = customers_waiting === 1 ? 'none' : 'inline';
  }

  return {
    tear_down,
    update,
  };
}

export default mk_instance;


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
  const story = [
    {
      text:      'Nice shop you have here. It could use a lick of paint, maybe.',
      time:      4,
    },
    {
      text:      'Oh look, customers!',
      time:      8,
    },
    {
      text:      'Are you a barber or what?',
      time:      30,
      condition: () => model.haircuts.eq(0),
    },
    {
      text:      'A cold mist curls around the door frame.',
      time:      60,
    },
  ];

  let customers_waiting = 0;
  let max_customers = 4;
  let spawn = false;
  let haircut_price = 1;

  const customer_initial_delay = 5;
  let p_customer_spawns_1s = 0.1;      // Per second (probabilistic)

  const haircut_threshold_for_razor_offer = 10;
  const p_offer_of_razor_purchase = 0.3;
  const price_of_razor = 10;
  let razor_offered = false;
  let razor_purchased = false;

  const e = {
    renderer_div : null,
    wrapper: null,
    customer_count_n      : null,
    customer_count_label  : null,
    customer_count_plural : null,
    haircut_btn : null,

    razor_purchase_wrapper: null,
    razor_purchase_btn: null,

    create() {
      e.wrapper = create_element(`
        <div>
          <div style="float: right;">
            <span class="cust-count__n">0</span>
            <span class="cust-count__label">
              customer<span class="cust-count__plural">s</span> waiting</span>
            </span>
          </div>
          <input type="button" class="haircut-btn" value="Give haircut" disabled>

          <div class="razor-purchase" style="display: none;">
            <input type="button" class="razor-purchase-btn" value="Purchase the old razor" title="\$${price_of_razor}">
          </div>
        </div>
      `);
      e.customer_count_n = e.wrapper.querySelector('.cust-count__n');
      e.customer_count_label = e.wrapper.querySelector('.cust-count__label');
      e.customer_count_plural = e.wrapper.querySelector('.cust-count__plural');
      e.haircut_btn = e.wrapper.querySelector('.haircut-btn');

      e.razor_purchase_wrapper = e.wrapper.querySelector('.razor-purchase');
      e.razor_purchase_btn = e.wrapper.querySelector('.razor-purchase-btn');

      e.renderer_div = renderman.get_renderer_slot();
      e.renderer_div.appendChild(e.wrapper);
    },
  };

  function init() {
    e.create();
    e.haircut_btn.addEventListener('click', cb__haircut_btn__click);
    e.razor_purchase_btn.addEventListener('click', cb__razor_purchase_btn__click);

    init_story();
    setTimeout(() => spawn = true, customer_initial_delay * 1000);
  }
  init();

  function init_story() {
    story.timeouts = story.map(item => setTimeout(_ => story_cb(item), item.time * 1000));
  }

  function story_cb(item) {
    const condition_met = !item.condition || item.condition();
    if (condition_met) {
      core.push_story(`${item.text}`);
    }
  }

  function tear_down() {
    e.haircut_btn.removeEventListener('click', cb__haircut_btn__click);
    story.timeouts.forEach(clearTimeout);
    renderman.remove_renderer(e.renderer_div);
    e = { };
  }

  function cb__haircut_btn__click(ev) {
    model.haircuts = model.haircuts.plus(1);
    model.money = model.money.plus(haircut_price);
    --customers_waiting;

    if (!razor_offered && model.haircuts.gte(haircut_threshold_for_razor_offer)) {
      if (Math.random() <= p_offer_of_razor_purchase) {
        offer_razor();
      }
    }
  }

  function offer_razor() {
    razor_offered = true;

    core.push_story('‘Would you care to purchase my old razor?’ enquires an old gent on his way out. He doesn’t meet your eye.');
    setTimeout(_ => {
      core.push_story('The razor is grimy and old, but would polish up all right.');
    }, 5000);

    setTimeout(_ => { e.razor_purchase_wrapper.style.display = 'block'; }, 8000);
  }

  function cb__razor_purchase_btn__click() {
    razor_purchased = true;
    e.razor_purchase_wrapper.style.display = 'none';

    model.money = model.money.minus(price_of_razor);
  }

  function update(delta_t) {
    // Spawn customers
    if (spawn) {
      let spawn_probability = p_customer_spawns_1s * delta_t;
      if (Math.random() <= spawn_probability) {
        ++customers_waiting;
      }
      customers_waiting = Math.min(customers_waiting, max_customers);
    }

    e.haircut_btn.disabled                = customers_waiting === 0;
    e.customer_count_n.textContent        = customers_waiting;
    e.customer_count_plural.style.display = customers_waiting === 1 ? 'none' : 'inline';
  }

  return {
    tear_down,
    update,
  };
}

export default mk_instance;


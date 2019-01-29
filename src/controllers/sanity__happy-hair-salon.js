//
// controllers/sanity__happy-hair-salon.js
//
// - simple initial controller
//

import * as renderman from '../renderman';
import model from '../model';
import * as core from './core';
import create_element from '../helpers/create-element';
import timed_story_helper from '../helpers/timed-story-helper';

function mk_instance() {
  const story_items = [
    {
      text:      'Welcome to Happy Hair Salon.',
      time:      0,
    },
    {
      text:      'Nice shop you have here. It could use a lick of paint, maybe.',
      time:      4,
    },
    {
      text:      'Ah, customers.',
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

  // Haircut queue
  let haircut_queue = 0;
  let haircut_queue__max = 4;
  let haircut_queue__enabled = false;
  let haircut_queue__initial_delay = 5;
  let haircut_price = 1;
  let haircut_queue__p_spawn = 0.1;    // Per second (probabilistic)

  // Shave queue
  let shave_queue = 0;
  let shave_queue__max = 2;
  let shave_queue__enabled = false;
  let shave_price = 1;
  let shave_queue__p_spawn = 0.08;      // Per second (probabilistic)

  // Razor offer/purchase
  const haircut_threshold_for_razor_offer = 10;
  const p_offer_of_razor_purchase = 0.3;
  const price_of_razor = 15;
  const razor_polish_msg = 'You polish the razor.';
  let razor_offered = false;
  let razor_purchased = false;

  // Polishing
  const polish_every = 2;
  let razor_polished = false;


  const e = {
    create() {
      e.wrapper = create_element(`
        <div>
          <div class="haircut">
            <div style="float: right;">
              <span class="haircut-customer-count">0</span>
              <span class="haircut-customer-label">
                customer<span class="haircut-customer-label__plural">s</span> waiting</span>
              </span>
            </div>
            <input type="button" class="haircut-btn" value="Cut hair" disabled>
          </div>

          <div class="razor-purchase" style="display: none;">
            <input type="button" class="razor-purchase-btn" value="Purchase the old razor" title="£${price_of_razor}">
          </div>

          <div class="shaving" style="display: none;">
            <div style="float: right;">
              <span class="shave-customer-count">0</span>
              <span class="shave-customer-label">
                customer<span class="shave-customer-label__plural">s</span> waiting</span>
              </span>
            </div>
            <input type="button" class="shave-btn" value="Shave" disabled><br>
            <input type="button" class="polish-btn" value="Polish razor" disabled>
          </div>
        </div>
      `);
      e.haircut_customer_count        = e.wrapper.querySelector('.haircut-customer-count');
      e.haircut_customer_count_label  = e.wrapper.querySelector('.haircut-customer-label');
      e.haircut_customer_count_plural = e.wrapper.querySelector('.haircut-customer-label__plural');
      e.haircut_btn                   = e.wrapper.querySelector('.haircut-btn');

      e.razor_purchase_wrapper = e.wrapper.querySelector('.razor-purchase');
      e.razor_purchase_btn     = e.wrapper.querySelector('.razor-purchase-btn');

      e.shave_wrapper               = e.wrapper.querySelector('.shaving');
      e.shave_customer_count        = e.wrapper.querySelector('.shave-customer-count');
      e.shave_customer_count_label  = e.wrapper.querySelector('.shave-customer-label');
      e.shave_customer_count_plural = e.wrapper.querySelector('.shave-customer-label__plural');
      e.shave_btn                   = e.wrapper.querySelector('.shave-btn');
      e.polish_btn                  = e.wrapper.querySelector('.polish-btn');

      e.renderer_div = renderman.get_renderer_slot();
      e.renderer_div.appendChild(e.wrapper);
    },
  };


  function init() {
    e.create();

    e.haircut_btn.addEventListener('click', cb__haircut_btn__click);
    e.razor_purchase_btn.addEventListener('click', cb__razor_purchase_btn__click);
    e.shave_btn.addEventListener('click', cb__shave_btn__click);
    e.polish_btn.addEventListener('click', cb__polish_btn__click);

    story_items.helper = timed_story_helper(story_items);
    setTimeout(() => haircut_queue__enabled = true, haircut_queue__initial_delay*1000);
  }
  init();


  function tear_down() {
    story_items.helper.cancel();
    e.haircut_btn.removeEventListener('click', cb__haircut_btn__click);
    renderman.remove_renderer(e.renderer_div);
    e = { };
  }


  function offer_razor() {
    razor_offered = true;

    core.push_story('Hesitating on his way out, an OLD GENT turns and offers you his old razor. He doesn’t meet your eye.');
    setTimeout(_ => {
      core.push_story('The razor is grimy and old, but would polish up all right.');
    }, 5000);

    setTimeout(_ => { e.razor_purchase_wrapper.style.display = 'block'; }, 8000);
  }


  function cb__haircut_btn__click(ev) {
    model.haircuts = model.haircuts.plus(1);
    model.money = model.money.plus(haircut_price);
    --haircut_queue;

    if (!razor_offered && model.haircuts.gte(haircut_threshold_for_razor_offer)) {
      if (Math.random() <= p_offer_of_razor_purchase) {
        offer_razor();
      }
    }
  }


  function cb__razor_purchase_btn__click() {
    model.money = model.money.minus(price_of_razor);

    razor_purchased = true;
    shave_queue__enabled = true;

    e.razor_purchase_wrapper.style.display = 'none';

    razor_polished = true;
    core.push_story(razor_polish_msg);
  }


  function cb__shave_btn__click() {
    model.shaves = model.shaves.plus(1);
    model.money = model.money.plus(shave_price);
    --shave_queue;
    razor_polished = false;
  }


  function cb__polish_btn__click() {
    razor_polished = true;
    core.push_story(razor_polish_msg);
  }


  function razor_needs_polishing() {
    return !model.shaves.eq(0) && model.shaves.mod(polish_every).eq(0) && !razor_polished;
  }


  function update(delta_t) {
    // Spawn customers
    if (haircut_queue__enabled) {
      if (Math.random() <= haircut_queue__p_spawn * delta_t) {
        ++haircut_queue;
      }
      haircut_queue = Math.min(haircut_queue, haircut_queue__max);
    }

    if (shave_queue__enabled) {
      if (Math.random() <= shave_queue__p_spawn * delta_t) {
        ++shave_queue;
      }
      shave_queue = Math.min(shave_queue, shave_queue__max);
    }

    e.haircut_customer_count.textContent          = haircut_queue;
    e.haircut_customer_count_plural.style.display = haircut_queue === 1 ? 'none' : 'inline';
    e.haircut_btn.disabled                        = haircut_queue === 0;

    e.razor_purchase_btn.disabled = model.money.lt(price_of_razor);

    const needs_polishing = razor_needs_polishing();
    e.shave_wrapper.style.display               = razor_purchased ? 'block' : 'none';
    e.shave_customer_count.textContent          = shave_queue;
    e.shave_customer_count_plural.style.display = shave_queue === 1 ? 'none' : 'inline';
    e.shave_btn.disabled                        = shave_queue === 0 || needs_polishing;
    e.polish_btn.disabled                       = !needs_polishing;
  }

  return {
    tear_down,
    update,
  };
}

export default mk_instance;


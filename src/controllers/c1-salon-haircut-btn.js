//
// controllers/c1-salon-haircut-btn.js
//
// - simple initial controller, creates a haircut button
//

import * as renderman from '../renderman';
import * as model from '../model';


export default function instance() {
  let renderer_div;
  let btn;

  function init() {
    renderer_div = renderman.get_renderer_slot();

    btn = document.createElement('input');
    btn.setAttribute('type', 'button');
    btn.setAttribute('value', 'Give haircut');
    btn.classList.add('c1-btn');
    btn.addEventListener('click', cb__btn_click);

    renderer_div.appendChild(btn);
  }
  init();

  function tear_down() {
    btn.removeEventListener('click', cb__btn_click);

    renderman.remove_renderer(renderer_div);
    renderer_div = undefined;
    btn = undefined;
  }

  function cb__btn_click(ev) {
    model.add_haircut();
  }

  function update() {

  }

  return {
    tear_down,
    update,
  };
}

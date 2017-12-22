//
// renderman.js - top-level render manager
//
// - displays main title section
// - allocates slots for other renderers
//

import * as model from './model';


// Elements
// ------------------------------

const el = {
  wrap: document.getElementsByClassName('barber-wrap')[0],

  renderer_ctnr: document.getElementsByClassName('renderers')[0],
  renderer_slots: [ ],

  top: {
    title: document.getElementsByClassName('top-section__title')[0],
    state: document.getElementsByClassName('top-section__state')[0],
  },
};


// Top section
// ------------------------------

function set_title(title) {
  el.top.title.textContent = title;
}


// Update
// ------------------------------
// - refresh core state dislay

function update() {
  let n = model.n_haircuts().toFixed();

  if (update.prev_n_haircuts !== n) {
    el.top.state.textContent = `${model.n_haircuts().toFixed()} haircuts completed`;
    update.prev_n_haircuts = n;
  }
}
update.prev_n_haircuts = null;


// Slot providing
// ------------------------------

function get_renderer_slot() {
  let div = document.createElement('div');
  div.classList.add('render-slot');

  el.renderer_ctnr.appendChild(div);
  el.renderer_slots.push(div);

  return div;
}

function remove_renderer(div) {
  el.renderer_slots = el.renderer_slots.filter((sl) => sl !== div);
  div.parentNode.removeChild(div);
}


export {
  set_title,
  get_renderer_slot,
  update,
}

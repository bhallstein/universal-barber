//
// renderman.js - render manager, allocates slots for renderers
//


const el = {
  renderer_ctnr: document.getElementsByClassName('renderers')[0],
  renderer_slots: [ ],
};


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
  get_renderer_slot,
  remove_renderer,
}

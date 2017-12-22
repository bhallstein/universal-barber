//
// model.js - track core state of the barbershop universe
//

import Big from 'big.js';


let state = {
  n_haircuts: Big(0),
};


// Getters
// ------------------------------

function n_haircuts() {
  return state.n_haircuts;
}


// add_haircuts() - takes a JS number or a 'Big'
// ------------------------------

function add_haircuts(n) {
  if (typeof n === 'number') {
    n = Big(n);
  }

  if (n.constructor !== Big) {
    throw Error('n invalid');
  }

  state.n_haircuts = state.n_haircuts.plus(n);
}

function add_haircut() {
  add_haircuts(1);
}

export {
  n_haircuts,
  add_haircuts,
  add_haircut,
}

//
// model.js - track core state of the barbershop universe
//

import Big from 'big.js';


function is_bigjs(str) {
  return (
    typeof v === 'string' &&
    v.match(/^-?\d+(?:\.\d+)?(?:e[+\-]?\d+)?$/i)
  );
}


function save() {
  try {
    localStorage.setItem('ub', JSON.stringify(state));
  }
  catch (error) {
    // Unable to store
  }
}


function load() {
  try {
    const data = JSON.parse(localStorage.getItem('ub'), (k, v) => {
      return is_bigjs(v) ? new Big(v) : v;
    });
    state = data;
  }
  catch (error) {
    // Unable to load
  }
}


function init_controller_state(uid) {
  const s = { };
  state[`c-${uid}`] = s;
  return s;
}


let state = {
  haircuts: Big(0),
  shaves: Big(0),
  money: Big(0),

  save,
  load,
  init_controller_state,
};


export default state;


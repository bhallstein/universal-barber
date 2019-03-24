//
// model.js - track core state of the barbershop universe
//

import Big from 'big.js';
import controllers from './controllers';
import recursive_obj_copy from './helpers/recursive_obj_copy';


function convert_from_stored_big(x) {
  const is_big = (
    typeof x === 'string' &&
    x.match(/^Big\/\/.+/)
  );

  return !is_big ? null : new Big(x.substr(5));
}


function save() {
  function f_obj(key, value) {
    if (value.constructor === Function) {
      return null;
    }

    if (value.constructor === Big) {  // Bigs
      return `Big//${value.valueOf()}`;
    }

    if (value.uid !== undefined) {  // Controllers
      return {
        type: value.type,
        uid: value.uid,
        state: recursive_obj_copy(value.state, f_obj, f_treat_obj_as_item),
      };
    }

    return value;
  }

  function f_treat_obj_as_item(value) {
    return value.uid !== undefined;
  }

  try {
    const data_to_save = recursive_obj_copy(model.state, f_obj, f_treat_obj_as_item);
    localStorage.setItem('ub', JSON.stringify(data_to_save));
  }
  catch (error) {
    // Unable to store
  }
}


function load() {
  function f_obj(key, value) {
    return convert_from_stored_big(value) || value;
  }

  try {
    const model_data = JSON.parse(localStorage.getItem('ub'));

    model.state = recursive_obj_copy(model_data, f_obj, _ => false);
    model.state.controllers.forEach(c => c.instance = load_controller(c));

    return true;
  }
  catch (error) {
    console.log('load error:', error);
    return false;
  }
}


function get_uid() {
  if (get_uid.uid === undefined) {
    get_uid.uid = 0;
  }

  let uid = null;
  do {
    uid = get_uid.uid;
    ++get_uid.uid;
  } while (model.state.controllers.find(c => c.uid === uid) !== undefined);

  return uid;
}


function mk_controller(type) {
  const c = {
    type,
    uid: get_uid(),
    state: { },
  };

  c.instance = controllers[type](c.uid, c.state, true);
  model.state.controllers.push(c);

  return c;
}


function load_controller(c) {
  return controllers[c.type](c.uid, c.state, false);
}


const model = {
  state: {
    haircuts: Big(0),
    shaves: Big(0),
    money: Big(0),

    controllers: [ ],
  },

  get_uid,
  mk_controller,

  save,
  load,
};


export default model;


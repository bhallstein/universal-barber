//
// controllerman.js - manage controller registration/removal
//

let controllers = [ ];


function is_controller(c) {
  // c is considered to be a controller if it has an update() function
  return (c && typeof c.update === 'function');
}


function add_controller(c) {
  if (!is_controller(c)) {
    throw Error('c is not a controller');
  }

  controllers.push(c);
}

function remove_controller(c) {
  controllers = controllers.filter((_c) => _c !== c);
}

function get_controllers() {
  return controllers;
}


export {
  add_controller,
  remove_controller,
  get_controllers,
};


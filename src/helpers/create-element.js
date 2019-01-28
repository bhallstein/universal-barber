//
// create-element.js - create HTML element from string
//

export default function create_element(str) {
  let div = document.createElement('div');
  div.innerHTML = str;

  return div.firstElementChild;
}


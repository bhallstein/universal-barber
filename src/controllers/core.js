//
// controllers/core.js - perma-controller
//
// - renders model (core player state)
// - renders title
// - renders story
// - is not registered with controllerman, because it does not have a render slot
//

import Typed from 'typed.js';
import * as model from '../model';

const el = {
  title: document.getElementsByClassName('top-section__title')[0],
  state: document.getElementsByClassName('top-section__state')[0],

  story: document.getElementsByClassName('story-time__inner')[0],
};


// Title
// ------------------------------

function set_title(title) {
  el.title.textContent = title;
}


// Story
// ------------------------------

function set_story(story) {
  if (typeof story !== 'string') {
    throw new Error("'story' invalid")
  }

  if (set_story.typed) {
    set_story.typed.stop();
    set_story.typed.destroy();
    set_story.typed = undefined;
  }

  set_story.typed = new Typed(el.story, {
    strings:      [ story ],
    typeSpeed:    10,
    showCursor:   false,
  });
}


// Update
// ------------------------------
// - refresh core state dislay
//

function update() {
  let n = model.n_haircuts().toFixed();

  if (update.prev_n_haircuts !== n) {
    el.state.textContent = `${model.n_haircuts().toFixed()} haircuts completed`;
    update.prev_n_haircuts = n;
  }
}
update.prev_n_haircuts = null;


export {
  set_title,
  set_story,

  update,
}

//
// controllers/core.js - perma-controller
//
// - renders model (core player state)
// - renders title
// - renders story
// - is not registered with controllerman, because it does not have a render slot
//

import Typed from 'typed.js';
import model from '../model';

const el = {
  title: document.querySelector('.top-section__title'),
  state: document.querySelector('.top-section__state'),
  story: document.querySelector('.story-time__inner'),
};


// Title
// ------------------------------

function set_title(title) {
  el.title.textContent = title;
}


// Story
// ------------------------------

const story_state = {
  running: false,
  typed: null,
  queue: [ ],    // strings
};

function push_story(story) {
  if (story.length > 0 && !story.match(/^\s+$/)) {
    story = `- ${story}`;
  }
  story = story.replace(/([\.\?\!])\s/g, '$1^320 ');
  story = story.replace(/\,\s/g, ',^160 ');

  if (typeof story !== 'string') {
    throw new Error("'story' invalid")
  }

  story_state.queue.push(story);
  story__begin();
}

function clear_story() {
  story_state.running = false;

  if (story_state.typed) {
    story_state.typed.stop();
    story_state.typed.destroy();
    story_state.typed = null;
  }

  el.story.innerHTML = '';
}

function story__begin() {
  if (story_state.running || !story_state.queue.length) {
    return;
  }

  const item = story_state.queue[0];
  story_state.queue = story_state.queue.slice(1);

  // Begin item
  const div_entry = document.createElement('div');
  el.story.appendChild(div_entry);

  story_state.running = true;
  story_state.typed = new Typed(div_entry, {
    strings:    [ item ],
    typeSpeed:  10,
    showCursor: false,
    onComplete: story__complete_item,
  });
}

function story__complete_item() {
  story_state.running = false;
  story__begin();
}


// Update
// ------------------------------
// - refresh core state dislay
//

function update() {
  const s = {
    haircuts: model.haircuts.toFixed(),
    money:      model.money.toFixed(),
  };

  if (JSON.stringify(s) !== JSON.stringify(update.s_prev)) {
    el.state.innerHTML = `
      ${s.haircuts} haircuts
      ${s.haircuts !== '0' && s.money !== '0' ? '<br>' : ''}
      ${s.money !== '0' ? `\$${s.money}`: ''}
    `;
    update.s_prev = s;
  }
}
update.s_prev = null;


export {
  set_title,
  push_story,
  clear_story,
  update,
};


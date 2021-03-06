//
// controllers/core.js - perma-controller
//
// - renders model (core player state)
// - renders title
// - renders story
// - is not registered with controllerman, because it does not have a render slot
//

import typeout from '../helpers/typeout';
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
  typeout: null,
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

  if (story_state.typeout) {
    story_state.typeout.stop();
    story_state.typeout = null;
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
  typeout(item, div_entry, 20, story__complete_item);
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
    shaves:   model.shaves.toFixed(),
    money:    model.money.toFixed(),
  };

  if (JSON.stringify(s) !== JSON.stringify(update.s_prev)) {
    el.state.innerHTML = `
      ${s.haircuts} haircuts<br>
      ${model.shaves.gt(0) ? `${s.shaves} shaves<br>` : ''}
      £${s.money}
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


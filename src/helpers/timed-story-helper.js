//
// timed-story-helper.js
//

import * as core from '../controllers/core';

function timed_story_helper(items) {
  const timeouts = items.map(item => setTimeout(_ => run(item), item.time * 1000));

  function run(item) {
    const condition_met = !item.condition || item.condition();
    if (condition_met) {
      core.push_story(item.text);
    }
  }

  function cancel() {
    timeouts.forEach(clearTimeout);
  }

  return {
    cancel,
  };
}

export default timed_story_helper;


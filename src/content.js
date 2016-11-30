import parallel from 'async/parallel';
import minimatch from 'minimatch';
import storage from './lib/storage';
import { GET_PROJECT_NAME } from './lib/actions';

const projectNameRegexp = new RegExp('https://bitbucket.org/([^/]+/[^/]+)');
const projectName = window.location.href.match(projectNameRegexp)[1];

chrome.runtime.onMessage.addListener((action, sender, respond) => {
  if (action.type === GET_PROJECT_NAME) {
    respond(projectName);
  }
});

parallel([
  (callback) => {
    storage.getRules(projectName, (rules) => {
      callback(null, rules);
    });
  },
  (callback) => {
    const wrapper = document.getElementById('pr-tab-content');
    const observer = new MutationObserver(() => {
      callback(null, wrapper);
      observer.disconnect();
    });

    observer.observe(wrapper, {
      childList: true,
      subtree: true
    });
  }
], (err, [rules, wrapper]) => {
  const files = Array.prototype.slice.call(wrapper.querySelectorAll('.commentable-diff'));
  files.forEach((file) => {
    const path = file.getAttribute('data-path');
    if (isIgnored(path, rules)) {
      file.style.display = 'none';
    }

    const addRuleButton = document.createElement('button');
    addRuleButton.classList.add('aui-button');
    addRuleButton.classList.add('aui-button-light');
    addRuleButton.textContent = 'Hide file';
    addRuleButton.addEventListener('click', () => {
      const newRule = prompt('Would you like to hide files matching this pattern?', path);
      if (!newRule) {
        return;
      }

      storage.addRule(projectName, newRule);
      file.style.display = 'none';
    });

    file.querySelector('.aui-buttons').appendChild(addRuleButton);
  });
});

function isIgnored(path, rules) {
  return rules.some((rule) => minimatch(path, rule));
}

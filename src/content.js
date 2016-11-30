import minimatch from 'minimatch';
import storage from './lib/storage';
import { GET_PROJECT_NAME, RULES_CHANGE } from './lib/actions';

const projectNameRegexp = new RegExp('https://bitbucket.org/([^/]+/[^/]+)');
const projectName = window.location.href.match(projectNameRegexp)[1];

chrome.runtime.onMessage.addListener((action, sender, respond) => {
  if (action.type === GET_PROJECT_NAME) {
    respond(projectName);
  }
});

const wrapper = document.getElementById('pr-tab-content');
const observer = new MutationObserver(() => {
  observer.disconnect();

  const listOfChangedFiles = Array.prototype.slice.call(wrapper.querySelectorAll('.file'));
  listOfChangedFiles.forEach((file) => {
    const label = document.createElement('span');
    label.setAttribute('data-hidden-label', '1');
    label.style.display = 'none';
    label.style.color = '#707070';
    label.textContent = '(hidden)';
    file.appendChild(label);
  });

  const filesDiff = Array.prototype.slice.call(wrapper.querySelectorAll('.commentable-diff'));
  filesDiff.forEach((file) => {
    const path = file.getAttribute('data-path');

    const addRuleButton = document.createElement('button');
    addRuleButton.classList.add('aui-button');
    addRuleButton.classList.add('aui-button-light');
    addRuleButton.textContent = 'Hide file';
    addRuleButton.addEventListener('click', () => {
      const newRule = prompt('Would you like to hide files matching this pattern?', path);
      if (!newRule) {
        return;
      }

      storage.addRule(projectName, newRule, updateHiddenFilesFromStorage);
    });

    file.querySelector('.aui-buttons').appendChild(addRuleButton);
  });

  updateHiddenFilesFromStorage();

  chrome.runtime.onMessage.addListener((action) => {
    if (action.type === RULES_CHANGE) {
      updateHiddenFilesFromStorage();
    }
  });

  function updateHiddenFilesFromStorage() {
    storage.getRules(projectName, (rules) => {
      if (hasUser(projectName)) {
        const user = getUser(projectName);
        storage.getRules(user, (userRules) => {
          updateHiddenFilesElements(userRules.concat(rules));
        });
      } else {
        updateHiddenFilesElements(rules);
      }
    });
  }

  function updateHiddenFilesElements(rules) {
    listOfChangedFiles.forEach((file) => {
      const path = file.getAttribute('data-file-identifier');
      if (isIgnored(path, rules)) {
        file.querySelector('[data-hidden-label]').style.display = '';
      } else {
        file.querySelector('[data-hidden-label]').style.display = 'none';
      }
    });

    filesDiff.forEach((file) => {
      const path = file.getAttribute('data-path');
      if (isIgnored(path, rules)) {
        file.style.display = 'none';
      } else {
        file.style.display = '';
      }
    });
  }

  function hasUser(projectName) {
    return projectName.indexOf('/') > 0;
  }

  function getUser(projectName) {
    return projectName.split('/')[0];
  }

  function isIgnored(path, rules) {
    return rules.some((rule) => minimatch(path, rule));
  }
});

observer.observe(wrapper, {
  childList: true,
  subtree: true
});

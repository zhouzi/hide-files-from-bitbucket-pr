import { GET_PROJECT_NAME } from './lib/actions';
import storage from './lib/storage';

chrome.tabs.query({
  active: true,
  currentWindow: true
}, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, {
    action: GET_PROJECT_NAME
  }, (projectName) => {
    if (projectName == null) {
      return;
    }

    const projectNameElement = document.getElementById('project-name');
    projectNameElement.textContent = projectName;

    storage.getRules(projectName, (rules) => {
      const pendingScreen = document.getElementById('pending-screen');
      pendingScreen.style.display = 'none';

      const rulesListElement = document.getElementById('rules-list');
      rules.forEach(addRuleElement);

      const formElement = document.getElementById('add-rule-form');
      const inputElement = document.getElementById('add-rule-input');

      formElement.addEventListener('submit', (event) => {
        event.preventDefault();

        const newRule = inputElement.value;
        storage.addRule(projectName, newRule);
        addRuleElement(newRule);

        inputElement.value = '';
      });

      function addRuleElement(rule) {
        const ruleElement = document.createElement('li');
        ruleElement.textContent = rule;

        const button = document.createElement('button');
        button.textContent = 'remove';
        button.addEventListener('click', () => {
          storage.removeRule(projectName, rule);
          removeRuleElement(ruleElement);
        });

        ruleElement.appendChild(button);
        rulesListElement.appendChild(ruleElement);
      }

      function removeRuleElement(ruleElement) {
        rulesListElement.removeChild(ruleElement);
      }
    });
  });
});

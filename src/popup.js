import { GET_PROJECT_NAME, RULES_CHANGE } from './lib/actions';
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

      const activeScreen = document.getElementById('active-screen');
      activeScreen.style.display = '';

      const rulesListElement = document.getElementById('rules-list');
      rules.forEach(addRuleElement);

      const formElement = document.getElementById('add-rule-form');
      const inputElement = document.getElementById('add-rule-input');

      formElement.addEventListener('submit', (event) => {
        event.preventDefault();

        const newRule = inputElement.value;
        storage.addRule(projectName, newRule, emitRulesChange);
        addRuleElement(newRule);

        inputElement.value = '';
      });

      function addRuleElement(rule) {
        const ruleElement = document.createElement('li');
        ruleElement.classList.add('table');

        const masterCell = document.createElement('div');
        masterCell.classList.add('table-cell');
        masterCell.classList.add('table-cell--master');
        masterCell.textContent = rule;

        ruleElement.appendChild(masterCell);

        const button = document.createElement('button');
        button.textContent = 'Remove';
        button.addEventListener('click', () => {
          storage.removeRule(projectName, rule, emitRulesChange);
          removeRuleElement(ruleElement);
        });

        const slaveCell = document.createElement('div');
        slaveCell.classList.add('table-cell');
        slaveCell.appendChild(button);

        ruleElement.appendChild(slaveCell);
        rulesListElement.appendChild(ruleElement);
      }

      function removeRuleElement(ruleElement) {
        rulesListElement.removeChild(ruleElement);
      }
    });

    function emitRulesChange() {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: RULES_CHANGE
      });
    }
  });
});

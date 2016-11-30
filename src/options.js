import storage from './lib/storage';

const wrapper = document.getElementById('rules');
const noResultsElement = document.getElementById('no-results');

storage.getAllRules((result) => {
  const projectWithRules =
    Object
      .keys(result)
      .filter((projectName) => result[projectName].length > 0);

  if (projectWithRules.length > 0) {
    projectWithRules
      .forEach((projectName) => {
        const rules = result[projectName];

        const container = document.createElement('article');
        container.setAttribute('data-project-name', projectName);
        container.classList.add('item');

        const title = document.createElement('div');
        title.textContent = projectName;

        container.appendChild(title);

        const rulesListElement = document.createElement('ul');

        rules.forEach((rule) => {
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
            storage.removeRule(projectName, rule);
            location.reload();
          });

          const slaveCell = document.createElement('div');
          slaveCell.classList.add('table-cell');
          slaveCell.appendChild(button);

          ruleElement.appendChild(slaveCell);
          rulesListElement.appendChild(ruleElement);
        });

        container.appendChild(rulesListElement);
        wrapper.appendChild(container);
      });
  } else {
    noResultsElement.style.display = 'block';
  }

  const formElement = document.getElementById('add-rule-form');
  const projectNameInput = document.getElementById('add-rule-project-name');
  const ruleInput = document.getElementById('add-rule-rule');

  formElement.addEventListener('submit', (event) => {
    event.preventDefault();

    const projectName = projectNameInput.value;
    const rule = ruleInput.value;

    storage.addRule(projectName, rule, () => window.location.reload());
  });
});
